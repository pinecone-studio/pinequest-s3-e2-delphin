"use client";

import Image from "next/image";
import { BookOpenText, CalendarDays } from "lucide-react";
import { formatHeaderDate, getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";

export function ExamsPageHeader({
  now,
  utilities,
}: {
  now: Date | null;
  utilities?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-16 w-[67px] shrink-0">
          <Image
            src="/teacher-greeting-illustration.svg"
            alt="Exams illustration"
            fill
            sizes="67px"
            className="object-contain"
            priority
          />
        </div>
        <div className="min-w-0 space-y-3">
          <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66] dark:text-[#f9fafb]">
            Шалгалтууд
          </h1>
          <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99] dark:text-[#c2c9d0]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.8} />
              {now ? formatHeaderDate(now) : "Огноо ачаалж байна"}
            </span>
            <span>/</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpenText className="h-[15px] w-[15px]" strokeWidth={1.8} />
              Хичээлийн {now ? getAcademicWeekLabel(now) : "..."}
            </span>
          </div>
        </div>
      </div>

      {utilities}
    </div>
  );
}
