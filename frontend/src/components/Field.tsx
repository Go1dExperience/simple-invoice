import { InputHTMLAttributes, forwardRef, useId } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;

export const Field = forwardRef<HTMLInputElement, Props>(({ label, error, id, className, ...input }, ref) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="mb-4">
      <Label htmlFor={inputId} className="mb-1.5 block font-normal text-slate-500">
        {label}
      </Label>
      <Input ref={ref} id={inputId} className={`mt-1.5 rounded-lg ${className ?? ""}`} {...input} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
});
Field.displayName = "Field";
