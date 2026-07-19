import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../../api/useInvoices";
import { useInvoiceListParams } from "../useInvoiceListParams";
import { PageBand } from "../../../components/PageBand";
import { Card } from "../../../components/Card";
import { InvoiceTable } from "../../../components/InvoiceTable";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { DisplayStatus } from "../../../api/types";
import { ArrowDown, ArrowUp } from "../../../assets/svg";

const STATUSES: DisplayStatus[] = ["Draft", "Pending", "Paid", "Overdue"];

export const InvoiceListScreen = () => {
  const navigate = useNavigate();
  const { params, setKeyword, setStatus, setSort, setOrdering, setPage } =
    useInvoiceListParams();
  const { data, isLoading } = useInvoices(params);

  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand>
        <div>
          <PageBand.Eyebrow>Home</PageBand.Eyebrow>
          <PageBand.Title>Invoices</PageBand.Title>
          <PageBand.Sub>
            All invoices in the system — search, filter, sort and paginate.
          </PageBand.Sub>
        </div>
        <PageBand.Actions>
          <Button onClick={() => navigate("/invoices/new")}>
            + New invoice
          </Button>
        </PageBand.Actions>
      </PageBand>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            placeholder="Search by invoice number or customer name…"
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-accent"
          />
          <Select onChange={(e) => setStatus((e.target.value || undefined) as DisplayStatus)}>
            <Select.Option value="">All statuses</Select.Option>
            {STATUSES.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
          <Select onChange={(e) => setSort(e.target.value as "invoiceDate")}>
            <Select.Option value="invoiceDate">Sort: Invoice date</Select.Option>
            <Select.Option value="dueDate">Sort: Due date</Select.Option>
            <Select.Option value="totalAmount">Sort: Total amount</Select.Option>
          </Select>
          <Button
            variant="ghost"
            className="flex flex-row items-center gap-2"
            onClick={() =>
              setOrdering(params.ordering === "DESC" ? "ASC" : "DESC")
            }
          >
            {params.ordering}{" "}
            {params.ordering === "DESC" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-slate-400">Loading…</p>
        ) : (
          <InvoiceTable>
            {data?.data.map((inv) => (
              <InvoiceTable.Row
                key={inv.invoiceId}
                invoice={inv}
                onOpen={(id) => navigate(`/invoices/${id}`)}
              />
            ))}
          </InvoiceTable>
        )}
        {data && (
          <Pagination
            page={data.paging.page}
            pageSize={data.paging.pageSize}
            total={data.paging.total}
            onPage={setPage}
          />
        )}
      </Card>
    </div>
  );
};
