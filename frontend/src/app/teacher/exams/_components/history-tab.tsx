"use client";

import * as React from "react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { TeacherExamHistoryControls } from "@/components/teacher/teacher-exam-history-controls";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock-data";
import type { TeacherExam } from "@/lib/teacher-exams";
import { buildHistoryReviewLink, formatExamClassSummary, formatExamDateSummary, isDateWithinRange } from "../exams-page-utils";

export function HistoryTab({ exams }: { exams: TeacherExam[] }) {
  const [nameQuery, setNameQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedClass, setSelectedClass] = React.useState("all");

  const classOptions = React.useMemo(() => {
    const scheduledClassIds = new Set(exams.flatMap((exam) => exam.scheduledClasses.map((schedule) => schedule.classId)));
    return classes.filter((classEntry) => scheduledClassIds.has(classEntry.id));
  }, [exams]);

  const filteredExams = React.useMemo(() => {
    const normalizedQuery = nameQuery.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesName = normalizedQuery.length === 0 || exam.title.toLowerCase().includes(normalizedQuery);
      const matchesClass = selectedClass === "all" || exam.scheduledClasses.some((schedule) => schedule.classId === selectedClass);
      const matchesDate = exam.scheduledClasses.some((schedule) => isDateWithinRange(schedule.date, dateRange));
      return matchesName && matchesClass && matchesDate;
    });
  }, [dateRange, exams, nameQuery, selectedClass]);

  return (
    <TeacherSurfaceCard className="rounded-[32px] p-6">
      <div className="space-y-5">
        <TeacherExamHistoryControls classOptions={classOptions.map((classEntry) => classEntry.id)} dateRange={dateRange} filteredExamCount={filteredExams.length} nameQuery={nameQuery} onClassChange={setSelectedClass} onDateRangeChange={setDateRange} onNameQueryChange={setNameQuery} selectedClass={selectedClass} />

        {filteredExams.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
            Шүүлтүүрт тохирох шалгалтын түүх олдсонгүй.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExams.map((exam) => (
              <article key={exam.id} className="rounded-[26px] border border-[#e5edff] bg-[#fbfdff] p-5 shadow-[0_14px_30px_rgba(177,198,232,0.08)]">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_160px] lg:items-center">
                  <div>
                    <h3 className="truncate text-base font-semibold text-[#303959]">{exam.title}</h3>
                    <p className="mt-1 text-sm text-[#6f7898]">{exam.questions.length} асуулт • {exam.duration} минут</p>
                  </div>
                  <p className="text-sm text-[#6f7898]">{formatExamDateSummary(exam)}</p>
                  <p className="truncate text-sm text-[#6f7898]">{formatExamClassSummary(exam)}</p>
                  <div className="flex justify-start lg:justify-end">
                    <Button asChild size="sm">
                      <Link href={buildHistoryReviewLink(exam)}>Үр дүн, үнэлгээ</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </TeacherSurfaceCard>
  );
}
