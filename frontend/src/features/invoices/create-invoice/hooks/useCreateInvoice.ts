import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../api/client";
import { CreateInvoiceBody } from "../types";
import { InvoiceDetail } from "@/types/invoice";

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateInvoiceBody) =>
      (await api.post<InvoiceDetail>("/invoices", body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
};
