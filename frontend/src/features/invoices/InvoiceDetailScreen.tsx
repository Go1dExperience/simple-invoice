import { useParams } from "react-router-dom";
import { useInvoice } from "../../api/useInvoice";
import { PageBand } from "../../components/PageBand";
import { Card } from "../../components/Card";
import { StatusBadge } from "../../components/StatusBadge";

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="grid grid-cols-[140px_1fr] gap-4 py-1 text-sm">
    <span className="text-slate-500">{label}</span>
    <span>{value}</span>
  </div>
);

export const InvoiceDetailScreen = () => {
  const { id = "" } = useParams();
  const { data: inv, isLoading } = useInvoice(id);
  if (isLoading || !inv) return <div className="mx-auto max-w-5xl p-7 text-slate-400">Loading…</div>;
  const sym = inv.currencySymbol;

  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand>
        <div>
          <PageBand.Eyebrow>Invoice detail</PageBand.Eyebrow>
          <PageBand.Title>{inv.invoiceNumber}</PageBand.Title>
          <PageBand.Sub>{inv.invoiceReference ? `Reference ${inv.invoiceReference}` : ""}</PageBand.Sub>
        </div>
        <PageBand.Actions>
          <StatusBadge status={inv.status} />
        </PageBand.Actions>
      </PageBand>

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

      <div className="mt-4">
        <Card>
          <Card.Header>Line items</Card.Header>
          {inv.items.map((it) => (
            <div key={it.id} className="flex justify-between border-b border-slate-100 py-2 text-sm">
              <span>{it.name}</span>
              <span className="tabular-nums">
                {it.quantity} × {sym}
                {it.rate}
              </span>
            </div>
          ))}
          <div className="ml-auto mt-2 max-w-sm">
            {(
              [
                ["Subtotal", inv.invoiceSubTotal],
                ["Tax", inv.totalTax],
                ["Discount", inv.totalDiscount],
                ["Total", inv.totalAmount],
                ["Paid", inv.totalPaid],
              ] as const
            ).map(([l, v]) => (
              <div key={l} className="flex justify-between border-b border-slate-100 py-2 text-sm">
                <span className="text-slate-500">{l}</span>
                <span className="tabular-nums">
                  {sym}
                  {v}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-2 text-sm font-bold text-red-600">
              <span>Outstanding balance</span>
              <span className="tabular-nums">
                {sym}
                {inv.balanceAmount}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
