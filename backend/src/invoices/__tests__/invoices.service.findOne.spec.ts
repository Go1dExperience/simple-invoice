import { NotFoundException } from '@nestjs/common';
import { InvoicesService } from '../invoices.service';

const row = {
  id: 'inv1', invoiceNumber: 'IV-1', invoiceReference: null,
  invoiceDate: new Date('2026-06-03'), dueDate: new Date('2026-07-03'),
  currency: 'AUD', currencySymbol: 'AU$', description: null, status: 'Pending',
  invoiceSubTotal: '2000', totalTax: '200', totalDiscount: '20',
  totalAmount: '2180', totalPaid: '1451.34', balanceAmount: '728.66',
  customer: { fullname: 'Paul', email: 'p@x.io', mobileNumber: null, address: null },
  items: [{ id: 'it1', name: 'Honda RC150', quantity: 2, rate: '1000' }],
};

describe('InvoicesService.findOne', () => {
  it('returns detail with derived Overdue status for a past-due unpaid invoice', async () => {
    const prisma = { invoice: { findUnique: jest.fn().mockResolvedValue(row) } } as any;
    const service = new InvoicesService({} as any, prisma);
    jest.useFakeTimers().setSystemTime(new Date('2026-08-01'));
    const res = await service.findOne('inv1');
    expect(res.status).toBe('Overdue');
    expect(res.totalAmount).toBe('2180.00');
    jest.useRealTimers();
  });
  it('throws 404 when the invoice does not exist', async () => {
    const prisma = { invoice: { findUnique: jest.fn().mockResolvedValue(null) } } as any;
    await expect(new InvoicesService({} as any, prisma).findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
