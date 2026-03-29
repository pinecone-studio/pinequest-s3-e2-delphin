"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ExamMonitoringDashboard } from "@/components/teacher/exam-monitoring-dashboard";
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

  const formatTime = (seconds: number) =>
    [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
      .map((value) => value.toString().padStart(2, "0"))
      .join(":");

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Ð¥ÑÐ½Ð°Ð»Ñ‚Ñ‹Ð½ Ñ…ÑƒÑƒÐ´ÑÑ‹Ð³ Ð°Ñ‡Ð°Ð°Ð»Ð»Ð°Ð¶ Ð±Ð°Ð¹Ð½Ð°...
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">ÐÐ»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Ð‘ÑƒÑ†Ð°Ñ…
        </Button>
      </div>
    );
  }

  const examUrl = `${window.location.origin}/student/exams/${examId}/join`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð½ Ñ…ÑÐ½Ð°Ð»Ñ‚</h1>
          <p className="text-muted-foreground">{exam.title}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ÑƒÑƒÐ´ Ñ€ÑƒÑƒ Ð±ÑƒÑ†Ð°Ñ…
        </Button>
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
