import { z } from "zod";

export const createRecipientSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1).optional()
});
