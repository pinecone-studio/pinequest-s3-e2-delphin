import type { ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"

export type ExamDifficultyBucket = "easy" | "medium" | "hard"

export function getSemesterLabel(date: string) {
  const [yearString, monthString] = date.split("-")
  const year = Number(yearString)
  const month = Number(monthString)
  const semester = month >= 1 && month <= 6 ? 1 : 2
  return `${semester}-р улирал ${year}`
}

const DEMO_CLASS_ID_MAP: Record<string, string> = {
  "7A": "10A",
  "7Б": "10B",
  "7В": "10C",
  "7A анги": "10A",
  "7Б анги": "10B",
  "7В анги": "10C",
}

export function normalizeDemoClassId(classId: string | null | undefined) {
  if (!classId) return ""
  return DEMO_CLASS_ID_MAP[classId] ?? classId
}

export function isMatchingDemoClassId(left: string | null | undefined, right: string | null | undefined) {
  return normalizeDemoClassId(left) === normalizeDemoClassId(right)
}

const DEMO_CLASS_LABEL_MAP: Record<string, string> = {
  "10A": "7A",
  "10B": "7Б",
  "10C": "7В",
}

const INVALID_EXAM_TITLES = new Set(["test", "сорил", "text"])

export function getDemoClassLabel(classId: string | null | undefined) {
  const normalized = normalizeDemoClassId(classId)
  return DEMO_CLASS_LABEL_MAP[normalized] ?? normalized
}

export function isTeacherExamValidForHistory(exam: TeacherExam) {
  const normalizedTitle = exam.title.trim().toLowerCase()
  const uniqueClassIds = new Set(
    exam.scheduledClasses.map((schedule) => normalizeDemoClassId(schedule.classId)),
  )
  const hasAllClasses = ["10A", "10B", "10C"].every((classId) => uniqueClassIds.has(classId))
  const hasEnoughQuestions = exam.questions.length >= 8
  const hasQuestionContent = exam.questions.every(
    (question) => question.question.trim() && question.difficulty,
  )

  return (
    normalizedTitle.length >= 4 &&
    !INVALID_EXAM_TITLES.has(normalizedTitle) &&
    hasAllClasses &&
    hasEnoughQuestions &&
    hasQuestionContent
  )
}

export function mergeTeacherExams(exams: TeacherExam[]) {
  return exams.filter(
    (exam, index, collection) =>
      collection.findIndex((entry) => entry.id === exam.id) === index,
  )
}

export function getExamTotalPoints(exam: TeacherExam) {
  return exam.questions.reduce((sum, question) => sum + question.points, 0)
}

export function getExamAverage(results: ExamResult[]) {
  if (results.length === 0) {
    return 0
  }

  return Math.round(
    results.reduce(
      (sum, result) => sum + (result.score / result.totalPoints) * 100,
      0,
    ) / results.length,
  )
}

export function getQuestionAnswerPercent(
  exam: TeacherExam,
  result: ExamResult,
  questionId: string,
) {
  const question = exam.questions.find((entry) => entry.id === questionId)
  const answer = result.answers.find((entry) => entry.questionId === questionId)
  if (!question || !answer) {
    return null
  }

  const awardedPoints = getAwardedPoints(question.points, answer)

  return Math.round((awardedPoints / question.points) * 100)
}

export function getAwardedPoints(
  questionPoints: number,
  answer:
    | ExamResult["answers"][number]
    | undefined,
) {
  if (!answer) {
    return 0
  }

  if (typeof answer.awardedPoints === "number") {
    return answer.awardedPoints
  }

  return answer.isCorrect ? questionPoints : 0
}

export function normalizeExamDifficulty(
  difficulty: string | null | undefined,
): ExamDifficultyBucket {
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") {
    return difficulty
  }

  if (difficulty === "standard") {
    return "medium"
  }

  return "medium"
}
