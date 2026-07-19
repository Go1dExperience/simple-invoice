import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../Pagination";

it("renders a numbered button per page and highlights the current page", () => {
  render(<Pagination page={2} pageSize={10} total={35} onPage={vi.fn()} />);
  expect(screen.getByRole("button", { name: "2" })).toHaveClass("bg-accent");
  expect(screen.getByRole("button", { name: "1" })).not.toHaveClass("bg-accent");
  expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
});

it("navigates to the clicked page number", () => {
  const onPage = vi.fn();
  render(<Pagination page={1} pageSize={10} total={35} onPage={onPage} />);
  fireEvent.click(screen.getByRole("button", { name: "3" }));
  expect(onPage).toHaveBeenCalledWith(3);
});
