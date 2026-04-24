import { Router } from "express";
import { CampaignController } from "../controllers/CampaignController";

export const campaignRoutes = Router();

campaignRoutes.get("/", CampaignController.list);
campaignRoutes.post("/", CampaignController.create);
campaignRoutes.get("/:id", CampaignController.getOne);
campaignRoutes.patch("/:id", CampaignController.patch);
campaignRoutes.delete("/:id", CampaignController.delete);
campaignRoutes.post("/:id/schedule", CampaignController.schedule);
campaignRoutes.post("/:id/send", CampaignController.send);
campaignRoutes.get("/:id/stats", CampaignController.stats);
