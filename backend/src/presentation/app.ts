import express from "express";
import pinoHttp from "pino-http";
import { logger } from "../infrastructure/config/logger";
import { authRoutes } from "./routes/authRoutes";
import { campaignRoutes } from "./routes/campaignRoutes";
import { recipientRoutes } from "./routes/recipientRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/authMiddleware";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.use("/auth", authRoutes);
  app.use("/campaigns", authMiddleware, campaignRoutes);
  app.use("/recipients", authMiddleware, recipientRoutes);

  app.use(errorHandler);
  return app;
}
