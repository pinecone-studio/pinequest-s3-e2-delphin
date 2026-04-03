import type { Exam } from "@/lib/mock-data"
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts"
import { submitStudentExamResult } from "@/lib/student-exam-results"
import { getAwardedPoints, getReviewStatus, gradeQuestion } from "@/lib/student-exam-submission"

export async function submitStudentExam(props: {
  exam: Exam
  answers: Record<string, string>
  currentQuestion: number
  studentId: string
  studentName: string
  studentClass: string
}) {
  const { exam, answers, currentQuestion, studentId, studentName, studentClass } = props
  const submittedAt = new Date().toISOString()
  const scoredAnswers = exam.questions.map((question) => {
    const answer = answers[question.id] ?? ""
    const isCorrect = gradeQuestion(question, answer)
    return {
      questionId: question.id,
      answer,
      isCorrect,
      awardedPoints: getAwardedPoints(question, answer, isCorrect),
      reviewStatus: getReviewStatus(question, answer, isCorrect),
    }
  })
  const score = exam.questions.reduce((sum, question) => {
    const matchedAnswer = scoredAnswers.find((entry) => entry.questionId === question.id)
    return sum + (matchedAnswer?.awardedPoints ?? 0)
  }, 0)
  const totalPoints = exam.questions.reduce((sum, question) => sum + question.points, 0)

  await submitStudentExamResult({
    examId: exam.id,
    studentId,
    studentName,
    classId: studentClass,
    answers: scoredAnswers,
    score,
    totalPoints,
    submittedAt,
  })

  await upsertStudentExamAttempt({
    examId: exam.id,
    studentId,
    studentName,
    classId: studentClass,
    status: "submitted",
    currentQuestion,
    answeredCount: scoredAnswers.filter((entry) => entry.answer.trim().length > 0).length,
    startedAt: submittedAt,
    submittedAt,
  })
}
