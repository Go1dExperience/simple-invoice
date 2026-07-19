import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../api/client";
import { ListParams, Paged } from "@/types/api";
import { InvoiceListItem } from "@/types/invoice";

export const useInvoices = (params: ListParams) =>
  useQuery({
    queryKey: ["invoices", params],
    queryFn: async () =>
      (await api.get<Paged<InvoiceListItem>>("/invoices", { params })).data,
  });
