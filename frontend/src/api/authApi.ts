import { request } from "./client";

export type LoginInput = { email: string; password: string };
export type RegisterInput = { email: string; name: string; password: string };

export type AuthResponse = {
  token: string;
  user: { id: string; email: string; name: string };
};

export function login(input: LoginInput) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function register(input: RegisterInput) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
