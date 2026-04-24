import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";
const CAMPAIGN_ID = "11111111-1111-4111-8111-111111111111";

describe("VS-05 draft-only mutation guards", () => {
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
    ({ CampaignModel } = await import("../src/infrastructure/database/models"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("allows PATCH /campaigns/:id when campaign is draft", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "draft",
      update
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .patch(`/campaigns/${CAMPAIGN_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated name" });

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ name: "Updated name" });
  });

  it("blocks PATCH /campaigns/:id with 409 when campaign is non-draft", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "scheduled",
      update
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .patch(`/campaigns/${CAMPAIGN_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated name" });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_STATE");
    expect(update).not.toHaveBeenCalled();
  });

  it("allows DELETE /campaigns/:id when campaign is draft", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "draft",
      destroy
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app).delete(`/campaigns/${CAMPAIGN_ID}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("blocks DELETE /campaigns/:id with 409 when campaign is non-draft", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "sent",
      destroy
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app).delete(`/campaigns/${CAMPAIGN_ID}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_STATE");
    expect(destroy).not.toHaveBeenCalled();
  });
});
