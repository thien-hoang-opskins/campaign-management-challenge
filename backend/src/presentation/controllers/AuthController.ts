import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../../application/dtos/authDTO";
import { loginUser, registerUser } from "../../application/use-cases/authService";
import { validate } from "../utils/validate";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = validate(registerSchema, req.body);
      const result = await registerUser(input);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = validate(loginSchema, req.body);
      const result = await loginUser(input);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
