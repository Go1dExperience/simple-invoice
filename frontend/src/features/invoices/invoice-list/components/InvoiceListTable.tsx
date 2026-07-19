import { InvoiceTable } from "@/components/InvoiceTable";
import { Pagination } from "@/components/Pagination";
import { useNavigate } from "react-router-dom";
import { useInvoiceListParams } from "../hooks/useInvoiceListParams";
import { PageData } from "@/types";
import { InvoiceListItem } from "@/types/invoice";

type Props = {
  isLoading: boolean;
  data: PageData<InvoiceListItem>;
};
export const InvoiceListTable = ({ isLoading, data }: Props) => {
  const navigate = useNavigate();
  const { setPage } = useInvoiceListParams();
  if (isLoading || !data) {
    return <p className="py-10 text-center text-slate-400">Loading…</p>;
  }
  return (
    <>
      <InvoiceTable>
        {data?.data.map((inv) => (
          <InvoiceTable.Row
            key={inv.invoiceId}
            invoice={inv}
            onOpen={(id) => navigate(`/invoices/${id}`)}
          />
        ))}
      </InvoiceTable>
      <Pagination
        page={data.paging.page}
        pageSize={data.paging.pageSize}
        total={data.paging.total}
        onPage={setPage}
      />
    </>
  );
};
