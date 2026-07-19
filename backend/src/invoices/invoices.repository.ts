import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { ListInvoicesQuery } from "./dto/list-invoices.dto";

export interface CreateInvoiceInput {
  dto: CreateInvoiceDto;
  userId: string;
  subTotal: string;
  taxAmount: string;
  totalAmount: string;
  currencySymbol: string;
}

@Injectable()
export class InvoicesRepository {
  constructor(private prisma: PrismaService) {}

  createWithCustomer(input: CreateInvoiceInput) {
    const { dto, userId, subTotal, taxAmount, totalAmount, currencySymbol } = input;
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({ data: { ...dto.customer } });
      return tx.invoice.create({
        data: {
          invoiceNumber: dto.invoiceNumber,
          invoiceReference: dto.invoiceReference ?? null,
          invoiceDate: new Date(dto.invoiceDate),
          dueDate: new Date(dto.dueDate),
          currency: dto.currency,
          currencySymbol,
          description: dto.description ?? null,
          status: "Draft",
          invoiceSubTotal: subTotal,
          totalTax: taxAmount,
          totalDiscount: dto.discount.toFixed(2),
          totalAmount,
          totalPaid: "0.00",
          balanceAmount: totalAmount,
          createdBy: userId,
          customerId: customer.id,
          items: {
            create: {
              name: dto.item.name,
              quantity: dto.item.quantity,
              rate: new Prisma.Decimal(dto.item.rate),
            },
          },
        },
        include: { customer: true, items: true },
      });
    });
  }

  findManyByFilter(q: ListInvoicesQuery, today: Date) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;
    const where: any = {};

    if (q.keyword) {
      where.OR = [
        { invoiceNumber: { contains: q.keyword, mode: "insensitive" } },
        { customer: { fullname: { contains: q.keyword, mode: "insensitive" } } },
      ];
    }
    if (q.fromDate || q.toDate) {
      where.invoiceDate = {};
      if (q.fromDate) where.invoiceDate.gte = new Date(q.fromDate);
      if (q.toDate) where.invoiceDate.lte = new Date(q.toDate);
    }
    const overdue = { status: { not: "Paid" as const }, dueDate: { lt: today } };
    if (q.status === "Overdue") Object.assign(where, overdue);
    else if (q.status === "Paid") where.status = "Paid";
    else if (q.status === "Draft" || q.status === "Pending") {
      where.status = q.status;
      where.NOT = overdue;
    }

    return Promise.all([
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
  }
}
