import { PrismaClient, InvoiceStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SYMBOLS: Record<string, string> = { AUD: 'AU$', USD: 'US$', GBP: '£' };
const NAMES = ['Emily Chan', 'Michael Nguyen', 'Sofia Rossi', 'David Smith', 'Aisha Khan', 'Liam Brown', 'Mia Wong'];
const CURR = ['AUD', 'USD', 'GBP'];
const STATUSES: InvoiceStatus[] = ['Draft', 'Pending', 'Paid'];

const money = (n: number) => n.toFixed(2);
const daysFromNow = (d: number) => { const t = new Date(); t.setDate(t.getDate() + d); return new Date(t.toISOString().slice(0, 10)); };

async function main() {
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: process.env.SEED_USER_EMAIL ?? 'reviewer@simpleinvoice.io',
      passwordHash: await bcrypt.hash(process.env.SEED_USER_PASSWORD ?? 'Password123', 10),
      fullname: 'Reviewer',
    },
  });

  // Appendix A record — persisted Pending, past due → derives Overdue
  const paul = await prisma.customer.create({ data: { fullname: 'Paul', email: 'paul@101digital.io', mobileNumber: '947717364111', address: 'Singapore' } });
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'IV1780488206995', invoiceReference: '#5721662',
      invoiceDate: new Date('2026-06-03'), dueDate: new Date('2026-07-03'),
      currency: 'AUD', currencySymbol: 'AU$', description: 'Invoice is issued to Kanglee', status: 'Pending',
      invoiceSubTotal: '2000.00', totalTax: '200.00', totalDiscount: '20.00',
      totalAmount: '2180.00', totalPaid: '1451.34', balanceAmount: '728.66',
      createdBy: user.id, customerId: paul.id,
      items: { create: { name: 'Honda RC150', quantity: 2, rate: '1000.00' } },
    },
  });

  for (let i = 1; i <= 32; i++) {
    const qty = 1 + (i % 5);
    const rate = 50 + i * 37;
    const sub = qty * rate;
    const tax = sub * 0.1;
    const discount = i % 4 === 0 ? 15 : 0;
    const total = sub + tax - discount;
    const status = STATUSES[i % STATUSES.length];
    const paid = status === 'Paid' ? total : status === 'Pending' ? total / 2 : 0;
    const currency = CURR[i % CURR.length];
    const c = await prisma.customer.create({ data: { fullname: NAMES[i % NAMES.length], email: `c${i}@example.com` } });
    await prisma.invoice.create({
      data: {
        invoiceNumber: `IV-${1000 + i}`,
        invoiceDate: daysFromNow(-40 + i), dueDate: daysFromNow(-40 + i + 30),
        currency, currencySymbol: SYMBOLS[currency], status,
        invoiceSubTotal: money(sub), totalTax: money(tax), totalDiscount: money(discount),
        totalAmount: money(total), totalPaid: money(paid), balanceAmount: money(total - paid),
        createdBy: user.id, customerId: c.id,
        items: { create: { name: `Item ${i}`, quantity: qty, rate: money(rate) } },
      },
    });
  }
  console.log('Seed complete: reviewer user + 33 invoices');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
