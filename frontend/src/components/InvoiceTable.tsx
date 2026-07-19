import { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { InvoiceListItem } from "@/types/invoice";

const HEAD_CLASS =
  "h-auto p-3 text-xs font-normal uppercase tracking-wider text-slate-500";

const InvoiceTable = ({ children }: { children: ReactNode }) => (
  <Table className="border-collapse">
    <TableHeader>
      <TableRow className="border-b-2 border-slate-200 hover:bg-transparent">
        <TableHead className={HEAD_CLASS}>Invoice #</TableHead>
        <TableHead className={HEAD_CLASS}>Customer</TableHead>
        <TableHead className={HEAD_CLASS}>Invoice date</TableHead>
        <TableHead className={HEAD_CLASS}>Due date</TableHead>
        <TableHead className={`${HEAD_CLASS} text-right`}>Total</TableHead>
        <TableHead className={HEAD_CLASS}>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{children}</TableBody>
  </Table>
);
const Row = ({
  invoice,
  onOpen,
}: {
  invoice: InvoiceListItem;
  onOpen: (id: string) => void;
}) => (
  <TableRow
    onClick={() => onOpen(invoice.invoiceId)}
    className="cursor-pointer border-b border-slate-100 hover:bg-accent/10"
  >
    <TableCell className="p-3.5 tabular-nums">
      {invoice.invoiceNumber}
    </TableCell>
    <TableCell className="p-3.5">{invoice.customerName}</TableCell>
    <TableCell className="p-3.5 tabular-nums">{invoice.invoiceDate}</TableCell>
    <TableCell className="p-3.5 tabular-nums">{invoice.dueDate}</TableCell>
    <TableCell className="p-3.5 text-right font-bold tabular-nums">
      {invoice.totalAmount}
    </TableCell>
    <TableCell className="p-3.5">
      <StatusBadge status={invoice.status} />
    </TableCell>
  </TableRow>
);
InvoiceTable.Row = Row;
export { InvoiceTable };
