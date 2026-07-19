import { Field } from "@/components/Field";
import { useLoginForm } from "../hooks/useLoginForm";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const { register, errors, onSubmit, login } = useLoginForm();
  return (
    <form onSubmit={onSubmit} noValidate className="p-6">
      <Field
        label="Email address"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Field
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      {login.isError && (
        <p className="mb-3 text-sm text-red-600">Invalid email or password.</p>
      )}
      <Button type="submit" disabled={login.isPending}>
        Sign in
      </Button>
    </form>
  );
};
