import { useState } from "react";
import { ListParams } from "../../api/types";

export const useInvoiceListParams = () => {
  const [params, setParams] = useState<ListParams>({ page: 1, pageSize: 10, sortBy: "invoiceDate", ordering: "DESC" });
  return {
    params,
    setKeyword: (keyword: string) => setParams((p) => ({ ...p, keyword: keyword || undefined, page: 1 })),
    setStatus: (status: ListParams["status"]) => setParams((p) => ({ ...p, status, page: 1 })),
    setSort: (sortBy: ListParams["sortBy"]) => setParams((p) => ({ ...p, sortBy })),
    setOrdering: (ordering: ListParams["ordering"]) => setParams((p) => ({ ...p, ordering })),
    setPage: (page: number) => setParams((p) => ({ ...p, page })),
  };
};
