import { ConflictException } from "@nestjs/common";
import { InvoicesService } from "../invoices.service";

const dto = {
  customer: {
    fullname: "Paul",
    email: "paul@101digital.io",
    mobileNumber: "9",
    address: "SG",
  },
  invoiceNumber: "IV-1",
  invoiceDate: "2026-06-03",
  dueDate: "2026-07-03",
  currency: "AUD",
  description: "x",
  item: { name: "Honda RC150", quantity: 2, rate: 1000 },
  taxPercent: 10,
  discount: 20,
};

const created = {
  id: "inv1",
  invoiceNumber: "IV-1",
  invoiceReference: null,
  invoiceDate: new Date("2026-06-03"),
  dueDate: new Date("2026-07-03"),
  currency: "AUD",
  currencySymbol: "AU$",
  description: "x",
  status: "Draft",
  invoiceSubTotal: "2000.00",
  totalTax: "200.00",
  totalDiscount: "20.00",
  totalAmount: "2180.00",
  totalPaid: "0.00",
  balanceAmount: "2180.00",
  customer: {
    fullname: "Paul",
    email: "paul@101digital.io",
    mobileNumber: "9",
    address: "SG",
  },
  items: [{ id: "it1", name: "Honda RC150", quantity: 2, rate: "1000.00" }],
};

const buildRepo = (overrides: any = {}) => ({
  createWithCustomer: jest.fn().mockResolvedValue(created),
  ...overrides,
});

describe("InvoicesService.create", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates a Draft invoice with server-computed totals", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-15"));
    const repo = buildRepo();
    const service = new InvoicesService(repo as any);
    const res = await service.create(dto as any, "u1");
    expect(res.status).toBe("Draft");
    expect(res.totalAmount).toBe("2180.00");
    expect(res.balanceAmount).toBe("2180.00");
    expect(res.currencySymbol).toBe("AU$");
    // totals + currency symbol were computed server-side and handed to the repository
    const input = repo.createWithCustomer.mock.calls[0][0];
    expect(input.subTotal).toBe("2000.00");
    expect(input.totalAmount).toBe("2180.00");
    expect(input.currencySymbol).toBe("AU$");
    jest.useRealTimers();
  });

  it("maps a duplicate invoiceNumber to a 409", async () => {
    const err: any = new Error("dup");
    err.code = "P2002";
    const repo = buildRepo({
      createWithCustomer: jest.fn().mockRejectedValue(err),
    });
    const service = new InvoicesService(repo as any);
    await expect(service.create(dto as any, "u1")).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
