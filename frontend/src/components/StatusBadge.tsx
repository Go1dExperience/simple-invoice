import { DisplayStatus } from "@/types/invoice";
import { Badge } from "./ui/badge";

const MAP: Record<DisplayStatus, string> = {
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-300",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-red-50 text-red-700 border-red-200",
};

export const StatusBadge = ({ status }: { status: DisplayStatus }) => (
  <Badge
    variant="outline"
    className={`rounded-full px-3 py-1 text-xs font-bold ${MAP[status]}`}
  >
    {status}
  </Badge>
);
