import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(5434),
  DB_NAME: z.string().default("campaign_management_db"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres123"),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("1h")
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment: ${JSON.stringify(parsed.error.flatten())}`);
}

export const env = parsed.data;
