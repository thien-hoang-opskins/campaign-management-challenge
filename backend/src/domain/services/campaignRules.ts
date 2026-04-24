import { AppError } from "../errors/AppError";
import { CampaignStatus } from "../../infrastructure/database/models";

export function ensureDraftOnlyMutation(status: CampaignStatus) {
  if (status !== "draft") {
    throw new AppError(409, "INVALID_STATE", "Only draft campaigns can be modified");
  }
}

export function ensureFutureSchedule(date: Date) {
  if (date.getTime() <= Date.now()) {
    throw new AppError(400, "INVALID_SCHEDULE_TIME", "scheduledAt must be in the future");
  }
}

export function ensureSendable(status: CampaignStatus) {
  if (status === "sent") {
    throw new AppError(409, "ALREADY_SENT", "Campaign has already been sent");
  }
}
