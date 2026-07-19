import { Customer } from "./api";

export type DisplayStatus = "Draft" | "Pending" | "Paid" | "Overdue";

export interface InvoiceDetail extends Omit<InvoiceListItem, "customerName"> {
  invoiceReference?: string;
  currency: string;
  currencySymbol: string;
  description?: string;
  customer: Customer;
  items: { id: string; name: string; quantity: number; rate: string }[];
  invoiceSubTotal: string;
  totalTax: string;
  totalDiscount: string;
  totalPaid: string;
  balanceAmount: string;
}
export interface InvoiceListItem {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: DisplayStatus;
}
