"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeacherExamScheduleList } from "@/components/teacher/teacher-exam-schedule-list";
import type { TeacherExam } from "@/lib/teacher-exams";

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
                <TeacherExamScheduleList
                  actionLabelOverride={actionLabelOverride}
                  exam={exam}
                  reviewMode={reviewMode}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
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
