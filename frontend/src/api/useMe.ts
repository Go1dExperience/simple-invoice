import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get<{ id: string; email: string; fullname: string }>("/auth/me")).data,
  });
