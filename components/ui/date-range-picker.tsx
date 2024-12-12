"use client";

import * as React from "react";
import { addDays, format, isFuture } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      onDateChange(undefined);
      return;
    }

    const { from, to } = selectedRange;

    // Normalize the dates to local time by setting the time to noon
    const normalizedFrom = from
      ? new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12)
      : undefined;
    const normalizedTo = to
      ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 12)
      : undefined;

    if (normalizedFrom && isFuture(normalizedFrom)) {
      toast.error("Cannot select future dates");
      return;
    }

    if (normalizedTo && isFuture(normalizedTo)) {
      toast.error("Cannot select future dates");
      return;
    }

    onDateChange({ from: normalizedFrom, to: normalizedTo });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => onDateChange(undefined)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
