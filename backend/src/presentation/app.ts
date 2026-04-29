import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "../infrastructure/config/logger";
import { env } from "../infrastructure/config/env";
import { authRoutes } from "./routes/authRoutes";
import { campaignRoutes } from "./routes/campaignRoutes";
import { recipientRoutes } from "./routes/recipientRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/authMiddleware";

export function createApp() {
  const app = express();
  const allowAllOrigins = env.CORS_ORIGINS.trim() === "*";
  const allowedOrigins = env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow non-browser clients without an Origin header.
      if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.use("/auth", authRoutes);
  app.use("/campaigns", authMiddleware, campaignRoutes);
  app.use("/recipients", authMiddleware, recipientRoutes);

  app.use(errorHandler);
  return app;
}
