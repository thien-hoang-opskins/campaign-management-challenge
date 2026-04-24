import { ApiError } from "../api/client";

const friendlyMessageByCode: Record<string, string> = {
  INVALID_CREDENTIALS: "Email or password is incorrect.",
  UNAUTHENTICATED: "Your session is missing or expired. Please log in again.",
  INVALID_STATE: "This action is not allowed for the campaign's current status.",
  INVALID_SCHEDULE_TIME: "Schedule time must be in the future.",
  CAMPAIGN_NOT_FOUND: "Campaign not found.",
  FORBIDDEN: "You do not have permission to perform this action.",
  VALIDATION_ERROR: "Please check the form values and try again.",
  NETWORK_ERROR: "Unable to reach the server. Please check your connection."
};

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    return friendlyMessageByCode[error.code] ?? error.message ?? fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
