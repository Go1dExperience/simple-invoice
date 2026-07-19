import { Customer } from "@/types/api";

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
