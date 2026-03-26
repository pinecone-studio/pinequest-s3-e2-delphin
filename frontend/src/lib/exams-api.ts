import type { NewQuestion, ScheduleEntry } from '@/components/teacher/exam-builder-types'
import { getBrowserApiBaseUrl } from '@/lib/api-base-url'
import { classes } from '@/lib/mock-data'

export const ALL_CLASSES_OPTION = '__all_classes__'

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
  return getBrowserApiBaseUrl()
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
  const expandedSchedules = scheduleEntries
    .filter((entry) => entry.classId || entry.date || entry.time)
    .flatMap((entry) => {
      const classId = entry.classId.trim()
      const date = entry.date.trim()
      const time = entry.time.trim()

      if (classId !== ALL_CLASSES_OPTION) {
        return [{ classId, date, time }]
      }

      return classes.map((classEntry) => ({
        classId: classEntry.id,
        date,
        time,
      }))
    })

  const seenScheduleKeys = new Set<string>()
  const dedupedSchedules = expandedSchedules.filter((entry) => {
    const scheduleKey = `${entry.classId}::${entry.date}::${entry.time}`
    if (seenScheduleKeys.has(scheduleKey)) {
      return false
    }

    seenScheduleKeys.add(scheduleKey)
    return true
  })

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
    schedules: dedupedSchedules,
  }
}

export async function createExam(payload: CreateExamPayload): Promise<CreatedExam> {
  return requestExam(`${getApiBaseUrl()}/exams`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getExam(id: string): Promise<CreatedExam> {
  return requestExam(`${getApiBaseUrl()}/exams/${id}`, {
    method: 'GET',
  })
}

export async function updateExam(id: string, payload: CreateExamPayload): Promise<CreatedExam> {
  return requestExam(`${getApiBaseUrl()}/exams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteExam(id: string): Promise<CreatedExam> {
  return requestExam(`${getApiBaseUrl()}/exams/${id}`, {
    method: 'DELETE',
  })
}

async function requestExam(url: string, init: RequestInit): Promise<CreatedExam> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
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
