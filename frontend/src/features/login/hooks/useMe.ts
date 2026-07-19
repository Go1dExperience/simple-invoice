import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/client";

export const useMe = (enabled = true) =>
  useQuery({
    queryKey: ["me"],
    enabled,
    queryFn: async () =>
      (await api.get<{ id: string; email: string }>("/auth/me")).data,
  });
