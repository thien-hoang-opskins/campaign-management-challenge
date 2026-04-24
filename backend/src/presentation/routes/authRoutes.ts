import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export const authRoutes = Router();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
