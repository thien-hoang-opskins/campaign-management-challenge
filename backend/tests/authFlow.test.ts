import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-secret-12345";

describe("VS-01 auth flow", () => {
  let UserModel: typeof import("../src/infrastructure/database/models").UserModel;
  let createApp: typeof import("../src/presentation/app").createApp;
  let authMiddleware: typeof import("../src/presentation/middleware/authMiddleware").authMiddleware;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? TEST_SECRET;
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

    ({ UserModel } = await import("../src/infrastructure/database/models"));
    ({ createApp } = await import("../src/presentation/app"));
    ({ authMiddleware } = await import("../src/presentation/middleware/authMiddleware"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("authenticates valid credentials via POST /auth/login", async () => {
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);
    vi.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "user-1",
      email: "operator@example.com",
      name: "Operator",
      passwordHash
    } as never);

    const app = createApp();
    const response = await request(app).post("/auth/login").send({
      email: "operator@example.com",
      password
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: "user-1",
      email: "operator@example.com",
      name: "Operator"
    });
    expect(typeof response.body.token).toBe("string");
    expect(response.body.token.length).toBeGreaterThan(10);
  });

  it("returns meaningful 401 payload for invalid credentials", async () => {
    const passwordHash = await bcrypt.hash("some-password", 10);
    vi.spyOn(UserModel, "findOne").mockResolvedValue({
      id: "user-2",
      email: "operator@example.com",
      name: "Operator",
      passwordHash
    } as never);

    const app = createApp();
    const response = await request(app).post("/auth/login").send({
      email: "operator@example.com",
      password: "wrong-password"
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
      details: undefined
    });
  });

  it("protects campaign routes and returns 401 payload when unauthenticated", async () => {
    const app = createApp();
    const response = await request(app).get("/campaigns");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual({
      code: "UNAUTHENTICATED",
      message: "Missing bearer token",
      details: undefined
    });
  });

  it("accepts valid bearer token in auth middleware", async () => {
    const token = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET ?? TEST_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const next = vi.fn();
    authMiddleware(req, {} as any, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.auth).toEqual({ userId: "user-1" });
  });
});
