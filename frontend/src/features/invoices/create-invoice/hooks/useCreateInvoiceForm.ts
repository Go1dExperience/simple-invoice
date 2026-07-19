import { useForm } from "react-hook-form";
import { useCreateInvoice } from "../../../../api/useCreateInvoice";
import {
  CreateInvoiceForm,
  createInvoiceSchema,
} from "../components/createInvoiceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export const useCreateInvoiceForm = () => {
  const create = useCreateInvoice();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvoiceForm>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { currency: "AUD", taxPercent: 10, discount: 0 },
  });

  const onSubmit = handleSubmit(async (v) => {
    await create.mutateAsync({
      customer: {
        fullname: v.customerName,
        email: v.customerEmail,
        mobileNumber: v.mobileNumber,
        address: v.address,
      },
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
  return {
    register,
    control,
    errors,
    onSubmit,
    create,
  };
};
