"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ExamMonitoringPageDashboard } from "@/components/teacher/exam-monitoring-page-dashboard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExamMonitoring } from "@/hooks/use-exam-monitoring";

export default function ExamMonitoringPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const { attempts, error, exam, isLoading, stats, timeRemaining } =
    useExamMonitoring(examId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Хяналтын хуудсыг ачааллаж байна...
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Алдаа гарлаа</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Буцах
        </Button>
      </div>
    );
  }

  const firstClassId = exam.schedules[0]?.classId;
  const isCompleted = timeRemaining <= 0;

  return (
    <ExamMonitoringPageDashboard
      attempts={attempts}
      backHref="/teacher/exams"
      exam={exam}
      joinedStudents={stats.joinedStudents}
      resultsHref={
        isCompleted && firstClassId
          ? `/teacher/classes/${firstClassId}/exam/${examId}`
          : undefined
      }
      suspiciousActivities={stats.suspiciousActivities}
      totalStudents={stats.totalStudents}
    />
  );
}
