import { NextFunction, Request, Response } from "express";
import {
  campaignIdSchema,
  createCampaignSchema,
  listCampaignsSchema,
  scheduleCampaignSchema,
  updateCampaignSchema
} from "../../application/dtos/campaignDTO";
import {
  createCampaign,
  deleteCampaign,
  getCampaignDetails,
  getCampaignStats,
  listCampaigns,
  scheduleCampaign,
  sendCampaign,
  updateCampaign
} from "../../application/use-cases/campaignService";
import { AppError } from "../../domain/errors/AppError";
import { validate } from "../utils/validate";

function requireUserId(req: Request) {
  if (!req.auth?.userId) {
    throw new AppError(401, "UNAUTHENTICATED", "Missing authenticated user");
  }
  return req.auth.userId;
}

export class CampaignController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const query = validate(listCampaignsSchema, req.query);
      const data = await listCampaigns(userId, query.page, query.pageSize);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const input = validate(createCampaignSchema, req.body);
      const campaign = await createCampaign(userId, input);
      return res.status(201).json(campaign);
    } catch (error) {
      return next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      const campaign = await getCampaignDetails(userId, params.id);
      return res.status(200).json(campaign);
    } catch (error) {
      return next(error);
    }
  }

  static async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      const input = validate(updateCampaignSchema, req.body);
      const campaign = await updateCampaign(userId, params.id, input);
      return res.status(200).json(campaign);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      await deleteCampaign(userId, params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  }

  static async schedule(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      const input = validate(scheduleCampaignSchema, req.body);
      const campaign = await scheduleCampaign(userId, params.id, input.scheduledAt);
      return res.status(200).json(campaign);
    } catch (error) {
      return next(error);
    }
  }

  static async send(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      const result = await sendCampaign(userId, params.id);
      return res.status(202).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = requireUserId(req);
      const params = validate(campaignIdSchema, req.params);
      const stats = await getCampaignStats(userId, params.id);
      return res.status(200).json(stats);
    } catch (error) {
      return next(error);
    }
  }
}
