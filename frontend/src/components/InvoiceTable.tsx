import { ReactNode } from "react";
import { InvoiceListItem } from "../api/types";
import { StatusBadge } from "./StatusBadge";

const InvoiceTable = ({ children }: { children: ReactNode }) => (
  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="border-b-2 border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
        <th className="p-3">Invoice #</th>
        <th className="p-3">Customer</th>
        <th className="p-3">Invoice date</th>
        <th className="p-3">Due date</th>
        <th className="p-3 text-right">Total</th>
        <th className="p-3">Status</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
const Row = ({ invoice, onOpen }: { invoice: InvoiceListItem; onOpen: (id: string) => void }) => (
  <tr onClick={() => onOpen(invoice.invoiceId)} className="cursor-pointer border-b border-slate-100 hover:bg-accent/10">
    <td className="p-3.5 tabular-nums">{invoice.invoiceNumber}</td>
    <td className="p-3.5">{invoice.customerName}</td>
    <td className="p-3.5 tabular-nums">{invoice.invoiceDate}</td>
    <td className="p-3.5 tabular-nums">{invoice.dueDate}</td>
    <td className="p-3.5 text-right font-bold tabular-nums">{invoice.totalAmount}</td>
    <td className="p-3.5">
      <StatusBadge status={invoice.status} />
    </td>
  </tr>
);
InvoiceTable.Row = Row;
export { InvoiceTable };
