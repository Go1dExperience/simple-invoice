import { ReactNode } from "react";
import { Card as CardPrimitive, CardTitle } from "./ui/card";

const Card = ({ children }: { children: ReactNode }) => (
  <CardPrimitive className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">{children}</CardPrimitive>
);
const Header = ({ children }: { children: ReactNode }) => (
  <CardTitle className="mb-3 flex items-center gap-2 text-[17px] font-bold text-ink before:h-4 before:w-1 before:rounded before:bg-accent before:content-['']">
    {children}
  </CardTitle>
);
const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
Card.Header = Header;
Card.Body = Body;
export { Card };
