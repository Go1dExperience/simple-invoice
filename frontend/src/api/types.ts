export type DisplayStatus = "Draft" | "Pending" | "Paid" | "Overdue";

export interface InvoiceListItem {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: DisplayStatus;
}

export interface Paged<T> {
  data: T[];
  paging: { page: number; pageSize: number; total: number };
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "invoiceDate" | "dueDate" | "totalAmount";
  ordering?: "ASC" | "DESC";
  status?: DisplayStatus;
  keyword?: string;
}

export interface Customer {
  fullname: string;
  email: string;
  mobileNumber?: string;
  address?: string;
}

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

export interface CreateInvoiceBody {
  customer: Customer;
  invoiceNumber: string;
  invoiceReference?: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  description?: string;
  item: { name: string; quantity: number; rate: number };
  taxPercent: number;
  discount: number;
}
