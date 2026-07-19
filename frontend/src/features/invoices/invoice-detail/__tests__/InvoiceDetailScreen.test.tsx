import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvoiceDetailScreen } from "../InvoiceDetailScreen";
import { api } from "../../../../api/client";

const detail = {
  invoiceId: "1",
  invoiceNumber: "IV-1",
  invoiceReference: "#572",
  invoiceDate: "2026-06-03",
  dueDate: "2026-07-03",
  currency: "AUD",
  currencySymbol: "AU$",
  description: "x",
  status: "Overdue",
  customer: { fullname: "Paul", email: "p@x.io", mobileNumber: "9", address: "SG" },
  items: [{ id: "i1", name: "Honda RC150", quantity: 2, rate: "1000.00" }],
  invoiceSubTotal: "2000.00",
  totalTax: "200.00",
  totalDiscount: "20.00",
  totalAmount: "2180.00",
  totalPaid: "1451.34",
  balanceAmount: "728.66",
};

it("shows invoice, customer, item and totals", async () => {
  vi.spyOn(api, "get").mockResolvedValue({ data: detail });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={["/invoices/1"]}>
        <Routes>
          <Route path="/invoices/:id" element={<InvoiceDetailScreen />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  expect(await screen.findByText("Honda RC150")).toBeInTheDocument();
  expect(screen.getByText("Paul")).toBeInTheDocument();
  // amounts render as currency symbol + value across separate text nodes in one span
  expect(screen.getByText("AU$2180.00")).toBeInTheDocument();
  expect(screen.getByText("AU$728.66")).toBeInTheDocument();
});
