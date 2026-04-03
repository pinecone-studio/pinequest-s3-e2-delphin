import { getClassById } from "@/lib/mock-data-helpers";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import {
  buildAlerts,
  summarizeAlerts,
} from "./exam-monitoring-page-dashboard-alert-helpers";
import { summaryStatIcons } from "./exam-monitoring-page-dashboard-constants";
import {
  buildChartData,
  buildSummaryStats,
} from "./exam-monitoring-page-dashboard-metrics";
import {
  buildStudentListItem,
  getStudentStatusPriority,
} from "./exam-monitoring-page-dashboard-student-helpers";
import type {
  DashboardViewModel,
} from "./exam-monitoring-page-dashboard-types";

export function buildDashboardViewModel(props: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  joinedStudents: number;
  suspiciousActivities: number;
  totalStudents: number;
}): DashboardViewModel {
  const { attempts, exam, joinedStudents, suspiciousActivities, totalStudents } =
    props;
  const scheduledClasses = [...new Set(exam.schedules.map((item) => item.classId))]
    .map((classId) => getClassById(classId))
    .filter(
      (item): item is NonNullable<ReturnType<typeof getClassById>> =>
        Boolean(item),
    );
  const rosterStudents = scheduledClasses.flatMap((item) => item.students);
  const rosterMap = new Map(rosterStudents.map((student) => [student.id, student]));
  const mergedRoster = [
    ...rosterStudents,
    ...attempts
      .filter((attempt) => !rosterMap.has(attempt.studentId))
      .map((attempt) => ({
        id: attempt.studentId,
        name: attempt.studentName,
        email: `${attempt.studentId}@demo.local`,
        classId: attempt.classId,
        password: "",
      })),
  ];
  const attemptMap = new Map(attempts.map((attempt) => [attempt.studentId, attempt]));
  const students = mergedRoster
    .map((student) =>
      buildStudentListItem(student, attemptMap.get(student.id), exam.questions.length),
    )
    .sort(
      (left, right) =>
        getStudentStatusPriority(left.status) -
        getStudentStatusPriority(right.status),
    );
  const absentStudents = students.filter((student) => student.status === "absent").length;
  const submittedStudents = attempts.filter(
    (attempt) => attempt.status === "submitted",
  ).length;
  const chartData = buildChartData(exam.questions.length, attempts, joinedStudents);
  const alerts = buildAlerts({
    absentStudents,
    attempts,
    questionCount: exam.questions.length,
    students,
  });
  const classLabel = scheduledClasses.length
    ? scheduledClasses.map((item) => item.name).join(", ")
    : "Анги сонгогдоогүй";

  return {
    alertSummaries: summarizeAlerts(alerts, students),
    alerts,
    rosterMetadata: [
      { key: "classes", label: classLabel, icon: summaryStatIcons.schedule },
      {
        key: "total-students",
        label: `Нийт ${Math.max(totalStudents, mergedRoster.length)} сурагч`,
        icon: summaryStatIcons.exam,
      },
      {
        key: "joined-students",
        label: `${joinedStudents} сурагч орсон`,
        icon: summaryStatIcons.students,
      },
    ],
    students,
    summaryStats: buildSummaryStats({
      absentStudents,
      attempts,
      chartData,
      exam,
      joinedStudents,
      suspiciousActivities,
      submittedStudents,
      totalStudents,
    }),
  };
}
