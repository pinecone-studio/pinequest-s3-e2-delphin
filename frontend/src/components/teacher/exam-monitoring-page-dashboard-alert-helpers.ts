import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type {
  AlertItem,
  AlertSummaryItem,
  StudentListItem,
} from "./exam-monitoring-page-dashboard-types";
import { formatRelativeTimestamp } from "./exam-monitoring-page-dashboard-student-helpers";

export function buildAlerts(args: {
  absentStudents: number;
  attempts: StudentAttempt[];
  questionCount: number;
  students: StudentListItem[];
}): AlertItem[] {
  const { absentStudents, attempts, questionCount, students } = args;
  const suspiciousAlerts = attempts
    .filter(
      (attempt) =>
        attempt.status === "tab_switched" || attempt.status === "app_switched",
    )
    .map((attempt) => ({
      id: `${attempt.id}-${attempt.status}`,
      severity: "high" as const,
      highlighted: true,
      studentRef: attempt.studentName,
      title:
        attempt.status === "tab_switched"
          ? "Сэжигтэй үйлдэл илэрсэн"
          : "Системээс түр гарсан байж магадгүй",
      description: `${attempt.studentName} ${Math.min(
        attempt.currentQuestion,
        questionCount,
      )}-р асуултын орчим хяналт шаардлагатай байна.`,
      timestamp: formatRelativeTimestamp(attempt.lastActivity),
    }));
  const idleAlerts = students
    .filter((student) => student.status === "idle")
    .slice(0, 2)
    .map((student) => ({
      id: `${student.id}-idle`,
      severity: "medium" as const,
      studentRef: student.fullName,
      title: "Идэвх саарсан",
      description: `${student.fullName}-ийн сүүлийн хөдөлгөөн удааширсан байна.`,
      timestamp: student.trailingMeta,
    }));
  const submittedAlerts = attempts
    .filter((attempt) => attempt.status === "submitted")
    .slice(0, 3)
    .map((attempt) => ({
      id: `${attempt.id}-submitted`,
      severity: "info" as const,
      studentRef: attempt.studentName,
      title: "Шалгалт илгээгдсэн",
      description: `${attempt.studentName} шалгалтаа амжилттай дуусгалаа.`,
      timestamp: formatRelativeTimestamp(attempt.lastActivity),
    }));
  const absentAlert =
    absentStudents > 0
      ? [
          {
            id: "absent-students",
            severity: "medium" as const,
            title: "Нэвтрээгүй сурагч байна",
            description: `${absentStudents} сурагч хараахан QR эсвэл холбоосоор нэвтрээгүй байна.`,
            timestamp: "Одоогоор",
          },
        ]
      : [];

  return [
    ...suspiciousAlerts,
    ...idleAlerts,
    ...submittedAlerts,
    ...absentAlert,
  ].slice(0, 7);
}

export function summarizeAlerts(
  alerts: AlertItem[],
  students: StudentListItem[],
): AlertSummaryItem[] {
  const normal = students.filter((student) =>
    ["active", "joined", "submitted"].includes(student.status),
  ).length;
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
