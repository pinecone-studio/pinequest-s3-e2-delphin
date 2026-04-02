"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Clock3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PendingSchedule } from "./schedule-exam-types";

export function ScheduleExamCalendarPanel({
  groupedSchedules,
  onAssignClass,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
}: {
  groupedSchedules: PendingSchedule[];
  onAssignClass: (classId: string, date: string) => void;
  selectedDate: Date | undefined;
  selectedTime: string;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (value: string) => void;
}) {
  return (
    <div className="border-b border-[#e8eefb] p-6 lg:border-b-0 lg:border-r">
      <div className="mb-4 flex flex-col gap-3 rounded-[22px] border border-[#e5edff] bg-[#f9fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#303959]">Календарь дээр анги тавих</p>
          <p className="mt-1 text-sm text-[#6f7898]">Өдрөө сонгоод эсвэл ангиа шууд тухайн өдөр дээр чирч тавина.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#52628d]">
          <Clock3 className="h-4 w-4" />
          <span>Цаг</span>
          <Input type="time" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} className="h-10 w-[120px] bg-white" />
        </label>
      </div>

      <div
        className="rounded-[24px] border border-[#e5edff] bg-white p-3 shadow-[0_14px_30px_rgba(177,198,232,0.08)]"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const classId = event.dataTransfer.getData("text/plain");
          const dayElement = (event.target as HTMLElement).closest("[data-iso-date]");
          const isoDate = dayElement?.getAttribute("data-iso-date");
          if (!classId || !isoDate) return;
          onAssignClass(classId, isoDate);
          setSelectedDate(new Date(`${isoDate}T00:00:00`));
        }}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full"
          classNames={{ months: "flex w-full flex-col", month: "w-full", table: "w-full border-separate border-spacing-2", head_row: "grid grid-cols-7", row: "grid grid-cols-7", cell: "min-h-[96px]", day: "h-full" }}
          components={{
            DayButton: ({ day, ...props }) => (
              <CalendarDayButton
                {...props}
                day={day}
                data-iso-date={day.date.toISOString().slice(0, 10)}
                className="min-h-[96px] items-start justify-start rounded-[18px] border border-transparent bg-[#fbfdff] px-2 py-2 text-left text-sm hover:bg-[#f3f7ff] data-[selected-single=true]:border-[#bfd3ff] data-[selected-single=true]:bg-[#eef4ff] data-[selected-single=true]:text-[#1d3363]"
              />
            ),
          }}
          modifiers={{ scheduled: groupedSchedules.map((schedule) => new Date(`${schedule.date}T00:00:00`)) }}
          modifiersClassNames={{ scheduled: "ring-1 ring-[#d6e5ff]" }}
        />
      </div>
    </div>
  );
}
