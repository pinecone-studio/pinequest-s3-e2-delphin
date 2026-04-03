import {
  exams as legacyExams,
  type Exam as LegacyExam,
} from '@/lib/mock-data'
import { fetchBackendJson } from '@/lib/backend-fetch'
import type { CreatedExam } from '@/lib/exams-api'

const bannedTitlePatterns = [
  /^test$/i,
  /^monitor$/i,
  /test to see if i return back to the exam/i,
  /tab block test2/i,
]

function isAllowedExamTitle(title: string) {
  return !bannedTitlePatterns.some((pattern) => pattern.test(title))
}

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
      iconKey: question.iconKey,
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

export async function getStudentExams(studentClass?: string): Promise<LegacyExam[]> {
  void studentClass
  const backendExams = await fetchBackendJson<CreatedExam[]>(
    '/exams',
    'Шалгалтын мэдээллийг backend-ээс уншиж чадсангүй. Cloudflare D1 эсвэл backend үйлчилгээ одоогоор асуудалтай байж магадгүй.',
  )
  const mergedExams = [...legacyExams, ...backendExams.map(mapCreatedExamToStudentExam)].filter(
    (exam) => isAllowedExamTitle(exam.title),
  )

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
