import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { calculateTotals } from './logic/calculate-totals';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

const SYMBOLS: Record<string, string> = { AUD: 'AU$', USD: 'US$', GBP: '£' };

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto, userId: string) {
    const { subTotal, taxAmount, totalAmount } = calculateTotals({
      quantity: dto.item.quantity, rate: dto.item.rate, taxPercent: dto.taxPercent, discount: dto.discount,
    });
    try {
      const invoice = await this.prisma.$transaction(async (tx) => {
        const customer = await tx.customer.create({ data: { ...dto.customer } });
        return tx.invoice.create({
          data: {
            invoiceNumber: dto.invoiceNumber,
            invoiceReference: dto.invoiceReference ?? null,
            invoiceDate: new Date(dto.invoiceDate),
            dueDate: new Date(dto.dueDate),
            currency: dto.currency,
            currencySymbol: SYMBOLS[dto.currency] ?? dto.currency,
            description: dto.description ?? null,
            status: 'Draft',
            invoiceSubTotal: subTotal,
            totalTax: taxAmount,
            totalDiscount: dto.discount.toFixed(2),
            totalAmount,
            totalPaid: '0.00',
            balanceAmount: totalAmount,
            createdBy: userId,
            customerId: customer.id,
            items: { create: { name: dto.item.name, quantity: dto.item.quantity, rate: new Prisma.Decimal(dto.item.rate) } },
          },
          include: { customer: true, items: true },
        });
      });
      return this.toDetail(invoice, new Date());
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Invoice number already exists');
      }
      if ((e as { code?: string }).code === 'P2002') throw new ConflictException('Invoice number already exists');
      throw e;
    }
  }

  // shared mapper (used by findOne/findAll in later tasks)
  toDetail(inv: any, today: Date) {
    // deriveStatus imported in Task A8 wiring; inline here to keep create testable
    const { deriveStatus } = require('./logic/derive-status');
    return {
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      invoiceReference: inv.invoiceReference,
      invoiceDate: this.day(inv.invoiceDate),
      dueDate: this.day(inv.dueDate),
      currency: inv.currency,
      currencySymbol: inv.currencySymbol,
      description: inv.description,
      status: deriveStatus(inv.status, inv.dueDate, today),
      customer: {
        fullname: inv.customer.fullname, email: inv.customer.email,
        mobileNumber: inv.customer.mobileNumber, address: inv.customer.address,
      },
      items: inv.items.map((i: any) => ({ id: i.id, name: i.name, quantity: i.quantity, rate: this.money(i.rate) })),
      invoiceSubTotal: this.money(inv.invoiceSubTotal),
      totalTax: this.money(inv.totalTax),
      totalDiscount: this.money(inv.totalDiscount),
      totalAmount: this.money(inv.totalAmount),
      totalPaid: this.money(inv.totalPaid),
      balanceAmount: this.money(inv.balanceAmount),
    };
  }
  private money(v: Prisma.Decimal | string) { return new Prisma.Decimal(v).toFixed(2); }
  private day(d: Date) { return new Date(d).toISOString().slice(0, 10); }
}
