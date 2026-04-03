import type { Exam } from "@/lib/mock-data"
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts"
import { gradeStudentExamResult } from "@/lib/student-exam-results"

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
  const answeredCount = Object.values(answers).filter((answer) => answer.trim().length > 0).length

  await gradeStudentExamResult({
    examId: exam.id,
    studentId,
    studentName,
    classId: studentClass,
    answers,
    submittedAt,
  })

  await upsertStudentExamAttempt({
    examId: exam.id,
    studentId,
    studentName,
    classId: studentClass,
    status: "submitted",
    answers,
    currentQuestion,
    answeredCount,
    startedAt: submittedAt,
    submittedAt,
  })
}
