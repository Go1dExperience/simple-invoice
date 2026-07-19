import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { calculateTotals } from "./logic/calculate-totals";
import { deriveStatus } from "./logic/derive-status";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { ListInvoicesQuery } from "./dto/list-invoices.dto";
import { InvoicesRepository } from "./invoices.repository";

const SYMBOLS: Record<string, string> = { AUD: "AU$", USD: "US$", GBP: "£" };

@Injectable()
export class InvoicesService {
  constructor(
    private repo: InvoicesRepository,
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateInvoiceDto, userId: string) {
    const { subTotal, taxAmount, totalAmount } = calculateTotals({
      quantity: dto.item.quantity,
      rate: dto.item.rate,
      taxPercent: dto.taxPercent,
      discount: dto.discount,
    });
    const currencySymbol = SYMBOLS[dto.currency] ?? dto.currency;
    try {
      const invoice = await this.repo.createWithCustomer({
        dto,
        userId,
        subTotal,
        taxAmount,
        totalAmount,
        currencySymbol,
      });
      return this.toDetail(invoice, new Date());
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("Invoice number already exists");
      }
      if ((e as { code?: string }).code === "P2002")
        throw new ConflictException("Invoice number already exists");
      throw e;
    }
  }

  async findAll(q: ListInvoicesQuery) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;
    const today = new Date(new Date().toISOString().slice(0, 10));
    const where: any = {};

    if (q.keyword) {
      where.OR = [
        { invoiceNumber: { contains: q.keyword, mode: "insensitive" } },
        {
          customer: { fullname: { contains: q.keyword, mode: "insensitive" } },
        },
      ];
    }
    if (q.fromDate || q.toDate) {
      where.invoiceDate = {};
      if (q.fromDate) where.invoiceDate.gte = new Date(q.fromDate);
      if (q.toDate) where.invoiceDate.lte = new Date(q.toDate);
    }
    const overdue = {
      status: { not: "Paid" as const },
      dueDate: { lt: today },
    };
    if (q.status === "Overdue") Object.assign(where, overdue);
    else if (q.status === "Paid") where.status = "Paid";
    else if (q.status === "Draft" || q.status === "Pending") {
      where.status = q.status;
      where.NOT = overdue;
    }

    const [rows, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { customer: true },
        orderBy: {
          [q.sortBy ?? "invoiceDate"]: (q.ordering ?? "DESC").toLowerCase(),
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    const data = rows.map((inv: any) => ({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customer.fullname,
      invoiceDate: new Date(inv.invoiceDate).toISOString().slice(0, 10),
      dueDate: new Date(inv.dueDate).toISOString().slice(0, 10),
      totalAmount: new Prisma.Decimal(inv.totalAmount).toFixed(2),
      status: deriveStatus(inv.status, inv.dueDate, today),
    }));
    return { data, paging: { page, pageSize, total } };
  }

  async findOne(id: string) {
    const inv = await this.prisma.invoice.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });
    if (!inv) throw new NotFoundException("Invoice not found");
    return this.toDetail(inv, new Date());
  }

  // shared mapper (used by findOne/findAll)
  toDetail(inv: any, today: Date) {
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
        fullname: inv.customer.fullname,
        email: inv.customer.email,
        mobileNumber: inv.customer.mobileNumber,
        address: inv.customer.address,
      },
      items: inv.items.map((i: any) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        rate: this.money(i.rate),
      })),
      invoiceSubTotal: this.money(inv.invoiceSubTotal),
      totalTax: this.money(inv.totalTax),
      totalDiscount: this.money(inv.totalDiscount),
      totalAmount: this.money(inv.totalAmount),
      totalPaid: this.money(inv.totalPaid),
      balanceAmount: this.money(inv.balanceAmount),
    };
  }
  private money(v: Prisma.Decimal | string) {
    return new Prisma.Decimal(v).toFixed(2);
  }
  private day(d: Date) {
    return new Date(d).toISOString().slice(0, 10);
  }
}
