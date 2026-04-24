import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";
const CAMPAIGN_ID = "11111111-1111-4111-8111-111111111111";

describe("VS-06 scheduling flow", () => {
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let sequelize: typeof import("../src/infrastructure/database/sequelize").sequelize;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
    ({ CampaignModel } = await import("../src/infrastructure/database/models"));
    ({ sequelize } = await import("../src/infrastructure/database/sequelize"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("transitions draft campaign to scheduled with future timestamp", async () => {
    const tx = {} as never;
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback: any) => callback(tx));

    const update = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "draft",
      scheduledAt: null,
      update
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const app = createApp();
    const response = await request(app)
      .post(`/campaigns/${CAMPAIGN_ID}/schedule`)
      .set("Authorization", `Bearer ${token}`)
      .send({ scheduledAt });

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      {
        status: "scheduled",
        scheduledAt: new Date(scheduledAt)
      },
      expect.any(Object)
    );
  });

  it("rejects past/current schedule timestamp with clear validation error", async () => {
    const tx = {} as never;
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback: any) => callback(tx));

    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "draft",
      scheduledAt: null,
      update: vi.fn()
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const scheduledAt = new Date(Date.now() - 60 * 1000).toISOString();
    const app = createApp();
    const response = await request(app)
      .post(`/campaigns/${CAMPAIGN_ID}/schedule`)
      .set("Authorization", `Bearer ${token}`)
      .send({ scheduledAt });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_SCHEDULE_TIME");
    expect(response.body.error.message).toContain("future");
  });

  it("rejects scheduling for non-draft campaign with 409", async () => {
    const tx = {} as never;
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback: any) => callback(tx));

    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "scheduled",
      scheduledAt: null,
      update: vi.fn()
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const scheduledAt = new Date(Date.now() + 60 * 1000).toISOString();
    const app = createApp();
    const response = await request(app)
      .post(`/campaigns/${CAMPAIGN_ID}/schedule`)
      .set("Authorization", `Bearer ${token}`)
      .send({ scheduledAt });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_STATE");
  });
});
