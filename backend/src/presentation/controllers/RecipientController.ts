import { NextFunction, Request, Response } from "express";
import { createRecipientSchema } from "../../application/dtos/recipientDTO";
import { createRecipient, listRecipients } from "../../application/use-cases/recipientService";
import { validate } from "../utils/validate";

export class RecipientController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const recipients = await listRecipients();
      return res.status(200).json({ data: recipients });
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = validate(createRecipientSchema, req.body);
      const result = await createRecipient(input.email, input.name);
      return res.status(result.created ? 201 : 200).json(result.recipient);
    } catch (error) {
      return next(error);
    }
  }
}
