import { useNavigate } from "react-router-dom";
import { useInvoices } from "./hooks/useInvoices";
import { useInvoiceListParams } from "./hooks/useInvoiceListParams";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/ui/button";
import { InvoiceListFilter } from "./components/InvoiceListFilter";
import { InvoiceListTable } from "./components/InvoiceListTable";

export const InvoiceListScreen = () => {
  const navigate = useNavigate();
  const { params } = useInvoiceListParams();
  const { data, isLoading } = useInvoices(params);

  return (
    <div className="mx-auto max-w-5xl p-7">
      <div className="mb-5 flex justify-end">
        <Button onClick={() => navigate("/invoices/new")}>
          + New invoice
        </Button>
      </div>
      <Card>
        <InvoiceListFilter />
        <InvoiceListTable isLoading={isLoading} data={data} />
      </Card>
    </div>
  );
};
