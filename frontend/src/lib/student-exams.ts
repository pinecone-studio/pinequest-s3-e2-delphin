import {
  exams as legacyExams,
  type Exam as LegacyExam,
} from '@/lib/mock-data'
import { getServerApiBaseUrl } from '@/lib/api-base-url'
import type { CreatedExam } from '@/lib/exams-api'

function mapCreatedExamToStudentExam(exam: CreatedExam): LegacyExam {
  return {
    id: exam.id,
    title: exam.title,
    questions: exam.questions.map((question) => ({
      id: question.id,
      type: question.type,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      points: question.points,
    })),
    duration: exam.durationMinutes,
    reportReleaseMode: exam.reportReleaseMode,
    scheduledClasses: exam.schedules.map((schedule) => ({
      classId: schedule.classId,
      date: schedule.date,
      time: schedule.time,
    })),
    createdAt: exam.createdAt,
    status: exam.status,
  }
}

export async function getStudentExams(): Promise<LegacyExam[]> {
  const response = await fetch(`${getServerApiBaseUrl()}/exams`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to load exams from the backend.')
  }

  const backendExams = (await response.json()) as CreatedExam[]
  const mergedExams = [...legacyExams, ...backendExams.map(mapCreatedExamToStudentExam)]

  return mergedExams.filter(
    (exam, index, collection) => collection.findIndex((entry) => entry.id === exam.id) === index,
  )
}

function getScheduleEndTime(date: string, time: string, duration: number) {
  const start = new Date(`${date}T${time}:00`)
  return new Date(start.getTime() + duration * 60 * 1000)
}

export function getStudentExamReportReleaseDate(exam: LegacyExam) {
  if (exam.reportReleaseMode === 'immediately') {
    return null
  }

  return exam.scheduledClasses.reduce<Date | null>((latest, schedule) => {
    const endTime = getScheduleEndTime(schedule.date, schedule.time, exam.duration)
    if (!latest || endTime > latest) {
      return endTime
    }
    return latest
  }, null)
}

export function isStudentExamReportAvailable(exam: LegacyExam) {
  if (exam.reportReleaseMode === 'immediately') {
    return true
  }

  const releaseDate = getStudentExamReportReleaseDate(exam)
  if (!releaseDate) {
    return false
  }

  return new Date() >= releaseDate
}
