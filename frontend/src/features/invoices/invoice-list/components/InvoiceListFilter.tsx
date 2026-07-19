import { DisplayStatus } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useInvoiceListParams } from "../hooks/useInvoiceListParams";

const STATUSES: DisplayStatus[] = ["Draft", "Pending", "Paid", "Overdue"];
export const InvoiceListFilter = () => {
  const { params, setKeyword, setStatus, setSort, setOrdering } =
    useInvoiceListParams();
  return (
    <>
      <Input
        placeholder="Search by invoice number or customer name…"
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 rounded-lg"
      />
      <Select
        defaultValue="all"
        onValueChange={(v) =>
          setStatus(v === "all" ? undefined : (v as DisplayStatus))
        }
      >
        <SelectTrigger className="w-auto min-w-[10rem] rounded-lg">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue="invoiceDate"
        onValueChange={(v) => setSort(v as "invoiceDate")}
      >
        <SelectTrigger className="w-auto min-w-[10rem] rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="invoiceDate">Sort: Invoice date</SelectItem>
          <SelectItem value="dueDate">Sort: Due date</SelectItem>
          <SelectItem value="totalAmount">Sort: Total amount</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        className="flex flex-row items-center gap-2 h-9"
        onClick={() => setOrdering(params.ordering === "DESC" ? "ASC" : "DESC")}
      >
        {params.ordering}{" "}
        {params.ordering === "DESC" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
    </>
  );
};
