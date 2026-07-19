import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "../Select";

it("renders each option and fires onChange with the selected value", () => {
  const onChange = vi.fn();
  render(
    <Select onChange={onChange}>
      <Select.Option value="">All statuses</Select.Option>
      <Select.Option value="Paid">Paid</Select.Option>
    </Select>,
  );
  expect(screen.getByRole("option", { name: "Paid" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Paid" } });
  expect(onChange).toHaveBeenCalled();
});
