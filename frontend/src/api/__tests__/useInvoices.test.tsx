import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInvoices } from "../../features/invoices/invoice-list/hooks/useInvoices";
import { api } from "../client";

vi.spyOn(api, "get").mockResolvedValue({
  data: {
    data: [{ invoiceNumber: "IV-1" }],
    paging: { page: 1, pageSize: 10, total: 1 },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

it("fetches invoices with query params", async () => {
  const { result } = renderHook(() => useInvoices({ keyword: "iv", page: 1 }), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(api.get).toHaveBeenCalledWith("/invoices", {
    params: { keyword: "iv", page: 1 },
  });
  expect(result.current.data?.data[0].invoiceNumber).toBe("IV-1");
});
