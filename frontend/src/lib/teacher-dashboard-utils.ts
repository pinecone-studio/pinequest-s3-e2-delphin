import type { Class, Exam, ExamResult } from "@/lib/mock-data-types"

export type MetricCardData = { delta: number; label: string; trend: number[]; value: number }
export type DashboardMetrics = { averageScore: MetricCardData; totalExams: MetricCardData; totalStudents: MetricCardData }

export const teacherWeekDays = [
  { full: "Даваа", short: "ДАВ" },
  { full: "Мягмар", short: "МЯГ" },
  { full: "Лхагва", short: "ЛХА" },
  { full: "Пүрэв", short: "ПҮ" },
  { full: "Баасан", short: "БА" },
  { full: "Бямба", short: "БЯ" },
  { full: "Ням", short: "НЯ" },
]

const mongolianMonthNames = [
  "нэгдүгээр сарын",
  "хоёрдугаар сарын",
  "гуравдугаар сарын",
  "дөрөвдүгээр сарын",
  "тавдугаар сарын",
  "зургаадугаар сарын",
  "долоодугаар сарын",
  "наймдугаар сарын",
  "есдүгээр сарын",
  "аравдугаар сарын",
  "арваннэгдүгээр сарын",
  "арванхоёрдугаар сарын",
]

export const teacherTimeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]
export const formatHeaderDate = (value: Date) => `${value.getFullYear()} оны ${mongolianMonthNames[value.getMonth()]} ${value.getDate()}`
export const formatCompactDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
}
export const formatTeacherCalendarTitle = (value: Date) => `${value.getMonth() + 1}-р сар ${value.getFullYear()} он`
export const formatIsoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
export const formatTimeLabel = (value: Date) => `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`

export function getGreetingLabel(value: Date) {
  const hour = value.getHours()
  if (hour < 12) return "Өглөөний мэнд"
  if (hour < 18) return "Өдрийн мэнд"
  return "Оройн мэнд"
}

export function getAcademicWeekLabel(value: Date) {
  const startOfYear = new Date(value.getFullYear(), 0, 1)
  const dayOffset = Math.floor((value.getTime() - startOfYear.getTime()) / 86400000)
  return `${Math.ceil((dayOffset + startOfYear.getDay() + 1) / 7)}-р долоо хоног`
}

export function getTeacherWeekDates(baseDate: Date) {
  const currentDay = baseDate.getDay()
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
  return teacherWeekDays.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return { date: formatIsoDate(date), day: day.full, shortDay: day.short, displayDate: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}` }
  })
}

export const getFilteredTeacherExams = (exams: Exam[], selectedClassId: string) => selectedClassId === "all" ? exams : exams.filter((exam) => exam.scheduledClasses.some((schedule) => schedule.classId === selectedClassId))

const dashboardMockAverageByClass: Record<string, number> = {
  all: 84,
  "10A": 85,
  "10B": 79,
  "10C": 88,
}

const dashboardMockAverageTrendByClass: Record<string, number[]> = {
  all: [80, 82, 83, 84, 84, 85, 84],
  "10A": [81, 83, 84, 85, 85, 86, 85],
  "10B": [74, 76, 77, 79, 79, 80, 79],
  "10C": [83, 85, 86, 88, 88, 89, 88],
}

export function buildTeacherDashboardMetrics(args: { classes: Class[]; exams: Exam[]; results: ExamResult[]; selectedClassId: string }) {
  const { classes, exams, results, selectedClassId } = args
  const filteredExams = getFilteredTeacherExams(exams, selectedClassId)
  const studentIds = new Set((selectedClassId === "all" ? classes.flatMap((item) => item.students) : classes.find((item) => item.id === selectedClassId)?.students ?? []).map((student) => student.id))
  const finishedExams = filteredExams.filter((exam) => exam.status === "completed")
  const filteredResults = results.filter((result) => studentIds.has(result.studentId))
  const averageTrend = finishedExams.slice(-7).map((exam) => {
    const examResults = filteredResults.filter((result) => result.examId === exam.id)
    const totalScore = examResults.reduce((sum, result) => sum + result.score, 0)
    const totalPossible = examResults.reduce((sum, result) => sum + result.totalPoints, 0)
    return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
  })
  const hasAverageData = averageTrend.some((value) => value > 0)
  const fallbackAverage = dashboardMockAverageByClass[selectedClassId] ?? dashboardMockAverageByClass.all
  const fallbackTrend = dashboardMockAverageTrendByClass[selectedClassId] ?? dashboardMockAverageTrendByClass.all

  return {
    averageScore: buildMetricCard("Дундаж оноо", hasAverageData ? averageTrend : fallbackTrend, hasAverageData ? undefined : fallbackAverage),
    totalExams: buildMetricCard("Нийт шалгалт", buildRecentDayCounts(filteredExams.map((exam) => exam.createdAt)), filteredExams.length),
    totalStudents: buildMetricCard("Нийт сурагчид", normalizeTrend(finishedExams.slice(-7).map((exam) => filteredResults.filter((result) => result.examId === exam.id).length)), studentIds.size),
  }
}

function buildRecentDayCounts(dateStrings: string[]) {
  const counts = new Map<string, number>()
  for (const date of dateStrings) counts.set(date, (counts.get(date) ?? 0) + 1)
  return normalizeTrend([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([, value]) => value))
}

function buildMetricCard(label: string, trend: number[], explicitValue?: number): MetricCardData {
  const normalized = normalizeTrend(trend)
  const current = explicitValue ?? normalized.at(-1) ?? 0
  const previous = normalized.at(-2) ?? current
  return { delta: previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0, label, trend: normalized, value: current }
}

function normalizeTrend(trend: number[]) {
  if (trend.length === 0) return [0, 0, 0, 0, 0, 0, 0]
  if (trend.length >= 7) return trend.slice(-7)
  return [...Array.from({ length: 7 - trend.length }, () => trend[0]), ...trend]
}
