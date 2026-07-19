import { ReactNode, SelectHTMLAttributes } from "react";
import { ArrowDown } from "../assets/svg";

type Props = { children: ReactNode } & Pick<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "className">;

const Select = ({ children, className, ...rest }: Props) => (
  <div className="relative">
    <select
      {...rest}
      className={`w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 outline-none focus:border-accent ${className ?? ""} hover:cursor-pointer`}
    >
      {children}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
      <ArrowDown />
    </span>
  </div>
);

const Option = ({ value, children }: { value: string; children: ReactNode }) => <option value={value}>{children}</option>;

Select.Option = Option;
export { Select };
