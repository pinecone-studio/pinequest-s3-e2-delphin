"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ExamMonitoringDashboard } from "@/components/teacher/exam-monitoring-dashboard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExamMonitoring } from "@/hooks/use-exam-monitoring";
import { ArrowLeft } from "lucide-react";

export default function ExamMonitoringPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const { attempts, error, exam, isLoading, stats, timeRemaining } =
    useExamMonitoring(examId);

  const formatTime = (seconds: number) =>
    [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
      .map((value) => value.toString().padStart(2, "0"))
      .join(":");

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

  const examUrl = `${window.location.origin}/student/login?redirect=${encodeURIComponent(
    `/student/exams/${examId}/join`,
  )}`;
  const firstClassId = exam.schedules[0]?.classId;
  const isCompleted = timeRemaining <= 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push("/teacher/exams")}
          className="inline-flex items-center gap-2 text-[18px] font-medium text-[#36527a] transition hover:text-[#1f3556]"
        >
          <ArrowLeft className="h-5 w-5" />
          Шалгалтууд руу буцах
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.3rem] font-semibold tracking-[-0.03em] text-[#1f3b63]">
              Шалгалтын хяналт
            </h1>
            <p className="mt-1 text-sm text-slate-500">{exam.title}</p>
          </div>
          <div className="flex gap-2">
            {isCompleted && firstClassId ? (
              <Button
                onClick={() => router.push(`/teacher/classes/${firstClassId}/exam/${examId}`)}
              >
                Үр дүн харах
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <ExamMonitoringDashboard
        attempts={attempts}
        exam={exam}
        examUrl={examUrl}
        joinedStudents={stats.joinedStudents}
        suspiciousActivities={stats.suspiciousActivities}
        timeRemaining={formatTime(timeRemaining)}
        totalStudents={stats.totalStudents}
      />
    </div>
  );
}
