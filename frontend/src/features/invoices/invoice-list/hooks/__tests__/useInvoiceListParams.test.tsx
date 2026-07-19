import { renderHook, act } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useInvoiceListParams } from "../useInvoiceListParams";

let currentSearch = "";

const LocationProbe = () => {
  currentSearch = useLocation().search;
  return null;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <LocationProbe />
    {children}
  </MemoryRouter>
);

beforeEach(() => {
  currentSearch = "";
});

it("defaults to page 1, invoice date sort, descending order", () => {
  const { result } = renderHook(() => useInvoiceListParams(), { wrapper });
  expect(result.current.params).toEqual({
    page: 1,
    pageSize: 10,
    sortBy: "invoiceDate",
    ordering: "DESC",
    status: undefined,
    keyword: undefined,
  });
});

it("writes filter changes into the URL and resets to page 1", () => {
  const { result } = renderHook(() => useInvoiceListParams(), { wrapper });
  act(() => result.current.setPage(3));
  act(() => result.current.setKeyword("paul"));
  expect(result.current.params.keyword).toBe("paul");
  expect(result.current.params.page).toBe(1);
  expect(currentSearch).toContain("keyword=paul");
});

it("restores params from the current URL on mount", () => {
  const initialWrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter
      initialEntries={["/invoices?keyword=paul&status=Paid&page=2"]}
    >
      {children}
    </MemoryRouter>
  );
  const { result } = renderHook(() => useInvoiceListParams(), {
    wrapper: initialWrapper,
  });
  expect(result.current.params).toMatchObject({
    keyword: "paul",
    status: "Paid",
    page: 2,
  });
});

it("keeps filters and the list in sync since both read the same URL", () => {
  const { result } = renderHook(
    () => ({ filter: useInvoiceListParams(), list: useInvoiceListParams() }),
    { wrapper },
  );
  act(() => result.current.filter.setKeyword("paul"));
  expect(result.current.list.params.keyword).toBe("paul");
});
