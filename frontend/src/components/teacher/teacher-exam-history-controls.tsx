"use client";

import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TeacherExamHistoryControls({
  classOptions,
  dateRange,
  filteredExamCount,
  nameQuery,
  onClassChange,
  onDateRangeChange,
  onNameQueryChange,
  selectedClass,
}: {
  classOptions: Array<{ label: string; value: string }>;
  dateRange: DateRange | undefined;
  filteredExamCount: number;
  nameQuery: string;
  onClassChange: (value: string) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onNameQueryChange: (value: string) => void;
  selectedClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="hidden grid-cols-[minmax(0,1.6fr)_220px_220px_160px] items-center gap-4 border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid">
        <span>Нэр</span>
        <span>Огноо</span>
        <span>Анги</span>
        <span />
      </div>

      <div className="mt-0 grid gap-3 pt-0 lg:mt-3 lg:grid-cols-[minmax(0,1.6fr)_220px_220px_160px] lg:items-center">
        <Input
          value={nameQuery}
          onChange={(event) => onNameQueryChange(event.target.value)}
          placeholder="Шалгалтын нэрээр хайх"
          className="h-10 rounded-xl border-slate-200 bg-white"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 justify-between rounded-xl border-slate-200 bg-white font-normal text-slate-700"
            >
              <span className="truncate">{formatDateRangeLabel(dateRange)}</span>
              <CalendarDays className="h-4 w-4 text-slate-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={dateRange}
              onSelect={onDateRangeChange}
            />
            <div className="flex justify-end border-t border-slate-200 p-3">
              <Button variant="ghost" size="sm" onClick={() => onDateRangeChange(undefined)}>
                Цэвэрлэх
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={selectedClass} onValueChange={onClassChange}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Анги сонгох" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх анги</SelectItem>
            {classOptions.map((classOption) => (
              <SelectItem key={classOption.value} value={classOption.value}>
                {classOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-slate-500">{filteredExamCount} шалгалт</div>
      </div>
    </div>
  );
}

function formatDateRangeLabel(dateRange?: DateRange) {
  if (!dateRange?.from && !dateRange?.to) {
    return "Огноогоор шүүх";
  }

  if (dateRange?.from && !dateRange?.to) {
    return `${formatDisplayDate(dateRange.from)}-с хойш`;
  }

  if (!dateRange?.from && dateRange?.to) {
    return `${formatDisplayDate(dateRange.to)} хүртэл`;
  }

  return `${formatDisplayDate(dateRange.from!)} - ${formatDisplayDate(dateRange.to!)}`;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
