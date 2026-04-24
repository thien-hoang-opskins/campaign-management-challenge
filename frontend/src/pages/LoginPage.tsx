import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { useAuthStore } from "../store/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const from = (location.state as { from?: string } | null)?.from ?? "/campaigns";

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      setSession(result);
      navigate(from, { replace: true });
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <main className="page narrow">
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="card form-grid">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button disabled={loginMutation.isPending} type="submit">
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>

        {loginMutation.isError && <ErrorAlert message={getApiErrorMessage(loginMutation.error, "Unable to login")} />}
      </form>
    </main>
  );
}
