import { Op, Transaction } from "sequelize";
import { AppError } from "../../domain/errors/AppError";
import {
  ensureDraftOnlyMutation,
  ensureFutureSchedule,
  ensureSendable
} from "../../domain/services/campaignRules";
import {
  CampaignModel,
  CampaignRecipientModel,
  RecipientModel
} from "../../infrastructure/database/models";
import { sequelize } from "../../infrastructure/database/sequelize";

type CreateCampaignInput = {
  name: string;
  subject: string;
  body: string;
  recipientEmails: string[];
};

type UpdateCampaignInput = {
  name?: string;
  subject?: string;
  body?: string;
};

async function getOwnedCampaignOrFail(
  campaignId: string,
  userId: string,
  options?: { tx?: Transaction; lock?: Transaction["LOCK"]["UPDATE"] }
) {
  const campaign = await CampaignModel.findByPk(campaignId, {
    transaction: options?.tx,
    ...(options?.lock ? { lock: options.lock } : {})
  });
  if (!campaign) {
    throw new AppError(404, "CAMPAIGN_NOT_FOUND", "Campaign not found");
  }
  if (campaign.createdBy !== userId) {
    throw new AppError(403, "FORBIDDEN", "You do not own this campaign");
  }
  return campaign;
}

async function upsertRecipientsByEmails(emails: string[], tx: Transaction) {
  const uniqueEmails = Array.from(new Set(emails.map((email) => email.toLowerCase())));
  if (uniqueEmails.length === 0) {
    return [];
  }

  const existing = await RecipientModel.findAll({
    where: { email: { [Op.in]: uniqueEmails } },
    transaction: tx
  });
  const existingMap = new Map(existing.map((recipient) => [recipient.email, recipient]));

  const missingEmails = uniqueEmails.filter((email) => !existingMap.has(email));
  if (missingEmails.length > 0) {
    const created = await RecipientModel.bulkCreate(
      missingEmails.map((email) => ({ email })),
      { transaction: tx }
    );
    created.forEach((recipient) => existingMap.set(recipient.email, recipient));
  }

  return uniqueEmails.map((email) => existingMap.get(email)).filter(Boolean) as RecipientModel[];
}

export async function listCampaigns(userId: string, page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  const { rows, count } = await CampaignModel.findAndCountAll({
    where: { createdBy: userId },
    order: [["created_at", "DESC"]],
    offset,
    limit: pageSize
  });

  return {
    data: rows,
    pagination: {
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize)
    }
  };
}

export async function createCampaign(userId: string, input: CreateCampaignInput) {
  return sequelize.transaction(async (tx) => {
    const campaign = await CampaignModel.create(
      {
        name: input.name,
        subject: input.subject,
        body: input.body,
        status: "draft",
        createdBy: userId,
        scheduledAt: null
      },
      { transaction: tx }
    );

    const recipients = await upsertRecipientsByEmails(input.recipientEmails, tx);
    if (recipients.length > 0) {
      await CampaignRecipientModel.bulkCreate(
        recipients.map((recipient) => ({
          campaignId: campaign.id,
          recipientId: recipient.id,
          status: "pending"
        })),
        { transaction: tx, ignoreDuplicates: true }
      );
    }

    return campaign;
  });
}

export async function getCampaignDetails(userId: string, campaignId: string) {
  const campaign = await getOwnedCampaignOrFail(campaignId, userId);
  const [links, stats] = await Promise.all([
    CampaignRecipientModel.findAll({
      where: { campaignId },
      include: [{ model: RecipientModel, as: "recipient" }]
    }),
    getCampaignStats(userId, campaignId)
  ]);

  return {
    ...campaign.toJSON(),
    recipients: links.map((link) => ({
      recipientId: link.recipientId,
      status: link.status,
      sentAt: link.sentAt,
      openedAt: link.openedAt
    })),
    stats
  };
}

export async function updateCampaign(userId: string, campaignId: string, input: UpdateCampaignInput) {
  const campaign = await getOwnedCampaignOrFail(campaignId, userId);
  ensureDraftOnlyMutation(campaign.status);
  await campaign.update(input);
  return campaign;
}

export async function deleteCampaign(userId: string, campaignId: string) {
  const campaign = await getOwnedCampaignOrFail(campaignId, userId);
  ensureDraftOnlyMutation(campaign.status);
  await campaign.destroy();
}

export async function scheduleCampaign(userId: string, campaignId: string, scheduledAt: Date) {
  return sequelize.transaction(async (tx) => {
    const campaign = await getOwnedCampaignOrFail(campaignId, userId, { tx });
    ensureDraftOnlyMutation(campaign.status);
    ensureFutureSchedule(scheduledAt);
    await campaign.update({ status: "scheduled", scheduledAt }, { transaction: tx });
    return campaign;
  });
}

export async function sendCampaign(userId: string, campaignId: string) {
  return sequelize.transaction(async (tx) => {
    const campaign = await getOwnedCampaignOrFail(campaignId, userId, { tx, lock: tx.LOCK.UPDATE });
    ensureSendable(campaign.status);

    const links = await CampaignRecipientModel.findAll({
      where: { campaignId },
      include: [{ model: RecipientModel, as: "recipient" }],
      lock: tx.LOCK.UPDATE,
      transaction: tx
    });

    const now = new Date();
    for (const link of links) {
      const email = ((link as unknown as { recipient?: { email?: string } }).recipient?.email ?? "").toLowerCase();
      const localPart = email.split("@")[0] ?? "";
      const shouldFail = localPart.includes("fail");
      await link.update(
        {
          status: shouldFail ? "failed" : "sent",
          sentAt: shouldFail ? null : now
        },
        { transaction: tx }
      );
    }

    await campaign.update({ status: "sent", scheduledAt: campaign.scheduledAt }, { transaction: tx });

    const stats = await getCampaignStats(userId, campaignId, tx);
    return { jobId: `send-${campaign.id}-${Date.now()}`, stats };
  });
}

export async function getCampaignStats(userId: string, campaignId: string, tx?: Transaction) {
  await getOwnedCampaignOrFail(campaignId, userId, { tx });

  const links = await CampaignRecipientModel.findAll({ where: { campaignId }, transaction: tx });
  const total = links.length;
  const sent = links.filter((item) => item.status === "sent").length;
  const failed = links.filter((item) => item.status === "failed").length;
  const opened = links.filter((item) => item.openedAt !== null).length;
  const openRate = total === 0 ? 0 : opened / total;
  const sendRate = total === 0 ? 0 : sent / total;

  return {
    total,
    sent,
    failed,
    opened,
    open_rate: Number(openRate.toFixed(4)),
    send_rate: Number(sendRate.toFixed(4))
  };
}
