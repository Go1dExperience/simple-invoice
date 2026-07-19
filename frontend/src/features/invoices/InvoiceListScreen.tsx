import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../api/useInvoices";
import { useInvoiceListParams } from "./useInvoiceListParams";
import { PageBand } from "../../components/PageBand";
import { Card } from "../../components/Card";
import { InvoiceTable } from "../../components/InvoiceTable";
import { Pagination } from "../../components/Pagination";
import { Button } from "../../components/Button";
import { DisplayStatus } from "../../api/types";

const STATUSES: DisplayStatus[] = ["Draft", "Pending", "Paid", "Overdue"];

export const InvoiceListScreen = () => {
  const navigate = useNavigate();
  const { params, setKeyword, setStatus, setSort, setOrdering, setPage } = useInvoiceListParams();
  const { data, isLoading } = useInvoices(params);

  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand>
        <div>
          <PageBand.Eyebrow>Home</PageBand.Eyebrow>
          <PageBand.Title>Invoices</PageBand.Title>
          <PageBand.Sub>All invoices in the system — search, filter, sort and paginate.</PageBand.Sub>
        </div>
        <PageBand.Actions>
          <Button onClick={() => navigate("/invoices/new")}>+ New invoice</Button>
        </PageBand.Actions>
      </PageBand>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            placeholder="Search by invoice number or customer name…"
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-accent"
          />
          <select
            onChange={(e) => setStatus((e.target.value || undefined) as DisplayStatus)}
            className="rounded-lg border border-slate-200 px-3 py-2.5"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSort(e.target.value as "invoiceDate")} className="rounded-lg border border-slate-200 px-3 py-2.5">
            <option value="invoiceDate">Sort: Invoice date</option>
            <option value="dueDate">Sort: Due date</option>
            <option value="totalAmount">Sort: Total amount</option>
          </select>
          <Button variant="ghost" onClick={() => setOrdering(params.ordering === "DESC" ? "ASC" : "DESC")}>
            {params.ordering} {params.ordering === "DESC" ? "↓" : "↑"}
          </Button>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-slate-400">Loading…</p>
        ) : (
          <InvoiceTable>
            {data?.data.map((inv) => (
              <InvoiceTable.Row key={inv.invoiceId} invoice={inv} onOpen={(id) => navigate(`/invoices/${id}`)} />
            ))}
          </InvoiceTable>
        )}
        {data && <Pagination page={data.paging.page} pageSize={data.paging.pageSize} total={data.paging.total} onPage={setPage} />}
      </Card>
    </div>
  );
};
