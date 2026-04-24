import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: { id: string; email: string; name: string } | null;
  setSession: (session: { token: string; user: { id: string; email: string; name: string } }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null })
}));
