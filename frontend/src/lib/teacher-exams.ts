import { exams as legacyExams } from '@/lib/mock-data'
import { fetchBackendJson } from '@/lib/backend-fetch'
import type { CreatedExam } from '@/lib/exams-api'

export type TeacherExam = {
  id: string
  title: string
  duration: number
  status: 'draft' | 'scheduled' | 'completed'
  questions: Array<{
    id: string
    type: CreatedExam['questions'][number]['type']
    question: string
    options?: string[]
    correctAnswer?: string
    points: number
    order: number
  }>
  scheduledClasses: Array<{
    classId: string
    date: string
    time: string
  }>
}

function mapCreatedExamToTeacherExam(exam: CreatedExam): TeacherExam {
  return {
    id: exam.id,
    title: exam.title,
    duration: exam.durationMinutes,
    status: exam.status,
    questions: exam.questions,
    scheduledClasses: exam.schedules.map((schedule) => ({
      classId: schedule.classId,
      date: schedule.date,
      time: schedule.time,
    })),
  }
}

function mapLegacyExamToTeacherExam(exam: (typeof legacyExams)[number]): TeacherExam {
  return {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    status: exam.status,
    questions: exam.questions.map((question, index) => ({
      ...question,
      order: index + 1,
    })),
    scheduledClasses: exam.scheduledClasses,
  }
}

export async function getTeacherExams(): Promise<TeacherExam[]> {
  const exams = await fetchBackendJson<CreatedExam[]>(
    '/exams',
    'Failed to load exams from the backend.',
  )
  return exams.map(mapCreatedExamToTeacherExam)
}

export function getLegacyTeacherExams(): TeacherExam[] {
  return legacyExams.map(mapLegacyExamToTeacherExam)
}
