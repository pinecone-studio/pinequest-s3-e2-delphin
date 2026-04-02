"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock-data";
import type { TeacherExam } from "@/lib/teacher-exams";

type ReviewMode = "completed" | "live";

const ALL_CLASSES_LABEL = "Бүх анги";

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
      <div className="flex justify-start xl:justify-end">
        <Link href={`/teacher/exams/${exam.id}/edit`}>
          <Button variant="outline" size="sm">
            Засварыг үргэлжлүүлэх
          </Button>
        </Link>
      </div>
    );
  }

  const schedules = getDisplaySchedules(exam, reviewMode);

  if (reviewMode === "live") {
    return (
      <div className="flex flex-col gap-3 xl:items-end">
        <p className="text-sm text-slate-500">
          {formatScheduleSummary(schedules)}
        </p>
        <Button asChild size="sm">
          <Link href={`/teacher/exams/${exam.id}/monitoring`}>
            {actionLabelOverride ?? "Шалгалт хянах"}
          </Link>
        </Button>
      </div>
    );
  }

  if (reviewMode === "completed") {
    const primarySchedule = schedules[0];

    return (
      <div className="flex flex-col gap-3 xl:items-end">
        <p className="text-sm text-slate-500">
          {formatScheduleSummary(schedules)}
        </p>
        {primarySchedule ? (
          <Button asChild size="sm">
            <Link href={`/teacher/classes?classId=${primarySchedule.classId}&examId=${exam.id}`}>
              {actionLabelOverride ?? "Үр дүнг харах"}
            </Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 xl:items-end">
      <p className="text-sm text-slate-500">{formatScheduleSummary(schedules)}</p>
      {exam.status === "scheduled" ? (
        <Link href={`/teacher/exams/${exam.id}/edit`}>
          <Button variant="outline" size="sm">
            {actionLabelOverride ?? "Засах"}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

function formatScheduleSummary(
  schedules: Array<{ classId: string; date: string; time: string }>,
) {
  if (schedules.length === 0) {
    return "Хуваарь оруулаагүй байна";
  }

  const uniqueClasses = Array.from(
    new Set(schedules.map((schedule) => schedule.classId)),
  );
  const uniqueSlots = Array.from(
    new Set(schedules.map((schedule) => `${schedule.date} ${schedule.time}`)),
  );

  const slotLabel =
    uniqueSlots.length === 1
      ? uniqueSlots[0]
      : `${uniqueSlots[0]} +${uniqueSlots.length - 1}`;

  return `${uniqueClasses.join(", ")} • ${slotLabel}`;
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
