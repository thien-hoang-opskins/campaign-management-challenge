import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../domain/errors/AppError";
import { env } from "../../infrastructure/config/env";

type AuthPayload = JwtPayload & { userId: string };

declare module "express-serve-static-core" {
  interface Request {
    auth?: { userId: string };
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "UNAUTHENTICATED", "Missing bearer token"));
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.auth = { userId: payload.userId };
    return next();
  } catch {
    return next(new AppError(401, "INVALID_TOKEN", "Invalid or expired token"));
  }
}
