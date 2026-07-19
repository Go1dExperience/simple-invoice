import { useLogin } from "@/features/login/hooks/useLogin";
import { useAuth } from "@/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginForm, LoginFormSchema } from "../schema/LoginFormSchema";

export const useLoginForm = () => {
  const login = useLogin();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginFormSchema) });
  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    refresh();
    navigate("/");
  });
  return {
    register,
    errors,
    onSubmit,
    login,
  };
};
