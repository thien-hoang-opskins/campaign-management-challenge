import { NextFunction, Request, Response } from "express";
import { AppError } from "../../domain/errors/AppError";
import { logger } from "../../infrastructure/config/logger";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  logger.error({ err: error }, "Unhandled API error");
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error"
    }
  });
}
