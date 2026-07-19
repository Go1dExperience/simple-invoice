import { z } from "zod";

export const createInvoiceSchema = z
  .object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Enter a valid email"),
    mobileNumber: z.string().optional(),
    address: z.string().optional(),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    currency: z.enum(["AUD", "USD", "GBP"]),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
    rate: z.coerce.number().positive("Rate must be positive"),
    taxPercent: z.coerce.number().min(0),
    discount: z.coerce.number().min(0),
  })
  .refine((v) => new Date(v.dueDate) >= new Date(v.invoiceDate), {
    path: ["dueDate"],
    message: "Due date must be on or after invoice date",
  });

export type CreateInvoiceForm = z.infer<typeof createInvoiceSchema>;
