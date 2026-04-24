import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";

describe("VS-03 campaign list", () => {
  let listCampaigns: typeof import("../src/application/use-cases/campaignService").listCampaigns;
  let CampaignModel: typeof import("../src/infrastructure/database/models").CampaignModel;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

    ({ listCampaigns } = await import("../src/application/use-cases/campaignService"));
    ({ CampaignModel } = await import("../src/infrastructure/database/models"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("filters campaigns by owner and applies pagination offsets", async () => {
    vi.spyOn(CampaignModel, "findAndCountAll").mockResolvedValue({
      rows: [],
      count: 21
    } as never);

    const result = await listCampaigns("owner-1", 2, 10);

    expect(CampaignModel.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { createdBy: "owner-1" },
        offset: 10,
        limit: 10
      })
    );
    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 10,
      totalItems: 21,
      totalPages: 3
    });
  });

  it("returns paginated campaigns from GET /campaigns", async () => {
    vi.spyOn(CampaignModel, "findAndCountAll").mockResolvedValue({
      rows: [
        {
          id: "campaign-1",
          name: "Draft campaign",
          subject: "Subject",
          status: "draft",
          scheduledAt: null,
          createdAt: new Date("2026-04-24T00:00:00.000Z"),
          updatedAt: new Date("2026-04-24T00:00:00.000Z")
        }
      ],
      count: 1
    } as never);

    const token = jwt.sign({ userId: "owner-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app).get("/campaigns?page=1&pageSize=10").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1
    });
  });
});
