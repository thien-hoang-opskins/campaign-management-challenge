import { ZodTypeAny } from "zod";
import { AppError } from "../../domain/errors/AppError";

export function validate<T extends ZodTypeAny>(schema: T, payload: unknown) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Request validation failed", parsed.error.flatten());
  }
  return parsed.data;
}
