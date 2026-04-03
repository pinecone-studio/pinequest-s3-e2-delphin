"use client";

import type { StudentListItem } from "./exam-monitoring-page-dashboard-types";

export function StudentProgressBoard({
  examQuestionCount,
  students,
}: {
  examQuestionCount: number;
  students: StudentListItem[];
}) {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_34%,rgba(250,240,255,0.95),rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 sm:p-5">
      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {students.map((student) => {
          const progressMatch = student.tertiaryInfo?.match(/(\d+)\/(\d+)/);
          const completedQuestions = progressMatch
            ? Number.parseInt(progressMatch[1] ?? "0", 10)
            : 0;
          const percent =
            examQuestionCount > 0
              ? Math.round((completedQuestions / examQuestionCount) * 100)
              : 0;

          return (
            <div
              key={student.id}
              className="rounded-[22px] border border-[#edf2fa] bg-white/90 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#44506c]">
                    {student.fullName}
                  </p>
                  <p className="mt-1 text-xs text-[#7f8ba4]">
                    {student.secondaryInfo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#31415f]">
                    {percent}%
                  </p>
                  <p className="text-xs text-[#8d99b0]">
                    {student.trailingMeta}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eaf0f8]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#4f8cff_0%,#18c6b7_100%)] transition-all"
                  style={{
                    width: `${Math.max(
                      percent,
                      completedQuestions > 0 ? 6 : 0,
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#73809b]">
                <span>{student.tertiaryInfo}</span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[#8c98ad]">
                  {student.badges?.[0] ?? "Хяналт хэвийн"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
