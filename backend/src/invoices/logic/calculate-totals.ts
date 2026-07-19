import { Prisma } from "@prisma/client";

const D = Prisma.Decimal;

export interface TotalsInput {
  quantity: number;
  rate: string | number;
  taxPercent: number;
  discount: number;
}

export const calculateTotals = ({
  quantity,
  rate,
  taxPercent,
  discount,
}: TotalsInput) => {
  const subTotal = new D(rate).mul(quantity);
  const taxAmount = subTotal.mul(new D(taxPercent).div(100));
  const totalAmount = subTotal.add(taxAmount).sub(discount);
  return {
    subTotal: subTotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
};
