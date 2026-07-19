import { render, screen, fireEvent } from "@testing-library/react";
import { InvoiceTable } from "../InvoiceTable";

const inv = {
  invoiceId: "1",
  invoiceNumber: "IV-1",
  customerName: "Paul",
  invoiceDate: "2026-06-03",
  dueDate: "2026-07-03",
  totalAmount: "2180.00",
  status: "Overdue" as const,
};

it("renders a row and fires onClick with the invoice id", () => {
  const onOpen = vi.fn();
  render(
    <InvoiceTable>
      <InvoiceTable.Row invoice={inv} onOpen={onOpen} />
    </InvoiceTable>,
  );
  fireEvent.click(screen.getByText("IV-1"));
  expect(onOpen).toHaveBeenCalledWith("1");
});
