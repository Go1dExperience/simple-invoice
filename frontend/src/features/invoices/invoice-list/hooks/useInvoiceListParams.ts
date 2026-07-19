import { useSearchParams } from "react-router-dom";
import { ListParams } from "../../../../types/api";

const DEFAULTS = {
  page: 1,
  pageSize: 10,
  sortBy: "invoiceDate",
  ordering: "DESC",
} as const;

export const useInvoiceListParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: ListParams = {
    page: Number(searchParams.get("page")) || DEFAULTS.page,
    pageSize: Number(searchParams.get("pageSize")) || DEFAULTS.pageSize,
    sortBy:
      (searchParams.get("sortBy") as ListParams["sortBy"]) || DEFAULTS.sortBy,
    ordering:
      (searchParams.get("ordering") as ListParams["ordering"]) ||
      DEFAULTS.ordering,
    status: (searchParams.get("status") as ListParams["status"]) || undefined,
    keyword: searchParams.get("keyword") || undefined,
  };

  const update = (patch: Partial<ListParams>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  return {
    params,
    setKeyword: (keyword: string) =>
      update({ keyword: keyword || undefined, page: 1 }),
    setStatus: (status: ListParams["status"]) => update({ status, page: 1 }),
    setSort: (sortBy: ListParams["sortBy"]) => update({ sortBy }),
    setOrdering: (ordering: ListParams["ordering"]) => update({ ordering }),
    setPage: (page: number) => update({ page }),
  };
};
