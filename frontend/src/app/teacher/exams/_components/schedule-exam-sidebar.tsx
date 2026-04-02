"use client";

import { GripVertical, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { formatCalendarDate } from "../exams-page-utils";
import type { PendingSchedule } from "./schedule-exam-types";

export function ScheduleExamSidebar({
  groupedSchedules,
  onAssignClass,
  onRemoveSchedule,
  scheduledClassIds,
  selectedDate,
}: {
  groupedSchedules: PendingSchedule[];
  onAssignClass: (classId: string, date: string) => void;
  onRemoveSchedule: (classId: string) => void;
  scheduledClassIds: Set<string>;
  selectedDate: Date | undefined;
}) {
  return (
    <div className="space-y-4 p-6">
      <section className="rounded-[22px] border border-[#e5edff] bg-[#fbfdff] p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8a97b5]">Боломжтой ангиуд</h3>
          <p className="mt-1 text-sm text-[#6f7898]">Ангиа чирээд календарь дээрх өдөр дээр тавина.</p>
        </div>
        <div className="space-y-2">
          {classes.map((classEntry) => {
            const isScheduled = scheduledClassIds.has(classEntry.id);

            return (
              <button
                key={classEntry.id}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", classEntry.id);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onClick={() => {
                  if (!selectedDate) {
                    toast({ title: "Өдөр сонгоно уу", description: "Календарь дээр өдөр сонгоод дараа нь ангийг нэмнэ үү.", variant: "destructive" });
                    return;
                  }

                  onAssignClass(classEntry.id, formatCalendarDate(selectedDate));
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-[18px] border px-3 py-3 text-left transition",
                  isScheduled ? "border-[#bfd3ff] bg-[#eef4ff] text-[#274278]" : "border-[#e5edff] bg-white text-[#303959] hover:border-[#cadbff] hover:bg-[#f8fbff]",
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{classEntry.name}</span>
                  <span className="mt-1 block text-xs text-[#7280a4]">{classEntry.students.length} сурагч</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-medium">
                  <GripVertical className="h-4 w-4" />
                  {isScheduled ? "Шилжүүлэх" : "Чирэх"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#e5edff] bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8a97b5]">Товлосон ангиуд</h3>
            <p className="mt-1 text-sm text-[#6f7898]">Одоогийн байдлаар календарьт байршуулсан хуваарь.</p>
          </div>
          <Badge variant="outline" className="rounded-full border-[#d8e2ff] bg-[#f8fbff] text-[#52628d]">
            {groupedSchedules.length}
          </Badge>
        </div>

        {groupedSchedules.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-4 py-8 text-center text-sm text-[#7280a4]">
            Ангийг календарь дээр тавьж хуваарь үүсгэнэ үү.
          </div>
        ) : (
          <div className="space-y-2">
            {groupedSchedules.map((schedule) => {
              const classEntry = classes.find((item) => item.id === schedule.classId);

              return (
                <div key={`${schedule.classId}-${schedule.date}-${schedule.time}`} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e5edff] bg-[#fbfdff] px-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#303959]">{classEntry?.name ?? schedule.classId}</p>
                    <p className="mt-1 text-sm text-[#6f7898]">{schedule.date} • {schedule.time}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#7483a6]" onClick={() => onRemoveSchedule(schedule.classId)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
