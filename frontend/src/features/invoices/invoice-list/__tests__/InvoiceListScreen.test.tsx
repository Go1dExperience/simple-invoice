import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvoiceListScreen } from "../InvoiceListScreen";
import { api } from "../../../../api/client";

const page = {
  data: [
    {
      invoiceId: "1",
      invoiceNumber: "IV-1",
      customerName: "Paul",
      invoiceDate: "2026-06-03",
      dueDate: "2026-07-03",
      totalAmount: "2180.00",
      status: "Overdue",
    },
  ],
  paging: { page: 1, pageSize: 10, total: 1 },
};

const renderScreen = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <InvoiceListScreen />
      </MemoryRouter>
    </QueryClientProvider>,
  );

it("renders invoices returned by the API", async () => {
  vi.spyOn(api, "get").mockResolvedValue({ data: page });
  renderScreen();
  const invoiceCell = await screen.findByText("IV-1");
  // scoped to the row: "Overdue" also appears as a status-filter <option>
  const row = invoiceCell.closest("tr")!;
  expect(within(row).getByText("Overdue")).toBeInTheDocument();
});

it("sends the typed keyword to the API", async () => {
  const get = vi.spyOn(api, "get").mockResolvedValue({ data: page });
  renderScreen();
  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: "paul" },
  });
  await waitFor(() =>
    expect(get).toHaveBeenLastCalledWith("/invoices", {
      params: expect.objectContaining({ keyword: "paul" }),
    }),
  );
});

it("searches once for a burst of typing rather than once per keystroke", async () => {
  const get = vi.spyOn(api, "get").mockResolvedValue({ data: page });
  renderScreen();
  await waitFor(() => expect(get).toHaveBeenCalledTimes(1)); // initial load
  get.mockClear();

  const search = screen.getByPlaceholderText(/search/i);
  for (const value of ["p", "pa", "pau", "paul"]) {
    fireEvent.change(search, { target: { value } });
  }

  await waitFor(() =>
    expect(get).toHaveBeenCalledWith("/invoices", {
      params: expect.objectContaining({ keyword: "paul" }),
    }),
  );
  expect(get).toHaveBeenCalledTimes(1);
});
