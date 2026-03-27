import type { Exam, ExamResult } from "@/lib/mock-data"

export const questionTypeLabels = {
  "multiple-choice": "Сонгох",
  "true-false": "Үнэн/худал",
  "short-answer": "Богино хариулт",
  essay: "Эсээ",
} as const

export function getStudentExamSchedule(exam: Exam, studentClass: string) {
  return exam.scheduledClasses.find((entry) => entry.classId === studentClass) ?? exam.scheduledClasses[0]
}

export function getResultPercentage(result: ExamResult) {
  return Math.round((result.score / result.totalPoints) * 100)
}

export function getReportMetrics(exam: Exam, result: ExamResult) {
  const correctCount = result.answers.filter((entry) => entry.isCorrect).length
  const wrongCount = result.answers.length - correctCount

  return {
    totalQuestions: exam.questions.length,
    correctCount,
    wrongCount,
    unansweredCount: Math.max(exam.questions.length - result.answers.length, 0),
    percentage: getResultPercentage(result),
  }
}

export function getExamLetterGrade(percentage: number) {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "B+"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  return "F"
}

export function getStudentInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
