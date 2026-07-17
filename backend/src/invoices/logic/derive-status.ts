import { InvoiceStatus } from '@prisma/client';

export type DisplayStatus = InvoiceStatus | 'Overdue';

const toDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export const deriveStatus = (persisted: InvoiceStatus, dueDate: Date, today: Date): DisplayStatus => {
  if (persisted !== 'Paid' && toDay(dueDate) < toDay(today)) return 'Overdue';
  return persisted;
};
