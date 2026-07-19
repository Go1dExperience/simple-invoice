export const TopBar = ({ name }: { name: string }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between bg-[linear-gradient(180deg,rgba(6,18,41,.56),rgba(6,18,41,0)),#0a1c3d] px-7 py-5 shadow-[0_10px_30px_rgba(6,18,41,.22)]">
    <div className="flex items-center gap-2.5 text-xl font-extrabold tracking-wide text-white">
      <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,190,46,.22)]" />
      SimpleInvoice
      <small className="text-sm font-medium text-white/55">· 101 Digital</small>
    </div>
    <div className="flex items-center gap-2.5 text-sm text-white/70">
      <span>{name}</span>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-accent/45 bg-accent/15 font-bold text-accent">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  </div>
);
