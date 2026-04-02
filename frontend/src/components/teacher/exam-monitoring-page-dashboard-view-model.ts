import { getClassById } from "@/lib/mock-data-helpers";
import { getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import {
  chartSeries,
  summaryStatIcons,
} from "./exam-monitoring-page-dashboard-constants";
import type {
  AlertItem,
  AlertSummaryItem,
  ChartDatum,
  DashboardViewModel,
  StudentListItem,
  StudentStatusKey,
  SummaryStatItem,
} from "./exam-monitoring-page-dashboard-types";

export function buildDashboardViewModel(props: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  joinedStudents: number;
  suspiciousActivities: number;
  totalStudents: number;
}): DashboardViewModel {
  const { attempts, exam, joinedStudents, suspiciousActivities, totalStudents } = props;
  const schedule = exam.schedules[0];
  const scheduleDate = schedule ? new Date(`${schedule.date}T${schedule.time}:00`) : null;
  const rosterStudents = [...new Set(exam.schedules.map((item) => item.classId))]
    .map((classId) => getClassById(classId))
    .filter((item): item is NonNullable<ReturnType<typeof getClassById>> => Boolean(item))
    .flatMap((item) => item.students);
  const rosterMap = new Map(rosterStudents.map((student) => [student.id, student]));
  const mergedRoster = [
    ...rosterStudents,
    ...attempts
      .filter((attempt) => !rosterMap.has(attempt.studentId))
      .map((attempt) => ({ id: attempt.studentId, name: attempt.studentName, email: `${attempt.studentId}@demo.local`, classId: attempt.classId, password: "" })),
  ];
  const attemptMap = new Map(attempts.map((attempt) => [attempt.studentId, attempt]));
  const students = mergedRoster
    .map((student) => buildStudentListItem(student, attemptMap.get(student.id), exam.questions.length))
    .sort((left, right) => getStudentStatusPriority(left.status) - getStudentStatusPriority(right.status));
  const absentStudents = students.filter((student) => student.status === "absent").length;
  const submittedStudents = attempts.filter((attempt) => attempt.status === "submitted").length;
  const chartData = buildChartData(exam.questions.length, attempts, joinedStudents);
  const alerts = buildAlerts(attempts, students, exam.questions.length, absentStudents);

  return {
    alertSummaries: summarizeAlerts(alerts, students),
    alerts,
    chartData,
    chartSeries,
    highlightRange: getHighlightedQuestionRange(attempts, exam.questions.length),
    rosterMetadata: [
      { key: "schedule", label: schedule ? `${schedule.date} • ${schedule.time}` : "Хуваарьгүй", icon: summaryStatIcons.schedule },
      { key: "students", label: `${joinedStudents}/${Math.max(totalStudents, mergedRoster.length)} оролцсон`, icon: summaryStatIcons.students },
      { key: "exam", label: `${exam.questions.length} асуулт • ${scheduleDate ? getAcademicWeekLabel(scheduleDate) : "..."}`, icon: summaryStatIcons.exam },
    ],
    students,
    summaryStats: buildSummaryStats(absentStudents, attempts, chartData, exam, joinedStudents, suspiciousActivities, submittedStudents, totalStudents),
  };
}

function buildStudentListItem(student: { classId: string; email: string; id: string; name: string }, attempt: StudentAttempt | undefined, questionCount: number): StudentListItem {
  const className = getClassById(student.classId)?.name ?? student.classId;
  return {
    id: student.id,
    fullName: student.name,
    avatar: student.name,
    secondaryInfo: `${className} • ${student.email}`,
    tertiaryInfo: attempt ? `${formatRelativeTimestamp(attempt.lastActivity)} шинэчлэгдсэн` : "Одоогоор нэвтрээгүй",
    status: getStudentStatus(attempt),
    trailingMeta: attempt ? `${Math.min(attempt.currentQuestion, questionCount)}/${questionCount} асуулт` : "Хүлээгдэж байна",
    badges: buildStudentBadges(attempt),
  };
}

function buildSummaryStats(absentStudents: number, attempts: StudentAttempt[], chartData: ChartDatum[], exam: CreatedExam, joinedStudents: number, suspiciousActivities: number, submittedStudents: number, totalStudents: number): SummaryStatItem[] {
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
    const inRange = attempts.filter((attempt) => attempt.currentQuestion >= rangeStart && attempt.currentQuestion <= rangeEnd).length;
    const completed = attempts.filter((attempt) => attempt.status === "submitted" || attempt.currentQuestion > rangeEnd).length;
    const warnings = attempts.filter((attempt) => (attempt.status === "tab_switched" || attempt.status === "app_switched") && attempt.currentQuestion >= Math.max(rangeStart - 1, 1) && attempt.currentQuestion <= rangeEnd + 1).length;
    const submissions = attempts.filter((attempt) => attempt.status === "submitted" && attempt.currentQuestion >= Math.max(rangeEnd - bucketSize, 1)).length;
    return { label: rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`, questionCount: rangeEnd - rangeStart + 1, rangeStart, rangeEnd, completionRate: Math.round((completed / denominator) * 100), activeFocus: Math.round((inRange / denominator) * 100), submissionRate: Math.round((submissions / denominator) * 100), warningRate: Math.round((warnings / denominator) * 100) };
  });
}

function buildAlerts(attempts: StudentAttempt[], students: StudentListItem[], questionCount: number, absentStudents: number): AlertItem[] {
  const suspiciousAlerts = attempts.filter((attempt) => attempt.status === "tab_switched" || attempt.status === "app_switched").map((attempt) => ({ id: `${attempt.id}-${attempt.status}`, severity: "high" as const, highlighted: true, studentRef: attempt.studentName, title: attempt.status === "tab_switched" ? "Сэжигтэй үйлдэл илэрсэн" : "Системээс түр гарсан байж магадгүй", description: `${attempt.studentName} ${Math.min(attempt.currentQuestion, questionCount)}-р асуултын орчим хяналт шаардлагатай байна.`, timestamp: formatRelativeTimestamp(attempt.lastActivity) }));
  const idleAlerts = students.filter((student) => student.status === "idle").slice(0, 2).map((student) => ({ id: `${student.id}-idle`, severity: "medium" as const, studentRef: student.fullName, title: "Идэвх саарсан", description: `${student.fullName}-ийн сүүлийн хөдөлгөөн удааширсан байна.`, timestamp: student.tertiaryInfo?.replace(" шинэчлэгдсэн", "") }));
  const submittedAlerts = attempts.filter((attempt) => attempt.status === "submitted").slice(0, 3).map((attempt) => ({ id: `${attempt.id}-submitted`, severity: "info" as const, studentRef: attempt.studentName, title: "Шалгалт илгээгдсэн", description: `${attempt.studentName} шалгалтаа амжилттай дуусгалаа.`, timestamp: formatRelativeTimestamp(attempt.lastActivity) }));
  const absentAlert = absentStudents > 0 ? [{ id: "absent-students", severity: "medium" as const, title: "Нэвтрээгүй сурагч байна", description: `${absentStudents} сурагч хараахан QR эсвэл холбоосоор нэвтрээгүй байна.`, timestamp: "Одоогоор" }] : [];
  return [...suspiciousAlerts, ...idleAlerts, ...submittedAlerts, ...absentAlert].slice(0, 7);
}

function summarizeAlerts(alerts: AlertItem[], students: StudentListItem[]): AlertSummaryItem[] {
  const normal = students.filter((student) => ["active", "joined", "submitted"].includes(student.status)).length;
  const medium = students.filter((student) => student.status === "idle").length;
  const high = students.filter((student) => student.status === "suspicious").length;
  const info = alerts.filter((alert) => alert.severity === "info").length;
  return [
    { key: "normal", label: "Хэвийн", count: normal, tone: "success" },
    { key: "medium", label: "Сэжигтэй", count: medium, tone: "warning" },
    { key: "high-alerts", label: "Эрсдэлтэй", count: high, tone: "danger" },
    { key: "info", label: "Мэдээлэл", count: info, tone: "neutral" },
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
  if (!activeAttempts.length) return undefined;
  const average = Math.round(activeAttempts.reduce((sum, attempt) => sum + attempt.currentQuestion, 0) / activeAttempts.length);
  return { start: Math.max(1, average - 1), end: Math.min(questionCount, average + 1) };
}

function formatRelativeTimestamp(value: string) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "саяхан";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} цагийн өмнө` : `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
