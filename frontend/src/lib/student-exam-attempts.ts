'use client'

import { requestBackendJson } from '@/lib/backend-fetch'

export type StudentExamAttemptStatus =
  | 'in_progress'
  | 'submitted'
  | 'tab_switched'
  | 'app_switched'

export type StudentExamAttempt = {
  id: string
  examId: string
  studentId: string
  studentName: string
  classId: string
  status: StudentExamAttemptStatus
  answers?: Record<string, string>
  currentQuestion?: number
  startedAt: string
  submittedAt?: string | null
  createdAt: string
  updatedAt: string
}

type UpsertStudentExamAttemptPayload = Omit<
  StudentExamAttempt,
  'id' | 'createdAt' | 'updatedAt'
>

const STUDENT_EXAM_ATTEMPTS_STORAGE_KEY = 'studentExamAttempts'

function readStoredAttempts() {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(STUDENT_EXAM_ATTEMPTS_STORAGE_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? (parsed as StudentExamAttempt[]) : []
  } catch {
    return []
  }
}

function writeStoredAttempts(attempts: StudentExamAttempt[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STUDENT_EXAM_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts))
}

function mergeAttempts(baseAttempts: StudentExamAttempt[], nextAttempts: StudentExamAttempt[]) {
  const merged = [...baseAttempts]

  nextAttempts.forEach((attempt) => {
    const existingIndex = merged.findIndex((entry) =>
      entry.examId === attempt.examId && entry.studentId === attempt.studentId,
    )

    if (existingIndex >= 0) {
      merged[existingIndex] = attempt
      return
    }

    merged.push(attempt)
  })

  return merged.sort((left, right) =>
    new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
  )
}

function filterAttempts(
  attempts: StudentExamAttempt[],
  filters?: {
    examId?: string
    studentId?: string
    classId?: string
    status?: StudentExamAttemptStatus
  },
) {
  return attempts.filter((attempt) => {
    if (filters?.examId && attempt.examId !== filters.examId) {
      return false
    }

    if (filters?.studentId && attempt.studentId !== filters.studentId) {
      return false
    }

    if (filters?.classId && attempt.classId !== filters.classId) {
      return false
    }

    if (filters?.status && attempt.status !== filters.status) {
      return false
    }

    return true
  })
}

export function getCachedStudentExamAttempts() {
  return readStoredAttempts()
}

export async function loadStudentExamAttempts(filters?: {
  examId?: string
  studentId?: string
  classId?: string
  status?: StudentExamAttemptStatus
}) {
  try {
    const searchParams = new URLSearchParams()

    if (filters?.examId) searchParams.set('examId', filters.examId)
    if (filters?.studentId) searchParams.set('studentId', filters.studentId)
    if (filters?.classId) searchParams.set('classId', filters.classId)
    if (filters?.status) searchParams.set('status', filters.status)

    const query = searchParams.toString()
    const attempts = await requestBackendJson<StudentExamAttempt[]>(
      `/student-exam-attempts${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        fallbackMessage: 'Шалгалт эхэлсэн төлөвийг backend-ээс уншиж чадсангүй. Cloudflare D1 одоогоор боломжгүй эсвэл миграци дутуу байж магадгүй.',
      },
    )

    const mergedAttempts = mergeAttempts(readStoredAttempts(), attempts)
    writeStoredAttempts(mergedAttempts)
    return filterAttempts(mergedAttempts, filters)
  } catch {
    return filterAttempts(getCachedStudentExamAttempts(), filters)
  }
}

export async function upsertStudentExamAttempt(payload: UpsertStudentExamAttemptPayload) {
  const optimisticAttempt: StudentExamAttempt = {
    id: `${payload.examId}::${payload.studentId}`,
    ...payload,
    createdAt: payload.startedAt,
    updatedAt: new Date().toISOString(),
  }

  writeStoredAttempts(mergeAttempts(readStoredAttempts(), [optimisticAttempt]))

  try {
    const savedAttempt = await requestBackendJson<StudentExamAttempt>(
      '/student-exam-attempts',
      {
        method: 'POST',
        body: payload,
        fallbackMessage: 'Шалгалтын явцын төлөвийг backend дээр хадгалж чадсангүй. Cloudflare D1 одоогоор бичих боломжгүй эсвэл `student_exam_attempts` хүснэгт үүсээгүй байж магадгүй.',
      },
    )

    writeStoredAttempts(mergeAttempts(readStoredAttempts(), [savedAttempt]))
    return savedAttempt
  } catch {
    return optimisticAttempt
  }
}
