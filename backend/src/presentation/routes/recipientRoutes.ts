import { Router } from "express";
import { RecipientController } from "../controllers/RecipientController";

export const recipientRoutes = Router();

recipientRoutes.get("/", RecipientController.list);
recipientRoutes.post("/", RecipientController.create);
