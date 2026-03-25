import type { NewQuestion, ScheduleEntry } from '@/components/teacher/exam-builder-types'

type ExamStatus = 'draft' | 'scheduled'

type CreateExamPayload = {
  title: string
  durationMinutes: number
  reportReleaseMode: 'after-all-classes-complete' | 'immediately'
  status: ExamStatus
  questions: Array<{
    type: NewQuestion['type']
    question: string
    options?: string[]
    correctAnswer?: string
    points: number
    order: number
  }>
  schedules: Array<{
    classId: string
    date: string
    time: string
  }>
}

export type CreatedExam = {
  id: string
  title: string
  durationMinutes: number
  reportReleaseMode: 'after-all-classes-complete' | 'immediately'
  status: 'draft' | 'scheduled' | 'completed'
  createdAt: string
  updatedAt: string
  questions: Array<{
    id: string
    type: NewQuestion['type']
    question: string
    options?: string[]
    correctAnswer?: string
    points: number
    order: number
  }>
  schedules: Array<{
    id: string
    classId: string
    date: string
    time: string
  }>
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/g, '') ?? 'http://localhost:3001/api'
}

export function buildCreateExamPayload({
  duration,
  examTitle,
  questions,
  reportReleaseMode,
  scheduleEntries,
  status,
}: {
  duration: number
  examTitle: string
  questions: NewQuestion[]
  reportReleaseMode: 'after-all-classes-complete' | 'immediately'
  scheduleEntries: ScheduleEntry[]
  status: ExamStatus
}): CreateExamPayload {
  return {
    title: examTitle.trim(),
    durationMinutes: duration,
    reportReleaseMode,
    status,
    questions: questions.map((question, index) => ({
      type: question.type,
      question: question.question.trim(),
      options: question.options?.map((option) => option.trim()),
      correctAnswer: question.correctAnswer?.trim(),
      points: question.points,
      order: index + 1,
    })),
    schedules: scheduleEntries
      .filter((entry) => entry.classId || entry.date || entry.time)
      .map((entry) => ({
        classId: entry.classId.trim(),
        date: entry.date.trim(),
        time: entry.time.trim(),
      })),
  }
}

export async function createExam(payload: CreateExamPayload): Promise<CreatedExam> {
  const response = await fetch(`${getApiBaseUrl()}/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = 'Failed to create exam.'

    try {
      const data = (await response.json()) as { message?: string | string[] }
      if (Array.isArray(data.message)) {
        message = data.message.join(' ')
      } else if (data.message) {
        message = data.message
      }
    } catch {
      // Keep the fallback message when the response body is not JSON.
    }

    throw new Error(message)
  }

  return (await response.json()) as CreatedExam
}
