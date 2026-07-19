import { Card } from "@/components/Card";
import { InvoicePriceRow } from "./InvoicePriceRow";
import { InvoiceDetail } from "@/types/invoice";
type Props = {
  invoice: NoInfer<InvoiceDetail> | undefined;
};

const PriceRowMapping = {
  Subtotal: "invoiceSubTotal",
  Tax: "totalTax",
  Discount: "totalDiscount",
  Total: "totalAmount",
  Paid: "totalPaid",
} as const;

export const InvoicePriceBreakdown = ({ invoice }: Props) => {
  if (!invoice) {
    return;
  }
  const sym = invoice.currencySymbol;
  return (
    <div className="mt-4">
      <Card>
        <Card.Header>Line items</Card.Header>
        {invoice.items.map((it) => (
          <InvoicePriceRow name={it.name}>
            {it.quantity} × {sym}
            {it.rate}
          </InvoicePriceRow>
        ))}
        <div className="ml-auto mt-2 max-w-sm">
          {Object.keys(PriceRowMapping).map((label) => (
            <InvoicePriceRow name={label}>
              {sym}
              {invoice[PriceRowMapping[label as keyof typeof PriceRowMapping]]}
            </InvoicePriceRow>
          ))}
          <div className="flex justify-between py-2 text-sm font-bold text-red-600">
            <span>Outstanding balance</span>
            <span className="tabular-nums">
              {sym}
              {invoice.balanceAmount}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
