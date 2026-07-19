import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/useLogin";
import { useAuth } from "../../auth/AuthContext";
import { Field } from "../../components/Field";
import { Button } from "../../components/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type Form = z.infer<typeof schema>;

export const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });
  const login = useLogin();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    refresh();
    navigate("/");
  });

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f7f9] p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(180deg,rgba(6,18,41,.56),rgba(6,18,41,0)),#0a1c3d] px-7 pb-6 pt-8 text-center">
          <div className="text-xl font-extrabold text-white">SimpleInvoice</div>
          <p className="mt-2 text-sm text-white/60">Sign in to manage your invoices</p>
        </div>
        <form onSubmit={onSubmit} noValidate className="p-6">
          <Field label="Email address" type="email" {...register("email")} error={errors.email?.message} />
          <Field label="Password" type="password" {...register("password")} error={errors.password?.message} />
          {login.isError && <p className="mb-3 text-sm text-red-600">Invalid email or password.</p>}
          <Button type="submit" disabled={login.isPending}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};
