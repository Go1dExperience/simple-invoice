import { ReactNode } from "react";

const grad = "bg-[linear-gradient(180deg,rgba(6,18,41,.56),rgba(6,18,41,0)),#0a1c3d]";
const PageBand = ({ children }: { children: ReactNode }) => (
  <div className={`mb-5 flex flex-wrap items-start justify-between gap-4 rounded-2xl ${grad} px-6 py-6 shadow-lg`}>
    {children}
  </div>
);
PageBand.Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-accent">{children}</p>
);
PageBand.Title = ({ children }: { children: ReactNode }) => <h1 className="m-0 text-2xl font-bold text-white">{children}</h1>;
PageBand.Sub = ({ children }: { children: ReactNode }) => <p className="mt-1.5 text-sm text-white/60">{children}</p>;
PageBand.Actions = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-3">{children}</div>;
export { PageBand };
