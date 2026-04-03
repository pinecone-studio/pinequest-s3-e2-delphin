import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import { summaryStatIcons } from "./exam-monitoring-page-dashboard-constants";
import type { ChartDatum, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export function buildSummaryStats(args: {
  absentStudents: number;
  attempts: StudentAttempt[];
  chartData: ChartDatum[];
  exam: CreatedExam;
  joinedStudents: number;
  suspiciousActivities: number;
  submittedStudents: number;
  totalStudents: number;
}): SummaryStatItem[] {
  const {
    absentStudents,
    attempts,
    chartData,
    exam,
    joinedStudents,
    suspiciousActivities,
    submittedStudents,
    totalStudents,
  } = args;
  const averageProgress = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) =>
            sum + Math.min(attempt.currentQuestion, exam.questions.length),
          0,
        ) / attempts.length,
      )
    : 0;

  return [
    {
      key: "participants",
      label: "Оролцоо",
      value: `${joinedStudents}/${totalStudents}`,
      delta: `${Math.round((joinedStudents / Math.max(totalStudents, 1)) * 100)}%`,
      deltaTone: "positive",
      icon: summaryStatIcons.participants,
      sparklineData: chartData.map((item) => item.activeFocus),
    },
    {
      key: "progress",
      label: "Дундаж ахиц",
      value: `${averageProgress}`,
      delta: `/${exam.questions.length} асуулт`,
      deltaTone: "neutral",
      icon: summaryStatIcons.progress,
      sparklineData: chartData.map((item) => item.completionRate),
    },
    {
      key: "submitted",
      label: "Илгээсэн",
      value: `${submittedStudents}`,
      delta: `${Math.round(
        (submittedStudents / Math.max(joinedStudents, 1)) * 100,
      )}%`,
      deltaTone: submittedStudents > 0 ? "positive" : "neutral",
      icon: summaryStatIcons.submitted,
      sparklineData: chartData.map((item) => item.submissionRate),
    },
    {
      key: "alerts",
      label: "Эрсдэл ба анхааруулга",
      value: `${suspiciousActivities}`,
      delta: absentStudents > 0 ? `${absentStudents} ороогүй` : "Тогтвортой",
      deltaTone:
        suspiciousActivities > 0 || absentStudents > 0 ? "warning" : "positive",
      icon: summaryStatIcons.alerts,
      sparklineData: chartData.map((item) => item.warningRate),
    },
  ];
}

export function buildChartData(
  questionCount: number,
  attempts: StudentAttempt[],
  joinedStudents: number,
): ChartDatum[] {
  const safeQuestionCount = Math.max(questionCount, 1);
  const bucketCount = Math.min(8, safeQuestionCount);
  const bucketSize = Math.ceil(safeQuestionCount / bucketCount);
  const denominator = Math.max(joinedStudents, attempts.length, 1);

  return Array.from({ length: bucketCount }, (_, index) => {
    const rangeStart = index * bucketSize + 1;
    const rangeEnd = Math.min(safeQuestionCount, rangeStart + bucketSize - 1);
    const inRange = attempts.filter(
      (attempt) =>
        attempt.currentQuestion >= rangeStart &&
        attempt.currentQuestion <= rangeEnd,
    ).length;
    const completed = attempts.filter(
      (attempt) =>
        attempt.status === "submitted" || attempt.currentQuestion > rangeEnd,
    ).length;
    const warnings = attempts.filter(
      (attempt) =>
        (attempt.status === "tab_switched" ||
          attempt.status === "app_switched") &&
        attempt.currentQuestion >= Math.max(rangeStart - 1, 1) &&
        attempt.currentQuestion <= rangeEnd + 1,
    ).length;
    const submissions = attempts.filter(
      (attempt) =>
        attempt.status === "submitted" &&
        attempt.currentQuestion >= Math.max(rangeEnd - bucketSize, 1),
    ).length;

    return {
      label: rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
      questionCount: rangeEnd - rangeStart + 1,
      rangeStart,
      rangeEnd,
      completionRate: Math.round((completed / denominator) * 100),
      activeFocus: Math.round((inRange / denominator) * 100),
      submissionRate: Math.round((submissions / denominator) * 100),
      warningRate: Math.round((warnings / denominator) * 100),
    };
  });
}
