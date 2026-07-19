import { ButtonHTMLAttributes } from "react";

type Props = { variant?: "primary" | "ghost" } & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type" | "disabled" | "children"
>;

export const Button = ({ variant = "primary", children, ...rest }: Props) => (
  <button
    {...rest}
    className={
      variant === "primary"
        ? "rounded-lg border border-accent bg-accent px-5 py-2.5 font-bold text-ink shadow hover:bg-accentDeep"
        : "rounded-lg border border-slate-200 bg-white px-5 py-2.5 font-bold text-ink hover:border-accent"
    }
  >
    {children}
  </button>
);
