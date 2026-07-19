import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

it("renders the status label", () => {
  render(<StatusBadge status="Overdue" />);
  expect(screen.getByText("Overdue")).toBeInTheDocument();
});
