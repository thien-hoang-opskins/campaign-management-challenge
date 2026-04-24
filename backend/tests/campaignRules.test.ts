import { describe, expect, it } from "vitest";
import { AppError } from "../src/domain/errors/AppError";
import {
  ensureDraftOnlyMutation,
  ensureFutureSchedule,
  ensureSendable
} from "../src/domain/services/campaignRules";

describe("campaign business rules", () => {
  it("allows draft-only mutation for draft campaigns", () => {
    expect(() => ensureDraftOnlyMutation("draft")).not.toThrow();
  });

  it("rejects non-draft campaign mutation", () => {
    expect(() => ensureDraftOnlyMutation("scheduled")).toThrow(AppError);
  });

  it("rejects schedule timestamp in the past", () => {
    const date = new Date(Date.now() - 60_000);
    expect(() => ensureFutureSchedule(date)).toThrow(AppError);
  });

  it("rejects sending campaign that is already sent", () => {
    expect(() => ensureSendable("sent")).toThrow(AppError);
  });
});
