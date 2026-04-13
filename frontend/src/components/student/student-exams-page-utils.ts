import type { Exam, ExamResult } from "@/lib/mock-data"
import { getLocalDateString } from "@/lib/student-exam-time"

export const EXAM_ICON_GENERAL = "/question-icon-general.svg"
export const EXAM_ICON_SOCIAL = "/question-icon-creative.svg"
export const EXAM_ICON_MATH = "/question-icon-logic.svg"
export const EXAM_ICON_CHEMISTRY = "/question-icon-analysis.svg"

export type FinishedExamItem =
  | { kind: "result"; exam: Exam; result: ExamResult }
  | { kind: "missed"; exam: Exam }

export function getStudentSchedule(exam: Exam, studentClass: string) {
  return exam.scheduledClasses.find((entry) => entry.classId === studentClass)
}

export function getStudentExamTitle(exam: Exam) {
  return exam.title
    .trim()
    .replace(/^\s*\d+[A-Za-zА-Яа-яӨөҮүЁё]+\b\s*/u, "")
}

export function getExamCategory(exam: Exam) {
  return getStudentExamTitle(exam).split(/[-–]/)[0]?.trim() || getStudentExamTitle(exam)
}

export function getExamIcon(title: string) {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes("хими")) return EXAM_ICON_CHEMISTRY
  if (lowerTitle.includes("нийгмийн")) return EXAM_ICON_SOCIAL
  if (lowerTitle.includes("математик")) return EXAM_ICON_MATH
  return EXAM_ICON_GENERAL
}

export function formatScheduleLabel(date?: string, time?: string) {
  if (!date || !time) return "Хуваарь ороогүй"
  return date === getLocalDateString() ? `Өнөөдөр · ${time}` : `${date} · ${time}`
}
