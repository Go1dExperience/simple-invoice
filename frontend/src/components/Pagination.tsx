import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import { Pagination as PaginationNav, PaginationContent, PaginationItem } from "./ui/pagination";

const pageButtonClass = (active: boolean) =>
  cn(buttonVariants({ variant: active ? "default" : "outline", size: "icon" }), "h-8 w-8 font-normal disabled:opacity-40");

export const Pagination = ({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
}) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
      <span>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </span>
      <PaginationNav className="mx-0 w-auto">
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <button
              disabled={page <= 1}
              onClick={() => onPage(page - 1)}
              aria-label="Go to previous page"
              className={pageButtonClass(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </PaginationItem>
          {pageNumbers.map((p) => (
            <PaginationItem key={p}>
              <button
                onClick={() => onPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={pageButtonClass(p === page)}
              >
                {p}
              </button>
            </PaginationItem>
          ))}
          <PaginationItem>
            <button
              disabled={page >= pages}
              onClick={() => onPage(page + 1)}
              aria-label="Go to next page"
              className={pageButtonClass(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </PaginationNav>
    </div>
  );
};
