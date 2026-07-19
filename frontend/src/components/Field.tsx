import { InputHTMLAttributes, forwardRef, useId } from "react";

type Props = { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;

export const Field = forwardRef<HTMLInputElement, Props>(({ label, error, id, ...input }, ref) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="mb-1.5 block text-sm text-slate-500">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        {...input}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
Field.displayName = "Field";
