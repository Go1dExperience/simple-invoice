export const InvoicePriceRow = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  return (
    <div
      key={name}
      className="flex justify-between border-b border-slate-100 py-2 text-sm"
    >
      <span>{name}</span>
      <span className="tabular-nums">{children}</span>
    </div>
  );
};
