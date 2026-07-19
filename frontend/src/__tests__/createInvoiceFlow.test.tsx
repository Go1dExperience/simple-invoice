import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { differenceInCalendarMonths, parse } from "date-fns";
import App from "../App";
import { api, TOKEN_KEY } from "../api/client";
import { InvoiceListItem } from "../types/invoice";
import { CreateInvoiceBody } from "../features/invoices/create-invoice/types";

/**
 * Integration test for the key workflow: starting from the invoice list, create
 * an invoice and see it appear in that list. Only the network boundary is faked
 * — routing, React Query, the form, validation, and every presentational
 * component are real.
 *
 * The fake holds state, so the POST genuinely determines what the later GET
 * returns; the submitted values have to survive the whole round trip to be
 * asserted on. Note this does not pin the cache-invalidation behaviour in
 * useCreateInvoice: the list query remounts on navigation and would refetch
 * either way.
 */
const seeded: InvoiceListItem = {
  invoiceId: "seed-1",
  invoiceNumber: "IV-1000",
  customerName: "Existing Customer",
  invoiceDate: "2026-06-01",
  dueDate: "2026-07-01",
  totalAmount: "500.00",
  status: "Paid",
};

const fakeBackend = () => {
  const invoices: InvoiceListItem[] = [seeded];

  vi.spyOn(api, "get").mockImplementation(async (url: string) => {
    if (url === "/auth/me") {
      return { data: { id: "u1", email: "reviewer@simpleinvoice.io" } };
    }
    return {
      data: {
        data: invoices,
        paging: { page: 1, pageSize: 10, total: invoices.length },
      },
    };
  });

  vi.spyOn(api, "post").mockImplementation(
    async (_url: string, data?: unknown) => {
      const body = data as CreateInvoiceBody;
      const created: InvoiceListItem = {
        invoiceId: `new-${invoices.length}`,
        invoiceNumber: body.invoiceNumber,
        customerName: body.customer.fullname,
        invoiceDate: body.invoiceDate,
        dueDate: body.dueDate,
        totalAmount: "2180.00",
        status: "Draft",
      };
      invoices.push(created);
      return { data: { ...created, invoiceReference: null } };
    },
  );
};

const selectDate = (labelText: string, isoDate: string) => {
  fireEvent.click(screen.getByLabelText(labelText));
  const target = parse(isoDate, "yyyy-MM-dd", new Date());
  const diff = differenceInCalendarMonths(target, new Date());
  const navLabel = diff < 0 ? "Go to previous month" : "Go to next month";
  for (let i = 0; i < Math.abs(diff); i++) {
    fireEvent.click(screen.getByLabelText(navLabel));
  }
  fireEvent.click(
    screen.getByText(String(target.getDate()), {
      selector: "button[name='day']:not(.day-outside)",
    }),
  );
};

const fillText = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  localStorage.setItem(TOKEN_KEY, "test-token");
  fakeBackend();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

it("shows a newly created invoice in the invoice list", async () => {
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  // Start on the list, as a user would, and go to the create form from there.
  expect(await screen.findByText("IV-1000")).toBeInTheDocument();
  expect(screen.queryByText("IV-2001")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /new invoice/i }));

  fillText("Customer name *", "Paul");
  fillText("Customer email *", "paul@101digital.io");
  fillText("Invoice number *", "IV-2001");
  selectDate("Invoice date *", "2026-08-03");
  selectDate("Due date *", "2026-09-03");
  fillText("Item name *", "Honda RC150");
  fillText("Quantity *", "2");
  fillText("Rate *", "1000");

  fireEvent.click(screen.getByRole("button", { name: /create invoice/i }));

  // Submitting navigates to the list, which must now include the new invoice.
  const newRow = (await screen.findByText("IV-2001")).closest("tr")!;
  expect(within(newRow).getByText("Paul")).toBeInTheDocument();
  expect(within(newRow).getByText("Draft")).toBeInTheDocument();

  // The pre-existing invoice is still listed, so this is a real list render
  // rather than a single-row detail view.
  expect(screen.getByText("IV-1000")).toBeInTheDocument();
});
