import { useMutation } from "@tanstack/react-query";
import { api, TOKEN_KEY } from "./client";

export const useLogin = () =>
  useMutation({
    mutationFn: async (body: { email: string; password: string }) =>
      (
        await api.post<{ accessToken: string; user: { id: string; email: string; fullname: string } }>(
          "/auth/login",
          body,
        )
      ).data,
    onSuccess: (res) => localStorage.setItem(TOKEN_KEY, res.accessToken),
  });
