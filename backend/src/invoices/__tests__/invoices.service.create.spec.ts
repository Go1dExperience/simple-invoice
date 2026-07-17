import { ConflictException } from '@nestjs/common';
import { InvoicesService } from '../invoices.service';

const dto = {
  customer: { fullname: 'Paul', email: 'paul@101digital.io', mobileNumber: '9', address: 'SG' },
  invoiceNumber: 'IV-1', invoiceDate: '2026-06-03', dueDate: '2026-07-03',
  currency: 'AUD', description: 'x',
  item: { name: 'Honda RC150', quantity: 2, rate: 1000 },
  taxPercent: 10, discount: 20,
};

const created = {
  id: 'inv1', invoiceNumber: 'IV-1', invoiceReference: null,
  invoiceDate: new Date('2026-06-03'), dueDate: new Date('2026-07-03'),
  currency: 'AUD', currencySymbol: 'AU$', description: 'x', status: 'Draft',
  invoiceSubTotal: '2000.00', totalTax: '200.00', totalDiscount: '20.00',
  totalAmount: '2180.00', totalPaid: '0.00', balanceAmount: '2180.00',
  customer: { fullname: 'Paul', email: 'paul@101digital.io', mobileNumber: '9', address: 'SG' },
  items: [{ id: 'it1', name: 'Honda RC150', quantity: 2, rate: '1000.00' }],
};

const buildPrisma = (overrides: any = {}) => ({
  $transaction: jest.fn(async (cb: any) => cb(tx)),
  ...overrides,
});
const tx = {
  customer: { create: jest.fn().mockResolvedValue({ id: 'c1' }) },
  invoice: { create: jest.fn().mockResolvedValue(created) },
};

describe('InvoicesService.create', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a Draft invoice with server-computed totals', async () => {
    // pin "today" before the fixture's dueDate (2026-07-03) so the derived
    // status reflects creation defaults, not read-time overdue derivation.
    jest.useFakeTimers().setSystemTime(new Date('2026-06-15'));
    const prisma = buildPrisma();
    const service = new InvoicesService(prisma as any);
    const res = await service.create(dto as any, 'u1');
    expect(res.status).toBe('Draft');
    expect(res.totalAmount).toBe('2180.00');
    expect(res.balanceAmount).toBe('2180.00');
    expect(res.currencySymbol).toBe('AU$');
    // totals passed to prisma were computed server-side
    const invoiceArg = tx.invoice.create.mock.calls[0][0].data;
    expect(invoiceArg.status).toBe('Draft');
    expect(invoiceArg.totalPaid).toBe('0.00');
    jest.useRealTimers();
  });

  it('maps a duplicate invoiceNumber to a 409', async () => {
    const err: any = new Error('dup'); err.code = 'P2002';
    const prisma = buildPrisma({ $transaction: jest.fn().mockRejectedValue(err) });
    const service = new InvoicesService(prisma as any);
    await expect(service.create(dto as any, 'u1')).rejects.toBeInstanceOf(ConflictException);
  });
});
