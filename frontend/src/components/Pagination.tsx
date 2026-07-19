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
      <div className="flex gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="h-8 w-8 rounded-lg border border-slate-200 disabled:opacity-40"
        >
          ‹
        </button>
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={
              p === page
                ? "h-8 w-8 rounded-lg border border-accent bg-accent font-bold text-ink"
                : "h-8 w-8 rounded-lg border border-slate-200 text-slate-500"
            }
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="h-8 w-8 rounded-lg border border-slate-200 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
};
