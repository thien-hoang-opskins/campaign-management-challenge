import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";
const CAMPAIGN_ID = "11111111-1111-4111-8111-111111111111";

describe("VS-07 send flow", () => {
  let sendCampaign: typeof import("../src/application/use-cases/campaignService").sendCampaign;
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let CampaignRecipientModel: typeof import("../src/infrastructure/database/models").CampaignRecipientModel;
  let sequelize: typeof import("../src/infrastructure/database/sequelize").sequelize;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
    ({ sendCampaign } = await import("../src/application/use-cases/campaignService"));
    ({ CampaignModel, CampaignRecipientModel } = await import("../src/infrastructure/database/models"));
    ({ sequelize } = await import("../src/infrastructure/database/sequelize"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("updates recipient statuses to sent/failed and finalizes campaign as sent", async () => {
    const tx = { LOCK: { UPDATE: "UPDATE" } } as never;
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback: any) => callback(tx));

    const campaign = {
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "draft",
      scheduledAt: null,
      update: vi.fn().mockResolvedValue(undefined)
    };
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue(campaign as never);

    const sentRecipientLink = {
      status: "pending",
      sentAt: null as Date | null,
      openedAt: null,
      recipient: { email: "ok@example.com" },
      update: vi.fn(async (payload: { status: "sent" | "failed"; sentAt: Date | null }) => {
        sentRecipientLink.status = payload.status;
        sentRecipientLink.sentAt = payload.sentAt;
      })
    };
    const failedRecipientLink = {
      status: "pending",
      sentAt: null as Date | null,
      openedAt: null,
      recipient: { email: "shouldfail@example.com" },
      update: vi.fn(async (payload: { status: "sent" | "failed"; sentAt: Date | null }) => {
        failedRecipientLink.status = payload.status;
        failedRecipientLink.sentAt = payload.sentAt;
      })
    };

    vi.spyOn(CampaignRecipientModel, "findAll").mockResolvedValue([
      sentRecipientLink,
      failedRecipientLink
    ] as never);

    const result = await sendCampaign("user-1", CAMPAIGN_ID);

    expect(CampaignModel.findByPk).toHaveBeenCalledWith(
      CAMPAIGN_ID,
      expect.objectContaining({ lock: "UPDATE" })
    );
    expect(sentRecipientLink.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "sent", sentAt: expect.any(Date) }),
      expect.any(Object)
    );
    expect(failedRecipientLink.update).toHaveBeenCalledWith(
      { status: "failed", sentAt: null },
      expect.any(Object)
    );
    expect(campaign.update).toHaveBeenCalledWith({ status: "sent", scheduledAt: null }, expect.any(Object));
    expect(result.stats).toEqual({
      total: 2,
      sent: 1,
      failed: 1,
      opened: 0,
      open_rate: 0,
      send_rate: 0.5
    });
  });

  it("returns 409 conflict for repeated send after campaign is already sent", async () => {
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "sent",
      scheduledAt: null
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app).post(`/campaigns/${CAMPAIGN_ID}/send`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("ALREADY_SENT");
  });
});
