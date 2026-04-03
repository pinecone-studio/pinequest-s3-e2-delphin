import type { Exam, ExamResult } from "@/lib/mock-data"
import { getLocalDateString } from "@/lib/student-exam-time"

export const FIGMA_ICON_PHYSICS =
  "https://www.figma.com/api/mcp/asset/4ff94fbd-ead0-4ad6-a08e-0ff33b094601"
export const FIGMA_ICON_SOCIAL =
  "https://www.figma.com/api/mcp/asset/7da72c0e-2c2b-4589-9e7a-c5b667159b2d"
export const FIGMA_ICON_MATH =
  "https://www.figma.com/api/mcp/asset/343ac7d5-4933-4203-afc0-cca382acf71f"
export const FIGMA_ICON_CHEMISTRY =
  "https://www.figma.com/api/mcp/asset/a64413ea-0461-4a8b-a509-ff709c4865e9"

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

  if (lowerTitle.includes("хими")) return FIGMA_ICON_CHEMISTRY
  if (lowerTitle.includes("нийгмийн")) return FIGMA_ICON_SOCIAL
  if (lowerTitle.includes("математик")) return FIGMA_ICON_MATH
  return FIGMA_ICON_PHYSICS
}

export function formatScheduleLabel(date?: string, time?: string) {
  if (!date || !time) return "Хуваарь ороогүй"
  return date === getLocalDateString() ? `Өнөөдөр · ${time}` : `${date} · ${time}`
}
