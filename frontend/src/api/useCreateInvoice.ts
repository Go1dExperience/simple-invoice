import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { CreateInvoiceBody, InvoiceDetail } from "./types";

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateInvoiceBody) => (await api.post<InvoiceDetail>("/invoices", body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
};
