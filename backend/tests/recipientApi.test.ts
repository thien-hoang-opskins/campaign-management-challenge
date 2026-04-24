import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";

describe("VS-09 recipient APIs", () => {
  let RecipientModel: typeof import("../src/infrastructure/database/models").RecipientModel;
  let createApp: typeof import("../src/presentation/app").createApp;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
    ({ RecipientModel } = await import("../src/infrastructure/database/models"));
    ({ createApp } = await import("../src/presentation/app"));
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("lists recipients via GET /recipients in authorized scope", async () => {
    vi.spyOn(RecipientModel, "findAll").mockResolvedValue([
      { id: "recipient-1", email: "jane@example.com", name: "Jane Doe" }
    ] as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app).get("/recipients").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].email).toBe("jane@example.com");
  });

  it("creates recipient with valid email via POST /recipients", async () => {
    vi.spyOn(RecipientModel, "findOrCreate").mockResolvedValue([
      { id: "recipient-2", email: "new@example.com", name: null },
      true
    ] as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .post("/recipients")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "new@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("new@example.com");
  });

  it("returns existing recipient on duplicate email with documented policy", async () => {
    vi.spyOn(RecipientModel, "findOrCreate").mockResolvedValue([
      { id: "recipient-3", email: "existing@example.com", name: "Existing" },
      false
    ] as never);

    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const app = createApp();
    const response = await request(app)
      .post("/recipients")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "existing@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("existing@example.com");
  });
});
