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

export type InvoiceWithCustomerAndItems = Prisma.InvoiceGetPayload<{
  include: { customer: true; items: true };
}>;

export type InvoiceWithCustomer = Prisma.InvoiceGetPayload<{
  include: { customer: true };
}>;

@Injectable()
export class InvoicesRepository {
  constructor(private prisma: PrismaService) {}

  createWithCustomer(input: CreateInvoiceInput) {
    const { dto, userId, subTotal, taxAmount, totalAmount, currencySymbol } =
      input;
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

  findById(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });
  }

  findManyByFilter(q: ListInvoicesQuery, today: Date) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;
    // Composed as an AND list so independent filters can never overwrite
    // each other (a date range plus status=Overdue both constrain dueDate).
    const filters: Prisma.InvoiceWhereInput[] = [];

    if (q.keyword) {
      filters.push({
        OR: [
          { invoiceNumber: { contains: q.keyword, mode: "insensitive" } },
          {
            customer: {
              fullname: { contains: q.keyword, mode: "insensitive" },
            },
          },
        ],
      });
    }
    if (q.fromDate || q.toDate) {
      filters.push({
        invoiceDate: {
          ...(q.fromDate ? { gte: new Date(q.fromDate) } : {}),
          ...(q.toDate ? { lte: new Date(q.toDate) } : {}),
        },
      });
    }

    const overdue: Prisma.InvoiceWhereInput = {
      status: { not: "Paid" },
      dueDate: { lt: today },
    };
    if (q.status === "Overdue") filters.push(overdue);
    else if (q.status === "Paid") filters.push({ status: "Paid" });
    else if (q.status === "Draft" || q.status === "Pending") {
      filters.push({ status: q.status, NOT: overdue });
    }

    const where: Prisma.InvoiceWhereInput =
      filters.length > 0 ? { AND: filters } : {};

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
