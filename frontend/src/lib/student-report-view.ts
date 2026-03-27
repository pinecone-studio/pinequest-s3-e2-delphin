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

export function isManualReviewQuestionType(type: Exam["questions"][number]["type"]) {
  return type === "short-answer" || type === "essay"
}

export function getAnswerReviewState(
  question: Exam["questions"][number],
  answer: ExamResult["answers"][number] | undefined,
) {
  const hasAnswer = Boolean(answer?.answer?.trim())

  if (!hasAnswer) {
    return "unanswered" as const
  }

  if (isManualReviewQuestionType(question.type)) {
    return answer?.reviewStatus === "graded" ||
      typeof answer?.awardedPoints === "number" ||
      typeof answer?.isCorrect === "boolean"
      ? "graded"
      : "pending"
  }

  return answer?.isCorrect ? "correct" : "wrong"
}

export function getReportMetrics(exam: Exam, result: ExamResult) {
  const answerMap = new Map(result.answers.map((entry) => [entry.questionId, entry]))
  let correctCount = 0
  let wrongCount = 0
  let unansweredCount = 0
  let pendingReviewCount = 0

  exam.questions.forEach((question) => {
    const answer = answerMap.get(question.id)

    const reviewState = getAnswerReviewState(question, answer)

    if (reviewState === "unanswered") {
      unansweredCount += 1
      return
    }

    if (reviewState === "pending") {
      pendingReviewCount += 1
      return
    }

    if (reviewState === "graded") {
      return
    }

    if (reviewState === "correct") {
      correctCount += 1
      return
    }

    wrongCount += 1
  })

  return {
    totalQuestions: exam.questions.length,
    correctCount,
    wrongCount,
    unansweredCount,
    pendingReviewCount,
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
