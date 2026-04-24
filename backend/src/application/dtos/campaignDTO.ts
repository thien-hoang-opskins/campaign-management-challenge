import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  body: z.string().trim().min(1, "Body is required"),
  recipientEmails: z.array(z.string().email()).default([])
});

export const updateCampaignSchema = z
  .object({
    name: z.string().min(1).optional(),
    subject: z.string().min(1).optional(),
    body: z.string().min(1).optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, { message: "At least one field is required" });

export const scheduleCampaignSchema = z.object({
  scheduledAt: z.coerce.date()
});

export const campaignIdSchema = z.object({
  id: z.string().uuid()
});

export const listCampaignsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20)
});
