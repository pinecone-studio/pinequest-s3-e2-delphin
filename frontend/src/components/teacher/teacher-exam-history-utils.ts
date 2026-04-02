import type { TeacherExam } from "@/lib/teacher-exams"
import type { DateRange } from "react-day-picker"
import { getDemoClassLabel } from "@/lib/teacher-class-detail"

export function buildHistoryReviewLink(exam: TeacherExam) {
  const firstSchedule = exam.scheduledClasses[0]
  return firstSchedule ? `/teacher/classes?classId=${firstSchedule.classId}&examId=${exam.id}` : `/teacher/exams/${exam.id}/monitoring`
}

export function formatExamDateSummary(exam: TeacherExam) {
  const timestamps = exam.scheduledClasses
    .map((schedule) => new Date(`${schedule.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime())

  if (timestamps.length === 0) return "Огноо байхгүй"
  if (timestamps[0].getTime() === timestamps[timestamps.length - 1].getTime()) return formatDisplayDate(timestamps[0])
  return `${formatDisplayDate(timestamps[0])} - ${formatDisplayDate(timestamps[timestamps.length - 1])}`
}

export function formatExamClassSummary(exam: TeacherExam) {
  return Array.from(new Set(exam.scheduledClasses.map((schedule) => schedule.classId))).map(getDemoClassLabel).join(", ")
}

export function isDateWithinRange(dateString: string, dateRange?: DateRange) {
  if (!dateRange?.from && !dateRange?.to) return true
  const examDate = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(examDate.getTime())) return false
  const from = dateRange.from ? new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate()) : null
  const to = dateRange.to
    ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59, 999)
    : null
  return !(from && examDate < from) && !(to && examDate > to)
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
}
