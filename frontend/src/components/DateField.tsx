import { CalendarIcon } from "lucide-react";
import { format, isValid, parse } from "date-fns";
import { useId, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";

type Props = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
};

export const DateField = ({ label, value, onChange, error, id }: Props) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [open, setOpen] = useState(false);
  const parsed = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;
  return (
    <div className="mb-4">
      <Label
        htmlFor={inputId}
        className="mb-1.5 block font-normal text-slate-500"
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            type="button"
            variant="outline"
            className={cn(
              "mt-1.5 w-full justify-start rounded-lg font-normal text-ink hover:bg-white",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
            {selected ? format(selected, "d MMM yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};
