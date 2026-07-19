import { useParams } from "react-router-dom";
import { useInvoice } from "./hooks/useInvoice";
import { PageBand } from "../../../components/PageBand";
import { Card } from "../../../components/Card";
import { StatusBadge } from "../../../components/StatusBadge";
import { InvoicePriceBreakdown } from "./components/InvoicePriceBreakdown";

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="grid grid-cols-[140px_1fr] gap-4 py-1 text-sm">
    <span className="text-slate-500">{label}</span>
    <span>{value}</span>
  </div>
);

export const InvoiceDetailScreen = () => {
  const { id = "" } = useParams();
  const { data: inv, isLoading } = useInvoice(id);
  if (isLoading || !inv)
    return <div className="mx-auto max-w-5xl p-7 text-slate-400">Loading…</div>;
  const sym = inv.currencySymbol;

  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand
        eyebrow="Invoice detail"
        title={inv.invoiceNumber}
        action={<StatusBadge status={inv.status} />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <Card.Header>Invoice information</Card.Header>
          <Row label="Invoice date" value={inv.invoiceDate} />
          <Row label="Due date" value={inv.dueDate} />
          <Row label="Currency" value={`${inv.currency} (${sym})`} />
          <Row label="Description" value={inv.description} />
        </Card>
        <Card>
          <Card.Header>Customer</Card.Header>
          <Row label="Name" value={inv.customer.fullname} />
          <Row label="Email" value={inv.customer.email} />
          <Row label="Mobile" value={inv.customer.mobileNumber} />
          <Row label="Address" value={inv.customer.address} />
        </Card>
      </div>
      <InvoicePriceBreakdown invoice={inv} />
    </div>
  );
};
