import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import { InvoiceDetail } from "./types";

export const useInvoice = (id: string) =>
  useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => (await api.get<InvoiceDetail>(`/invoices/${id}`)).data,
  });
