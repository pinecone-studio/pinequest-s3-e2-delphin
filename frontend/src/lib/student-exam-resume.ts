'use client'

import { loadStudentExamAttempts } from '@/lib/student-exam-attempts'
import { loadStudentExamResults } from '@/lib/student-exam-results'
import { isScheduleOpenNow } from '@/lib/student-exam-time'
import { getStudentExams } from '@/lib/student-exams'

export async function findResumableExamPath(props: {
  studentClass: string
  studentId: string
}) {
  const { studentClass, studentId } = props
  if (!studentClass || !studentId) return null

  try {
    const [attempts, exams, results] = await Promise.all([
      loadStudentExamAttempts({ studentId }),
      getStudentExams(),
      loadStudentExamResults({ studentId }),
    ])
    const submittedExamIds = new Set(results.map((result) => result.examId))
    const resumable = attempts
      .filter((attempt) =>
        attempt.classId === studentClass &&
        attempt.status !== 'submitted' &&
        !submittedExamIds.has(attempt.examId),
      )
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .find((attempt) => {
        const exam = exams.find((entry) => entry.id === attempt.examId)
        const schedule = exam?.scheduledClasses.find((entry) => entry.classId === studentClass)
        return Boolean(exam && schedule && isScheduleOpenNow(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely))
      })
    return resumable ? `/student/exams/${resumable.examId}/take` : null
  } catch {
    return null
  }
}
