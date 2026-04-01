import type { ExamResult, Student } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"

function getStudentLineColor(index: number, total: number) {
  const lightness = 22 + Math.round((index / Math.max(total, 1)) * 46)
  return `hsl(220 8% ${lightness}%)`
}

export function getSemesterLabel(date: string) {
  const [yearString, monthString] = date.split("-")
  const year = Number(yearString)
  const month = Number(monthString)
  const semester = month >= 1 && month <= 6 ? 1 : 2
  return `${semester}-р улирал ${year}`
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

  const awardedPoints =
    typeof answer.awardedPoints === "number"
      ? answer.awardedPoints
      : answer.isCorrect
        ? question.points
        : 0

  return Math.round((awardedPoints / question.points) * 100)
}

export function buildClassScoreChart(
  exam: TeacherExam,
  results: ExamResult[],
  students: Student[],
) {
  const studentMap = new Map(students.map((student) => [student.id, student]))
  const relevantResults = results.filter((result) => studentMap.has(result.studentId))

  const chartData = exam.questions.map((question, index) => {
    const row: Record<string, number | string | null> = {
      label: `${index + 1}-р асуулт`,
      questionLabel: `${index + 1}-р асуулт · ${question.points} оноо`,
    }

    relevantResults.forEach((result) => {
      row[result.studentId] = getQuestionAnswerPercent(exam, result, question.id)
    })

    return row
  })

  const chartLines = relevantResults.map((result, index) => ({
    color: getStudentLineColor(index, relevantResults.length),
    dataKey: result.studentId,
    name: studentMap.get(result.studentId)?.name ?? `Сурагч ${index + 1}`,
  }))

  return { chartData, chartLines }
}
