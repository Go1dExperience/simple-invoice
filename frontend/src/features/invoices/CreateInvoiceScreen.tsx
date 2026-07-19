import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateInvoice } from "../../api/useCreateInvoice";
import { createInvoiceSchema, CreateInvoiceForm } from "./createInvoiceSchema";
import { PageBand } from "../../components/PageBand";
import { Card } from "../../components/Card";
import { Field } from "../../components/Field";
import { Button } from "../../components/Button";

export const CreateInvoiceScreen = () => {
  const navigate = useNavigate();
  const create = useCreateInvoice();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvoiceForm>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { currency: "AUD", taxPercent: 10, discount: 0 },
  });

  const onSubmit = handleSubmit(async (v) => {
    await create.mutateAsync({
      customer: { fullname: v.customerName, email: v.customerEmail, mobileNumber: v.mobileNumber, address: v.address },
      invoiceNumber: v.invoiceNumber,
      invoiceDate: v.invoiceDate,
      dueDate: v.dueDate,
      currency: v.currency,
      item: { name: v.itemName, quantity: v.quantity, rate: v.rate },
      taxPercent: v.taxPercent,
      discount: v.discount,
    });
    navigate("/");
  });

  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand>
        <div>
          <PageBand.Eyebrow>New</PageBand.Eyebrow>
          <PageBand.Title>Create invoice</PageBand.Title>
          <PageBand.Sub>New invoices are saved as Draft. Totals are calculated by the server.</PageBand.Sub>
        </div>
      </PageBand>
      <Card>
        <form onSubmit={onSubmit} noValidate>
          <Card.Header>Customer</Card.Header>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name *" {...register("customerName")} error={errors.customerName?.message} />
            <Field label="Customer email *" {...register("customerEmail")} error={errors.customerEmail?.message} />
            <Field label="Mobile" {...register("mobileNumber")} />
            <Field label="Address" {...register("address")} />
          </div>
          <Card.Header>Invoice</Card.Header>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Invoice number *" {...register("invoiceNumber")} error={errors.invoiceNumber?.message} />
            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-slate-500">Currency *</label>
              <select {...register("currency")} className="w-full rounded-lg border border-slate-200 px-3 py-2.5">
                <option>AUD</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </div>
            <Field label="Invoice date *" type="date" {...register("invoiceDate")} error={errors.invoiceDate?.message} />
            <Field label="Due date *" type="date" {...register("dueDate")} error={errors.dueDate?.message} />
          </div>
          <Card.Header>Line item</Card.Header>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Item name *" {...register("itemName")} error={errors.itemName?.message} />
            <Field label="Quantity *" type="number" {...register("quantity")} error={errors.quantity?.message} />
            <Field label="Rate *" type="number" {...register("rate")} error={errors.rate?.message} />
            <div />
            <Field label="Tax (%)" type="number" {...register("taxPercent")} />
            <Field label="Discount" type="number" {...register("discount")} />
          </div>
          {create.isError && <p className="mb-3 text-sm text-red-600">Could not create invoice. The invoice number may already exist.</p>}
          <div className="mt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              Create invoice
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
