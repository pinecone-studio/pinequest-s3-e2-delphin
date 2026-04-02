"use client";

import { Badge } from "@/components/ui/badge";
import { TeacherExamScheduleList } from "@/components/teacher/teacher-exam-schedule-list";
import type { TeacherExam } from "@/lib/teacher-exams";
import { cn } from "@/lib/utils";

type ReviewMode = "completed" | "live";

export function TeacherExamsSection({
  actionLabelOverride,
  emptyLabel,
  exams,
  hideWhenEmpty = false,
  reviewMode,
  sectionClassName,
  statusLabelResolver,
  statusLabelOverride,
  title,
}: {
  actionLabelOverride?: string;
  emptyLabel: string;
  exams: TeacherExam[];
  hideWhenEmpty?: boolean;
  reviewMode?: ReviewMode;
  sectionClassName?: string;
  statusLabelResolver?: (exam: TeacherExam) => string;
  statusLabelOverride?: string;
  title: string;
}) {
  if (hideWhenEmpty && exams.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-4", sectionClassName)}>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {exams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => {
            const statusLabel =
              statusLabelResolver?.(exam) ??
              statusLabelOverride ??
              formatStatus(exam.status);

            return (
              <article
                key={exam.id}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate text-base font-semibold text-slate-950">
                        {exam.title}
                      </h3>
                      <Badge
                        variant={getBadgeVariant(exam.status, statusLabel)}
                        className="w-fit"
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {exam.questions.length} асуулт, {exam.duration} мин
                    </p>
                  </div>
                  <div className="xl:min-w-[320px]">
                    <TeacherExamScheduleList
                      actionLabelOverride={actionLabelOverride}
                      exam={exam}
                      reviewMode={reviewMode}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatStatus(status: TeacherExam["status"]) {
  if (status === "completed") return "Дууссан";
  if (status === "draft") return "Ноорог";
  return "Товлогдсон";
}

function getBadgeVariant(
  status: TeacherExam["status"],
  statusLabel?: string,
) {
  if (statusLabel === "Явагдаж байна" || statusLabel === "Товлогдсон") {
    return "default";
  }
  if (statusLabel === "Бэлэн болсон") return "secondary";
  if (status === "completed") return "secondary";
  if (status === "draft") return "outline";
  return "default";
}
