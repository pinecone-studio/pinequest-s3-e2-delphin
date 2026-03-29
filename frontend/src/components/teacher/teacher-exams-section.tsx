"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TeacherExam } from "@/lib/teacher-exams";
import { classes } from "@/lib/mock-data";

type ReviewMode = "completed" | "live";

export function TeacherExamsSection({
  actionLabelOverride,
  emptyLabel,
  exams,
  reviewMode,
  statusLabelOverride,
  title,
}: {
  actionLabelOverride?: string;
  emptyLabel: string;
  exams: TeacherExam[];
  reviewMode?: ReviewMode;
  statusLabelOverride?: string;
  title: string;
}) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {exams.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {emptyLabel}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.questions.length} асуулт, {exam.duration} мин
                    </CardDescription>
                  </div>
                  <Badge
                    variant={getBadgeVariant(exam.status, statusLabelOverride)}
                  >
                    {statusLabelOverride ?? formatStatus(exam.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {exam.status === "draft" ? (
                  <Link href={`/teacher/exams/${exam.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Засварыг үргэлжлүүлэх
                    </Button>
                  </Link>
                ) : reviewMode ? (
                  <div className="space-y-3">
                    {getDisplaySchedules(exam, reviewMode).map((schedule) => (
                      <div
                        key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">
                              {schedule.classId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {schedule.date} {schedule.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild size="sm">
                              <Link
                                href={`/teacher/classes/${schedule.classId}/exam/${exam.id}`}
                              >
                                {reviewMode === "live"
                                  ? (actionLabelOverride ?? "Явцыг харах")
                                  : (actionLabelOverride ?? "Үр дүнг харах")}
                              </Link>
                            </Button>
                            {reviewMode === "live" && (
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  href={`/teacher/exams/${exam.id}/monitoring`}
                                >
                                  Хяналтын самбар
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                            {actionLabelOverride ?? "Засах"}
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const ALL_CLASSES_LABEL = "Бүх анги";

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
    return [
      {
        classId: ALL_CLASSES_LABEL,
        date,
        time,
      },
    ];
  });
}

function formatStatus(status: TeacherExam["status"]) {
  if (status === "completed") return "Дууссан";
  if (status === "draft") return "Ноорог";
  return "Товлогдсон";
}

function getBadgeVariant(
  status: TeacherExam["status"],
  statusLabelOverride?: string,
) {
  if (statusLabelOverride === "Явагдаж байна") return "default";
  if (status === "completed") return "secondary";
  if (status === "draft") return "outline";
  return "default";
}
