import { ReactNode } from "react";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
};

export const PageBand = ({ eyebrow, title, action }: Props) => (
  <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-darkBlue px-6 py-6 shadow-lg">
    <div>
      {eyebrow && (
        <p className="mb-1.5 text-sm font-bold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      )}
      <h1 className="m-0 text-2xl font-bold text-white">{title}</h1>
    </div>
    {action && <div className="flex items-center gap-3">{action}</div>}
  </div>
);
