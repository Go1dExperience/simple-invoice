import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
);
const Header = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 flex items-center gap-2 text-[17px] font-bold text-ink before:h-4 before:w-1 before:rounded before:bg-accent before:content-['']">
    {children}
  </h2>
);
const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
Card.Header = Header;
Card.Body = Body;
export { Card };
