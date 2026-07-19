export const TopBar = ({ name }: { name: string }) => (
  <div className="sticky top-0 flex items-center justify-between bg-darkBlue px-7 py-5">
    <div className="flex items-center gap-2.5 text-xl font-extrabold tracking-wide text-white">
      <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,190,46,.22)]" />
      SimpleInvoice
      <small className="text-sm font-medium text-gray-400">· 101 Digital</small>
    </div>
    <div className="flex items-center gap-2.5 text-sm text-gray-400">
      <span>adsfadsf</span>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-accent/45 font-bold text-white hover:cursor-pointer">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  </div>
);
