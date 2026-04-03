import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type {
  StudentListItem,
  StudentStatusKey,
} from "./exam-monitoring-page-dashboard-types";
import { getClassById } from "@/lib/mock-data-helpers";

export function buildStudentListItem(
  student: { classId: string; email: string; id: string; name: string },
  attempt: StudentAttempt | undefined,
  questionCount: number,
): StudentListItem {
  const className = getClassById(student.classId)?.name ?? student.classId;
  const completedQuestions = attempt
    ? Math.min(attempt.currentQuestion, questionCount)
    : 0;
  const progressPercent =
    questionCount > 0
      ? Math.round((completedQuestions / questionCount) * 100)
      : 0;

  return {
    id: student.id,
    fullName: student.name,
    avatar: student.name,
    secondaryInfo: className,
    tertiaryInfo: attempt
      ? `${completedQuestions}/${questionCount} асуулт • ${progressPercent}%`
      : "Одоогоор нэвтрээгүй",
    status: getStudentStatus(attempt),
    trailingMeta: attempt
      ? formatRelativeTimestamp(attempt.lastActivity)
      : "Хүлээгдэж байна",
    badges: buildStudentBadges(attempt),
  };
}

export function getStudentStatusPriority(status: StudentStatusKey) {
  return {
    suspicious: 0,
    idle: 1,
    active: 2,
    joined: 3,
    submitted: 4,
    absent: 5,
  }[status];
}

export function formatRelativeTimestamp(value: string) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "саяхан";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.round(minutes / 60);
  return hours < 24
    ? `${hours} цагийн өмнө`
    : `${date.getMonth() + 1}/${date.getDate()} ${String(
        date.getHours(),
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getStudentStatus(attempt?: StudentAttempt): StudentStatusKey {
  if (!attempt) return "absent";
  if (attempt.status === "submitted") return "submitted";
  if (attempt.status === "tab_switched" || attempt.status === "app_switched") {
    return "suspicious";
  }
  if (Date.now() - new Date(attempt.lastActivity).getTime() > 10 * 60 * 1000) {
    return "idle";
  }
  return attempt.status === "joined" ? "joined" : "active";
}

function buildStudentBadges(attempt?: StudentAttempt) {
  if (!attempt) return ["QR хүлээгдэж байна"];
  if (attempt.status === "submitted") return ["Илгээсэн"];
  if (attempt.status === "tab_switched") return ["Tab switch"];
  if (attempt.status === "app_switched") return ["App switch"];
  return ["Хяналт хэвийн"];
}
