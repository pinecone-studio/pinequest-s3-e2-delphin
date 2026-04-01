import type { Class, ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import { getExamAverage } from "@/lib/teacher-class-detail"

export function buildClassOverviewMetrics(args: {
  classData: Class
  exams: TeacherExam[]
  results: ExamResult[]
}) {
  const { classData, exams, results } = args
  const averageTrend = normalizeTrend(
    exams.map((exam) => {
      const examResults = results.filter((result) => result.examId === exam.id)
      return getExamAverage(examResults)
    }),
  )
  const examTrend = normalizeTrend(exams.map((_, index) => index + 1))
  const studentTrend = normalizeTrend(
    exams.map((exam) => results.filter((result) => result.examId === exam.id).length),
  )

  return [
    buildMetricPresentation("Дундаж оноо", averageTrend, getExamAverage(results), "#ff8fcf"),
    buildMetricPresentation("Нийт шалгалт", examTrend, exams.length, "#64d2ff"),
    buildMetricPresentation("Нийт сурагчид", studentTrend, classData.students.length, "#ae89ff"),
  ]
}

export function buildExamInsightCards(exam: TeacherExam | null, results: ExamResult[]) {
  if (!exam) {
    return [
      createInsightCard("Хөнгөн", "0", "0%", "text-[#8b96ad]", "#d0d98a", [0, 0, 0, 0, 0]),
      createInsightCard("Дунд", "0", "0%", "text-[#8b96ad]", "#a6b8f2", [0, 0, 0, 0, 0]),
      createInsightCard("Хүнд", "0", "0%", "text-[#8b96ad]", "#e3c5cf", [0, 0, 0, 0, 0]),
    ]
  }

  const groupedQuestions = {
    easy: exam.questions.filter((question) => getQuestionDifficulty(question.points) === "easy"),
    standard: exam.questions.filter(
      (question) => getQuestionDifficulty(question.points) === "standard",
    ),
    hard: exam.questions.filter((question) => getQuestionDifficulty(question.points) === "hard"),
  }

  return [
    buildDifficultyInsightCard("Хөнгөн", groupedQuestions.easy, results, "#d0d98a"),
    buildDifficultyInsightCard("Дунд", groupedQuestions.standard, results, "#a6b8f2"),
    buildDifficultyInsightCard("Хүнд", groupedQuestions.hard, results, "#e3c5cf"),
  ]
}

export function formatExamMeta(exam: TeacherExam | null, classId: string) {
  const schedule = exam?.scheduledClasses.find((entry) => entry.classId === classId)
  return {
    date: schedule?.date ?? "2026.04.03",
    time: schedule?.time ?? "14:00",
  }
}

function buildMetricPresentation(label: string, trend: number[], value: number, stroke: string) {
  const normalized = normalizeTrend(trend)
  const current = value || normalized.at(-1) || 0
  const previous = normalized.at(-2) ?? current
  const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0
  return {
    delta: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`,
    deltaClassName: delta >= 0 ? "text-[#66c59a]" : "text-[#f08ab4]",
    deltaColor: delta >= 0 ? "#24b982" : "#f16aa1",
    icon:
      label === "Нийт сурагчид"
        ? "/teacher-metric-student.svg"
        : "/teacher-metric-a-plus.svg",
    label,
    stroke,
    trend: normalized,
    value: `${current}`,
  }
}

function buildDifficultyInsightCard(
  label: string,
  questions: TeacherExam["questions"],
  results: ExamResult[],
  stroke: string,
) {
  if (questions.length === 0 || results.length === 0) {
    return createInsightCard(label, "0", "0%", "text-[#8b96ad]", stroke, [0, 0, 0, 0, 0])
  }

  const questionIds = new Set(questions.map((question) => question.id))
  const allAnswers = results.flatMap((result) =>
    result.answers.filter((answer) => questionIds.has(answer.questionId)),
  )
  const correctAnswers = allAnswers.filter((answer) => answer.isCorrect === true)
  const percentage =
    allAnswers.length > 0
      ? Math.round((correctAnswers.length / allAnswers.length) * 100)
      : 0
  const trend = questions.map((question) => {
    const answers = results
      .map((result) => result.answers.find((answer) => answer.questionId === question.id))
      .filter(Boolean)
    const correct = answers.filter((answer) => answer?.isCorrect === true).length
    return answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0
  })

  return createInsightCard(
    label,
    `${correctAnswers.length}`,
    `${percentage}%`,
    "text-[#8b96ad]",
    stroke,
    trend,
  )
}

function createInsightCard(
  label: string,
  value: string,
  delta: string,
  deltaClassName: string,
  stroke: string,
  trend: number[],
) {
  return { delta, deltaClassName, label, stroke, trend: normalizeTrend(trend), value }
}

function getQuestionDifficulty(points: number) {
  if (points <= 5) return "easy"
  if (points <= 10) return "standard"
  return "hard"
}

function normalizeTrend(trend: number[]) {
  if (trend.length === 0) return [0, 0, 0, 0, 0]
  if (trend.length >= 5) return trend.slice(-5)
  return [...Array.from({ length: 5 - trend.length }, () => trend[0]), ...trend]
}
