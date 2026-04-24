export type CampaignStatus = "draft" | "scheduled" | "sent" | string;

export type CampaignListItem = {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignStats = {
  total: number;
  sent: number;
  failed: number;
  opened: number;
  open_rate: number;
  send_rate: number;
};

export type CampaignDetail = CampaignListItem & {
  body: string;
  recipients: Array<{
    recipientId: string;
    status: "pending" | "sent" | "failed";
    sentAt: string | null;
    openedAt: string | null;
  }>;
  stats: CampaignStats;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type Recipient = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};
