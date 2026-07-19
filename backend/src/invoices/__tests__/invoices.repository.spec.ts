import { InvoicesRepository } from "../invoices.repository";

const makePrisma = () => ({
  invoice: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
  },
});

// Filters are composed as `{ AND: [...] }`; flatten so assertions describe the
// constraint that was applied rather than where it sits in the tree.
const conditions = (prisma: ReturnType<typeof makePrisma>) =>
  prisma.invoice.findMany.mock.calls[0][0].where.AND ?? [];

describe("InvoicesRepository.findManyByFilter", () => {
  it("paginates with defaults (page 1, size 10, invoiceDate DESC)", async () => {
    const prisma = makePrisma();
    const repo = new InvoicesRepository(prisma as any);
    await repo.findManyByFilter({} as any, new Date("2026-07-17"));
    const args = prisma.invoice.findMany.mock.calls[0][0];
    expect(args.skip).toBe(0);
    expect(args.take).toBe(10);
    expect(args.orderBy).toEqual({ invoiceDate: "desc" });
  });

  it("applies a case-insensitive keyword over invoiceNumber and customer name", async () => {
    const prisma = makePrisma();
    const repo = new InvoicesRepository(prisma as any);
    await repo.findManyByFilter(
      { keyword: "pau" } as any,
      new Date("2026-07-17"),
    );
    expect(conditions(prisma)).toContainEqual({
      OR: [
        { invoiceNumber: { contains: "pau", mode: "insensitive" } },
        { customer: { fullname: { contains: "pau", mode: "insensitive" } } },
      ],
    });
  });

  it("translates status=Overdue into unpaid + past-due", async () => {
    const prisma = makePrisma();
    const repo = new InvoicesRepository(prisma as any);
    await repo.findManyByFilter(
      { status: "Overdue" } as any,
      new Date("2026-07-17"),
    );
    expect(conditions(prisma)).toContainEqual({
      status: { not: "Paid" },
      dueDate: { lt: new Date("2026-07-17") },
    });
  });

  it("translates status=Pending into persisted Pending AND not past-due", async () => {
    const prisma = makePrisma();
    const repo = new InvoicesRepository(prisma as any);
    await repo.findManyByFilter(
      { status: "Pending" } as any,
      new Date("2026-07-17"),
    );
    expect(conditions(prisma)).toContainEqual({
      status: "Pending",
      NOT: {
        status: { not: "Paid" },
        dueDate: { lt: new Date("2026-07-17") },
      },
    });
  });

  it("keeps the date range when filtering by Overdue at the same time", async () => {
    const prisma = makePrisma();
    const repo = new InvoicesRepository(prisma as any);
    await repo.findManyByFilter(
      {
        status: "Overdue",
        fromDate: "2026-01-01",
        toDate: "2026-06-30",
      } as any,
      new Date("2026-07-17"),
    );
    expect(conditions(prisma)).toContainEqual({
      invoiceDate: {
        gte: new Date("2026-01-01"),
        lte: new Date("2026-06-30"),
      },
    });
    expect(conditions(prisma)).toContainEqual({
      status: { not: "Paid" },
      dueDate: { lt: new Date("2026-07-17") },
    });
  });
});
