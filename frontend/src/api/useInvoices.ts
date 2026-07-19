import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import { ListParams, Paged, InvoiceListItem } from "./types";

export const useInvoices = (params: ListParams) =>
  useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => (await api.get<Paged<InvoiceListItem>>("/invoices", { params })).data,
  });
