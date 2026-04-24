import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";

describe("VS-02 campaign creation", () => {
  let createCampaign: typeof import("../src/application/use-cases/campaignService").createCampaign;
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let RecipientModel: typeof import("../src/infrastructure/database/models").RecipientModel;
  let CampaignRecipientModel: typeof import("../src/infrastructure/database/models").CampaignRecipientModel;
  let sequelize: typeof import("../src/infrastructure/database/sequelize").sequelize;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

    ({ createCampaign } = await import("../src/application/use-cases/campaignService"));
    ({ CampaignModel, RecipientModel, CampaignRecipientModel } = await import(
      "../src/infrastructure/database/models"
    ));
    ({ sequelize } = await import("../src/infrastructure/database/sequelize"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates campaign in draft status and deduplicates recipient links", async () => {
    const tx = {} as never;
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback: any) => callback(tx));

    vi.spyOn(CampaignModel, "create").mockResolvedValue({ id: "campaign-1" } as never);
    vi.spyOn(RecipientModel, "findAll").mockResolvedValue([
      { id: "recipient-1", email: "alice@example.com" }
    ] as never);
    vi.spyOn(RecipientModel, "bulkCreate").mockResolvedValue([
      { id: "recipient-2", email: "bob@example.com" }
    ] as never);
    const linkSpy = vi.spyOn(CampaignRecipientModel, "bulkCreate").mockResolvedValue([] as never);

    await createCampaign("user-1", {
      name: "Spring Launch",
      subject: "New campaign",
      body: "Hello there",
      recipientEmails: ["Alice@example.com", "alice@example.com", "bob@example.com"]
    });

    expect(CampaignModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Spring Launch",
        subject: "New campaign",
        body: "Hello there",
        status: "draft",
        createdBy: "user-1"
      }),
      expect.any(Object)
    );

    expect(linkSpy).toHaveBeenCalledWith(
      [
        { campaignId: "campaign-1", recipientId: "recipient-1", status: "pending" },
        { campaignId: "campaign-1", recipientId: "recipient-2", status: "pending" }
      ],
      expect.objectContaining({ ignoreDuplicates: true })
    );
  });

  it("returns validation error payload for invalid POST /campaigns input", async () => {
    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .post("/campaigns")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "",
        subject: "  ",
        body: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.message).toBe("Request validation failed");
  });
});
