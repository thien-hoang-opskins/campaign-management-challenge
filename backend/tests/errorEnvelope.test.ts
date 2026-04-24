import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";
const CAMPAIGN_ID = "11111111-1111-4111-8111-111111111111";

describe("VS-08 consistent API error envelope", () => {
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

  it("returns standard error shape for unauthenticated access", async () => {
    const app = createApp();
    const response = await request(app).get("/campaigns");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual(
      expect.objectContaining({
        code: "UNAUTHENTICATED",
        message: expect.any(String)
      })
    );
  });

  it("returns machine-readable code with standard envelope for key business failure", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(CampaignModel, "findByPk").mockResolvedValue({
      id: CAMPAIGN_ID,
      createdBy: "user-1",
      status: "sent",
      update
    } as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .patch(`/campaigns/${CAMPAIGN_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "no-op" });

    expect(response.status).toBe(409);
    expect(response.body.error).toEqual(
      expect.objectContaining({
        code: "INVALID_STATE",
        message: expect.any(String)
      })
    );
    expect(update).not.toHaveBeenCalled();
  });
});
