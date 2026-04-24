import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/domain/errors/AppError";

const TEST_SECRET = "test-secret-12345";
const CAMPAIGN_ID = "11111111-1111-4111-8111-111111111111";

describe("VS-04 campaign detail and stats", () => {
  let getCampaignStats: typeof import("../src/application/use-cases/campaignService").getCampaignStats;
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let CampaignRecipientModel: typeof import("../src/infrastructure/database/models").CampaignRecipientModel;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

    ({ getCampaignStats } = await import("../src/application/use-cases/campaignService"));
    ({ CampaignModel, CampaignRecipientModel } = await import("../src/infrastructure/database/models"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns stats contract fields for GET /campaigns/:id/stats", async () => {
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({ id: CAMPAIGN_ID, createdBy: "user-1" } as never);
    vi.spyOn(CampaignRecipientModel, "findAll").mockResolvedValue(
      [
        { status: "sent", openedAt: new Date() },
        { status: "sent", openedAt: null },
        { status: "failed", openedAt: null }
      ] as never
    );

    const stats = await getCampaignStats("user-1", CAMPAIGN_ID);

    expect(stats).toEqual({
      total: 3,
      sent: 2,
      failed: 1,
      opened: 1,
      open_rate: 0.3333,
      send_rate: 0.6667
    });
  });

  it("returns 404 for missing campaign detail", async () => {
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue(null as never);
    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();

    const response = await request(app).get(`/campaigns/${CAMPAIGN_ID}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CAMPAIGN_NOT_FOUND");
  });

  it("returns 403 for unauthorized campaign stats access", async () => {
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({ id: CAMPAIGN_ID, createdBy: "other-user" } as never);
    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();

    const response = await request(app).get(`/campaigns/${CAMPAIGN_ID}/stats`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("throws AppError for unauthorized ownership in service layer", async () => {
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({ id: CAMPAIGN_ID, createdBy: "other-user" } as never);

    await expect(getCampaignStats("user-1", CAMPAIGN_ID)).rejects.toBeInstanceOf(AppError);
  });
});
