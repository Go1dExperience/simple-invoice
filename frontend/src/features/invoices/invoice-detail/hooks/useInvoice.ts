import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../api/client";
import { InvoiceDetail } from "@/types/invoice";

export const useInvoice = (id: string) =>
  useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => (await api.get<InvoiceDetail>(`/invoices/${id}`)).data,
  });
