import { validate } from "class-validator";
import { IsOnOrAfter } from "../is-on-or-after.validator";

class Dto {
  invoiceDate!: string;
  @IsOnOrAfter("invoiceDate", {
    message: "dueDate must be on or after invoiceDate",
  })
  dueDate!: string;
}

const make = (invoiceDate: string, dueDate: string) =>
  Object.assign(new Dto(), { invoiceDate, dueDate });

describe("IsOnOrAfter", () => {
  it("passes when dueDate is after invoiceDate", async () => {
    expect(await validate(make("2026-06-03", "2026-07-03"))).toHaveLength(0);
  });
  it("passes when dueDate equals invoiceDate", async () => {
    expect(await validate(make("2026-06-03", "2026-06-03"))).toHaveLength(0);
  });
  it("fails when dueDate is before invoiceDate", async () => {
    const errors = await validate(make("2026-06-03", "2026-06-01"));
    expect(errors[0].constraints?.isOnOrAfter).toBe(
      "dueDate must be on or after invoiceDate",
    );
  });
});
