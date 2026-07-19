import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateInvoiceScreen } from "../CreateInvoiceScreen";
import { api } from "../../../../api/client";

const renderScreen = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <CreateInvoiceScreen />
      </MemoryRouter>
    </QueryClientProvider>,
  );

it("blocks submit when due date is before invoice date", async () => {
  renderScreen();
  fireEvent.change(screen.getByLabelText("Invoice date *"), { target: { value: "2026-07-10" } });
  fireEvent.change(screen.getByLabelText("Due date *"), { target: { value: "2026-07-01" } });
  fireEvent.click(screen.getByRole("button", { name: /create invoice/i }));
  expect(await screen.findByText(/on or after invoice date/i)).toBeInTheDocument();
});

it("submits a valid invoice payload", async () => {
  const post = vi.spyOn(api, "post").mockResolvedValue({ data: { invoiceId: "1" } });
  renderScreen();
  fireEvent.change(screen.getByLabelText("Customer name *"), { target: { value: "Paul" } });
  fireEvent.change(screen.getByLabelText("Customer email *"), { target: { value: "p@x.io" } });
  fireEvent.change(screen.getByLabelText("Invoice number *"), { target: { value: "IV-9" } });
  fireEvent.change(screen.getByLabelText("Invoice date *"), { target: { value: "2026-06-03" } });
  fireEvent.change(screen.getByLabelText("Due date *"), { target: { value: "2026-07-03" } });
  fireEvent.change(screen.getByLabelText("Item name *"), { target: { value: "Widget" } });
  fireEvent.change(screen.getByLabelText("Quantity *"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("Rate *"), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", { name: /create invoice/i }));
  await waitFor(() =>
    expect(post).toHaveBeenCalledWith(
      "/invoices",
      expect.objectContaining({
        invoiceNumber: "IV-9",
        item: { name: "Widget", quantity: 2, rate: 1000 },
      }),
    ),
  );
});
