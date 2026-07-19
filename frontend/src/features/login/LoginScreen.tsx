import { LoginForm } from "./components/LoginForm";

export const LoginScreen = () => {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <div className="bg-darkBlue px-7 pb-6 pt-8 text-center">
          <div className="text-xl font-extrabold text-white">SimpleInvoice</div>
          <p className="mt-2 text-sm text-white/60">
            Sign in to manage your invoices
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
