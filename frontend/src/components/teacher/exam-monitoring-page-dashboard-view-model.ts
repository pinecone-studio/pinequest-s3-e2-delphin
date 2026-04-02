import { getClassById } from "@/lib/mock-data-helpers";
import { formatHeaderDate, getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import { chartSeries, summaryStatIcons } from "./exam-monitoring-page-dashboard-constants";
import type { AlertItem, AlertSummaryItem, ChartDatum, DashboardViewModel, StudentListItem, StudentStatusKey, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export function buildDashboardViewModel({ attempts, exam, joinedStudents, suspiciousActivities, totalStudents }: { attempts: StudentAttempt[]; exam: CreatedExam; joinedStudents: number; suspiciousActivities: number; totalStudents: number; }): DashboardViewModel {
  const schedule = exam.schedules[0];
  const scheduleDate = schedule ? new Date(`${schedule.date}T${schedule.time}:00`) : null;
  const scheduledClasses = Array.from(new Set(exam.schedules.map((item) => item.classId))).map((classId) => getClassById(classId)).filter((item): item is NonNullable<ReturnType<typeof getClassById>> => Boolean(item));
  const totalRosterStudents = scheduledClasses.flatMap((item) => item.students);
  const rosterMap = new Map(totalRosterStudents.map((student) => [student.id, student]));
  const attemptMap = new Map(attempts.map((attempt) => [attempt.studentId, attempt]));
  const rosterStudents = [...totalRosterStudents, ...attempts.filter((attempt) => !rosterMap.has(attempt.studentId)).map((attempt) => ({ id: attempt.studentId, name: attempt.studentName, email: `${attempt.studentId}@demo.local`, classId: attempt.classId, password: "" }))];
  const students = rosterStudents.map((student) => buildStudentListItem({ attempt: attemptMap.get(student.id), examQuestionCount: exam.questions.length, student })).sort((left, right) => getStudentStatusPriority(left.status) - getStudentStatusPriority(right.status));
  const submittedStudents = attempts.filter((attempt) => attempt.status === "submitted").length;
  const absentStudents = students.filter((student) => student.status === "absent").length;
  const chartData = buildChartData(exam.questions.length, attempts, joinedStudents);
  const alerts = buildAlerts({ absentStudents, attempts, examQuestionCount: exam.questions.length, students });

  return {
    alertSummaries: summarizeAlerts(alerts),
    alerts,
    chartData,
    chartSeries,
    highlightRange: getHighlightedQuestionRange(attempts, exam.questions.length),
    rosterMetadata: [
      { key: "schedule", label: schedule ? `${schedule.date} • ${schedule.time}` : "Хуваарьгүй", icon: summaryStatIcons.schedule },
      { key: "students", label: `${joinedStudents}/${Math.max(totalStudents, rosterStudents.length)} оролцсон`, icon: summaryStatIcons.students },
      { key: "exam", label: `${exam.questions.length} асуулт • ${scheduleDate ? getAcademicWeekLabel(scheduleDate) : "..."}`, icon: summaryStatIcons.exam },
    ],
    students,
    summaryStats: buildSummaryStats({ absentStudents, attempts, chartData, exam, joinedStudents, suspiciousActivities, submittedStudents, totalStudents }),
  };
}

function buildStudentListItem({ attempt, examQuestionCount, student }: { attempt?: StudentAttempt; examQuestionCount: number; student: { classId: string; email: string; id: string; name: string; }; }): StudentListItem {
  const status = getStudentStatus(attempt);
  const className = getClassById(student.classId)?.name ?? student.classId;
  return { id: student.id, fullName: student.name, avatar: student.name, secondaryInfo: `${className} • ${student.email}`, tertiaryInfo: attempt ? `${formatRelativeTimestamp(attempt.lastActivity)} шинэчлэгдсэн` : "Одоогоор нэвтрээгүй", status, trailingMeta: attempt ? `${Math.min(attempt.currentQuestion, examQuestionCount)}/${examQuestionCount} асуулт` : "Хүлээгдэж байна", badges: buildStudentBadges(attempt) };
}

function buildSummaryStats({ absentStudents, attempts, chartData, exam, joinedStudents, suspiciousActivities, submittedStudents, totalStudents }: { absentStudents: number; attempts: StudentAttempt[]; chartData: ChartDatum[]; exam: CreatedExam; joinedStudents: number; submittedStudents: number; suspiciousActivities: number; totalStudents: number; }): SummaryStatItem[] {
  const averageProgress = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + Math.min(attempt.currentQuestion, exam.questions.length), 0) / attempts.length) : 0;
  return [
    { key: "participants", label: "Оролцоо", value: `${joinedStudents}/${totalStudents}`, delta: `${Math.round((joinedStudents / Math.max(totalStudents, 1)) * 100)}%`, deltaTone: "positive", icon: summaryStatIcons.participants, sparklineData: chartData.map((item) => item.activeFocus) },
    { key: "progress", label: "Дундаж ахиц", value: `${averageProgress}`, delta: `/${exam.questions.length} асуулт`, deltaTone: "neutral", icon: summaryStatIcons.progress, sparklineData: chartData.map((item) => item.completionRate) },
    { key: "submitted", label: "Илгээсэн", value: `${submittedStudents}`, delta: `${Math.round((submittedStudents / Math.max(joinedStudents, 1)) * 100)}%`, deltaTone: submittedStudents > 0 ? "positive" : "neutral", icon: summaryStatIcons.submitted, sparklineData: chartData.map((item) => item.submissionRate) },
    { key: "alerts", label: "Эрсдэл ба анхааруулга", value: `${suspiciousActivities}`, delta: absentStudents > 0 ? `${absentStudents} ороогүй` : "Тогтвортой", deltaTone: suspiciousActivities > 0 || absentStudents > 0 ? "warning" : "positive", icon: summaryStatIcons.alerts, sparklineData: chartData.map((item) => item.warningRate) },
  ];
}

function buildChartData(questionCount: number, attempts: StudentAttempt[], joinedStudents: number): ChartDatum[] {
  const safeQuestionCount = Math.max(questionCount, 1);
  const bucketCount = Math.min(8, safeQuestionCount);
  const bucketSize = Math.ceil(safeQuestionCount / bucketCount);
  const denominator = Math.max(joinedStudents, attempts.length, 1);
  return Array.from({ length: bucketCount }, (_, index) => {
    const rangeStart = index * bucketSize + 1;
    const rangeEnd = Math.min(safeQuestionCount, rangeStart + bucketSize - 1);
    const inRangeAttempts = attempts.filter((attempt) => attempt.currentQuestion >= rangeStart && attempt.currentQuestion <= rangeEnd);
    const completedPastRange = attempts.filter((attempt) => attempt.status === "submitted" || attempt.currentQuestion > rangeEnd);
    const warningsInRange = attempts.filter((attempt) => (attempt.status === "tab_switched" || attempt.status === "app_switched") && attempt.currentQuestion >= Math.max(rangeStart - 1, 1) && attempt.currentQuestion <= rangeEnd + 1);
    const submissionsNearRange = attempts.filter((attempt) => attempt.status === "submitted" && attempt.currentQuestion >= Math.max(rangeEnd - bucketSize, 1));
    return { label: rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`, questionCount: rangeEnd - rangeStart + 1, rangeStart, rangeEnd, completionRate: Math.round((completedPastRange.length / denominator) * 100), activeFocus: Math.round((inRangeAttempts.length / denominator) * 100), submissionRate: Math.round((submissionsNearRange.length / denominator) * 100), warningRate: Math.round((warningsInRange.length / denominator) * 100) };
  });
}

function buildAlerts({ absentStudents, attempts, examQuestionCount, students }: { absentStudents: number; attempts: StudentAttempt[]; examQuestionCount: number; students: StudentListItem[]; }): AlertItem[] {
  const suspiciousAlerts = attempts.filter((attempt) => attempt.status === "tab_switched" || attempt.status === "app_switched").map((attempt) => ({ id: `${attempt.id}-${attempt.status}`, severity: "high" as const, highlighted: true, studentRef: attempt.studentName, title: attempt.status === "tab_switched" ? "Сэжигтэй үйлдэл илэрсэн" : "Системээс түр гарсан байж магадгүй", description: `${attempt.studentName} ${Math.min(attempt.currentQuestion, examQuestionCount)}-р асуултын орчим хяналт шаардаж байна.`, timestamp: formatRelativeTimestamp(attempt.lastActivity) }));
  const submittedAlerts = attempts.filter((attempt) => attempt.status === "submitted").slice(0, 3).map((attempt) => ({ id: `${attempt.id}-submitted`, severity: "info" as const, studentRef: attempt.studentName, title: "Шалгалт илгээгдсэн", description: `${attempt.studentName} шалгалтаа амжилттай дуусгалаа.`, timestamp: formatRelativeTimestamp(attempt.lastActivity) }));
  const absentAlert = absentStudents > 0 ? [{ id: "absent-students", severity: "medium" as const, title: "Нэвтрээгүй сурагч байна", description: `${absentStudents} сурагч хараахан QR эсвэл холбоосоор нэвтрээгүй байна.`, timestamp: "Одоогоор" }] : [];
  const idleAlerts = students.filter((student) => student.status === "idle").slice(0, 2).map((student) => ({ id: `${student.id}-idle`, severity: "medium" as const, studentRef: student.fullName, title: "Идэвх саарсан", description: `${student.fullName}-ийн сүүлийн хөдөлгөөн удааширсан байна.`, timestamp: student.tertiaryInfo?.replace(" шинэчлэгдсэн", "") }));
  return [...suspiciousAlerts, ...idleAlerts, ...submittedAlerts, ...absentAlert].slice(0, 7);
}

function summarizeAlerts(alerts: AlertItem[]): AlertSummaryItem[] {
  const summary = { high: alerts.filter((alert) => alert.severity === "high").length, medium: alerts.filter((alert) => alert.severity === "medium").length, info: alerts.filter((alert) => alert.severity === "info").length };
  return [
    { key: "high", label: "Хэвийн", count: Math.max(0, 24 - summary.high - summary.medium), tone: "success" },
    { key: "medium", label: "Сэжигтэй", count: summary.medium, tone: "warning" },
    { key: "high-alerts", label: "Эрсдэлтэй", count: summary.high, tone: "danger" },
    { key: "info", label: "Мэдээлэл", count: summary.info, tone: "neutral" },
  ];
}

function getStudentStatus(attempt?: StudentAttempt): StudentStatusKey {
  if (!attempt) return "absent";
  if (attempt.status === "submitted") return "submitted";
  if (attempt.status === "tab_switched" || attempt.status === "app_switched") return "suspicious";
  if (Date.now() - new Date(attempt.lastActivity).getTime() > 10 * 60 * 1000) return "idle";
  return attempt.status === "joined" ? "joined" : "active";
}

function buildStudentBadges(attempt?: StudentAttempt) {
  if (!attempt) return ["QR хүлээгдэж байна"];
  if (attempt.status === "submitted") return ["Илгээсэн"];
  if (attempt.status === "tab_switched") return ["Tab switch"];
  if (attempt.status === "app_switched") return ["App switch"];
  return ["Хяналт хэвийн"];
}

function getStudentStatusPriority(status: StudentStatusKey) {
  return { suspicious: 0, idle: 1, active: 2, joined: 3, submitted: 4, absent: 5 }[status];
}

function getHighlightedQuestionRange(attempts: StudentAttempt[], questionCount: number) {
  const activeAttempts = attempts.filter((attempt) => attempt.status !== "submitted");
  if (activeAttempts.length === 0) return undefined;
  const averageQuestion = Math.round(activeAttempts.reduce((sum, attempt) => sum + attempt.currentQuestion, 0) / activeAttempts.length);
  return { start: Math.max(1, averageQuestion - 1), end: Math.min(questionCount, averageQuestion + 1) };
}

function formatRelativeTimestamp(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 1) return "саяхан";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} цагийн өмнө` : `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
