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
}
