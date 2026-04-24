import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { AppError } from "../../domain/errors/AppError";
import { env } from "../../infrastructure/config/env";
import { UserModel } from "../../infrastructure/database/models";
import { LoginInput, RegisterInput } from "../dtos/authDTO";

function issueToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });
}

export async function registerUser(input: RegisterInput) {
  const existing = await UserModel.findOne({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    email: input.email,
    name: input.name,
    passwordHash
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token: issueToken(user.id)
  };
}

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  return {
    token: issueToken(user.id),
    user: { id: user.id, email: user.email, name: user.name }
  };
}
