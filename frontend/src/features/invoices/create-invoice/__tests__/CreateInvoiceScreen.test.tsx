import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { differenceInCalendarMonths, parse } from "date-fns";
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

const selectDate = (labelText: string, isoDate: string) => {
  fireEvent.click(screen.getByLabelText(labelText));
  const target = parse(isoDate, "yyyy-MM-dd", new Date());
  const diff = differenceInCalendarMonths(target, new Date());
  const navLabel = diff < 0 ? "Go to previous month" : "Go to next month";
  for (let i = 0; i < Math.abs(diff); i++) {
    fireEvent.click(screen.getByLabelText(navLabel));
  }
  const dayButton = screen.getByText(String(target.getDate()), {
    selector: "button[name='day']:not(.day-outside)",
  });
  fireEvent.click(dayButton);
};

it("blocks submit when due date is before invoice date", async () => {
  renderScreen();
  selectDate("Invoice date *", "2026-07-10");
  selectDate("Due date *", "2026-07-01");
  fireEvent.click(screen.getByRole("button", { name: /create invoice/i }));
  expect(
    await screen.findByText(/on or after invoice date/i),
  ).toBeInTheDocument();
});

it("submits a valid invoice payload", async () => {
  const post = vi
    .spyOn(api, "post")
    .mockResolvedValue({ data: { invoiceId: "1" } });
  renderScreen();
  fireEvent.change(screen.getByLabelText("Customer name *"), {
    target: { value: "Paul" },
  });
  fireEvent.change(screen.getByLabelText("Customer email *"), {
    target: { value: "p@x.io" },
  });
  fireEvent.change(screen.getByLabelText("Invoice number *"), {
    target: { value: "IV-9" },
  });
  selectDate("Invoice date *", "2026-06-03");
  selectDate("Due date *", "2026-07-03");
  fireEvent.change(screen.getByLabelText("Item name *"), {
    target: { value: "Widget" },
  });
  fireEvent.change(screen.getByLabelText("Quantity *"), {
    target: { value: "2" },
  });
  fireEvent.change(screen.getByLabelText("Rate *"), {
    target: { value: "1000" },
  });
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
