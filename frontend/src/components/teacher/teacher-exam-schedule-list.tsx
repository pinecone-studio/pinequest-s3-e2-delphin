"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock-data";
import type { TeacherExam } from "@/lib/teacher-exams";

type ReviewMode = "completed" | "live";

const ALL_CLASSES_LABEL = "Ð‘Ò¯Ñ… Ð°Ð½Ð³Ð¸";

export function TeacherExamScheduleList({
  actionLabelOverride,
  exam,
  reviewMode,
}: {
  actionLabelOverride?: string;
  exam: TeacherExam;
  reviewMode?: ReviewMode;
}) {
  if (exam.status === "draft") {
    return (
      <Link href={`/teacher/exams/${exam.id}/edit`}>
        <Button variant="outline" size="sm">
          Ð—Ð°ÑÐ²Ð°Ñ€Ñ‹Ð³ Ò¯Ñ€Ð³ÑÐ»Ð¶Ð»Ò¯Ò¯Ð»ÑÑ…
        </Button>
      </Link>
    );
  }

  if (reviewMode) {
    return (
      <div className="space-y-3">
        {getDisplaySchedules(exam, reviewMode).map((schedule) => (
          <div
            key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{schedule.classId}</p>
                <p className="text-sm text-muted-foreground">
                  {schedule.date} {schedule.time}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href={`/teacher/classes/${schedule.classId}/exam/${exam.id}`}>
                    {reviewMode === "live"
                      ? (actionLabelOverride ?? "Ð¯Ð²Ñ†Ñ‹Ð³ Ñ…Ð°Ñ€Ð°Ñ…")
                      : (actionLabelOverride ?? "Ò®Ñ€ Ð´Ò¯Ð½Ð³ Ñ…Ð°Ñ€Ð°Ñ…")}
                  </Link>
                </Button>
                {reviewMode === "live" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/teacher/exams/${exam.id}/monitoring`}>
                      Ð¥ÑÐ½Ð°Ð»Ñ‚Ñ‹Ð½ ÑÐ°Ð¼Ð±Ð°Ñ€
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {getDisplaySchedules(exam).map((schedule) => (
        <div
          key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`}
          className="flex justify-between text-sm"
        >
          <span className="font-medium">{schedule.classId}</span>
          <span className="text-muted-foreground">
            {schedule.date} {schedule.time}
          </span>
        </div>
      ))}
      {exam.status === "scheduled" ? (
        <div className="flex gap-2 pt-2">
          <Link href={`/teacher/exams/${exam.id}/edit`}>
            <Button variant="outline" size="sm">
              {actionLabelOverride ?? "Ð—Ð°ÑÐ°Ñ…"}
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function getDisplaySchedules(exam: TeacherExam, reviewMode?: ReviewMode) {
  if (exam.status === "completed" || reviewMode === "live") {
    return exam.scheduledClasses;
  }

  const allClassIds = new Set(classes.map((classEntry) => classEntry.id));
  const groups = new Map<string, typeof exam.scheduledClasses>();

  exam.scheduledClasses.forEach((schedule) => {
    const key = `${schedule.date}::${schedule.time}`;
    const current = groups.get(key) ?? [];
    current.push(schedule);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).flatMap(([key, schedules]) => {
    const scheduledClassIds = new Set(
      schedules.map((schedule) => schedule.classId),
    );
    const matchesAllClasses =
      scheduledClassIds.size === allClassIds.size &&
      Array.from(allClassIds).every((classId) =>
        scheduledClassIds.has(classId),
      );

    if (!matchesAllClasses) {
      return schedules;
    }

    const [date, time] = key.split("::");
    return [{ classId: ALL_CLASSES_LABEL, date, time }];
  });
}
