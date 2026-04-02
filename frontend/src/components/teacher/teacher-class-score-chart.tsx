"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { useCurrentTime } from "@/hooks/use-current-time";
import { formatIsoDate, formatTimeLabel } from "@/lib/teacher-dashboard-utils";
import type { ExamResult, Student } from "@/lib/mock-data-types";
import type { TeacherExam } from "@/lib/teacher-exams";
import {
  teacherClassDifficultyRows,
  teacherClassTopicRows,
} from "@/lib/teacher-class-score-chart-data";
import { TeacherClassScoreChartSvg } from "@/components/teacher/teacher-class-score-chart-svg";
import { TeacherClassScoreSummaryCard } from "@/components/teacher/teacher-class-score-summary-card";

export function TeacherClassScoreChart(props: {
  exam: TeacherExam | null;
  results: ExamResult[];
  students: Student[];
}) {
  void props;
  const now = useCurrentTime();
  const currentDateLabel = now ? formatIsoDate(now).replaceAll("-", ".") : "----.--.--";
  const currentTimeLabel = now ? formatTimeLabel(now) : "--:--";

  return (
    <div className="w-full max-w-[900px]">
      <div className="mb-2 pl-[30px]">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#5d6378]">
          Шалгалтын чанар
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-medium text-[#a7afc5]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.7} />
            {currentDateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={1.7} />
            Өнөөдөр · {currentTimeLabel}
          </span>
        </div>
      </div>

      <div className="-mt-2">
        <TeacherClassScoreChartSvg />
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <TeacherClassScoreSummaryCard
          title="Асуултын чанар"
          rows={teacherClassDifficultyRows}
          variant="difficulty"
        />
        <TeacherClassScoreSummaryCard
          title="Сэдвийн гүйцэтгэл"
          rows={teacherClassTopicRows}
          variant="topic"
        />
      </div>
    </div>
  );
}
