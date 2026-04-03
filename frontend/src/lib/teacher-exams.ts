import { fetchBackendJson } from '@/lib/backend-fetch'
import type { CreatedExam } from '@/lib/exams-api'
import type { Exam as LegacyExam } from '@/lib/mock-data-types'
import { teacherLegacyMockExams } from '@/lib/teacher-legacy-mock-exams'

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
    iconKey?: CreatedExam['questions'][number]['iconKey']
    sourceQuestionId?: string
    categoryName?: string
    topicName?: string
    difficulty?: 'easy' | 'medium' | 'hard'
  }>
  scheduledClasses: Array<{
    classId: string
    date: string
    time: string
  }>
}

function getDerivedTeacherExamStatus(args: {
  duration: number
  scheduledClasses: Array<{ date: string; time: string }>
  status: TeacherExam['status']
  now?: Date
}): TeacherExam['status'] {
  const { duration, now = new Date(), scheduledClasses, status } = args

  if (status !== 'scheduled') {
    return status
  }

  const latestScheduleEnd = scheduledClasses.reduce<number | null>((latest, schedule) => {
    const start = new Date(`${schedule.date}T${schedule.time}:00`)
    const startTime = start.getTime()

    if (Number.isNaN(startTime)) {
      return latest
    }

    const scheduleEnd = startTime + duration * 60 * 1000
    return latest === null || scheduleEnd > latest ? scheduleEnd : latest
  }, null)

  if (latestScheduleEnd !== null && latestScheduleEnd < now.getTime()) {
    return 'completed'
  }

  return status
}

function mapCreatedExamToTeacherExam(exam: CreatedExam): TeacherExam {
  const scheduledClasses = exam.schedules.map((schedule) => ({
    classId: schedule.classId,
    date: schedule.date,
    time: schedule.time,
  }))

  return {
    id: exam.id,
    title: exam.title,
    duration: exam.durationMinutes,
    status: getDerivedTeacherExamStatus({
      duration: exam.durationMinutes,
      scheduledClasses,
      status: exam.status,
    }),
    questions: exam.questions,
    scheduledClasses,
  }
}

export function mapLegacyExamToTeacherExam(exam: LegacyExam): TeacherExam {
  return {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    status: getDerivedTeacherExamStatus({
      duration: exam.duration,
      scheduledClasses: exam.scheduledClasses,
      status: exam.status,
    }),
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
  return teacherLegacyMockExams.map(mapLegacyExamToTeacherExam)
}
