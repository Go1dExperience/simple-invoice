import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../../api/useInvoices";
import { useInvoiceListParams } from "./hooks/useInvoiceListParams";
import { PageBand } from "../../../components/PageBand";
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
          <InvoiceListFilter />
        </div>
        <InvoiceListTable isLoading={isLoading} data={data} />
      </Card>
    </div>
  );
};
