import { Controller } from "react-hook-form";
import { Card } from "../../../../components/Card";
import { DateField } from "../../../../components/DateField";
import { Field } from "../../../../components/Field";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useCreateInvoiceForm } from "../hooks/useCreateInvoiceForm";
import { useNavigate } from "react-router-dom";

export const CreateInvoiceForm = () => {
  const { register, control, errors, onSubmit, create } =
    useCreateInvoiceForm();
  const navigate = useNavigate();
  const onCancel = () => navigate("/");
  return (
    <Card>
      <form onSubmit={onSubmit} noValidate>
        <Card.Header>Customer</Card.Header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Customer name *"
            {...register("customerName")}
            error={errors.customerName?.message}
          />
          <Field
            label="Customer email *"
            {...register("customerEmail")}
            error={errors.customerEmail?.message}
          />
          <Field label="Mobile" {...register("mobileNumber")} />
          <Field label="Address" {...register("address")} />
        </div>
        <Card.Header>Invoice</Card.Header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Invoice number *"
            {...register("invoiceNumber")}
            error={errors.invoiceNumber?.message}
          />
          <div className="mb-4">
            <Label className="mb-1.5 block font-normal text-slate-500">
              Currency *
            </Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Controller
            control={control}
            name="invoiceDate"
            render={({ field }) => (
              <DateField
                label="Invoice date *"
                value={field.value}
                onChange={field.onChange}
                error={errors.invoiceDate?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DateField
                label="Due date *"
                value={field.value}
                onChange={field.onChange}
                error={errors.dueDate?.message}
              />
            )}
          />
        </div>
        <Card.Header>Line item</Card.Header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Item name *"
            {...register("itemName")}
            error={errors.itemName?.message}
          />
          <Field
            label="Quantity *"
            type="number"
            {...register("quantity")}
            error={errors.quantity?.message}
          />
          <Field
            label="Rate *"
            type="number"
            {...register("rate")}
            error={errors.rate?.message}
          />
          <div />
          <Field label="Tax (%)" type="number" {...register("taxPercent")} />
          <Field label="Discount" type="number" {...register("discount")} />
        </div>
        {create.isError && (
          <p className="mb-3 text-sm text-red-600">
            Could not create invoice. The invoice number may already exist.
          </p>
        )}
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            Create invoice
          </Button>
        </div>
      </form>
    </Card>
  );
};
