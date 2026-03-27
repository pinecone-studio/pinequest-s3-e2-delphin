'use client'

import { requestBackendJson } from '@/lib/backend-fetch'
import { examResults, type ExamResult } from '@/lib/mock-data'

const STUDENT_EXAM_RESULTS_STORAGE_KEY = 'studentExamResults'

type StudentExamResultApiRecord = {
  id: string
  examId: string
  studentId: string
  studentName: string
  classId: string
  answers: ExamResult['answers']
  score: number
  totalPoints: number
  status: 'submitted'
  submittedAt: string
  createdAt: string
  updatedAt: string
}

type SubmitStudentExamResultPayload = {
  examId: string
  studentId: string
  studentName: string
  classId: string
  answers: ExamResult['answers']
  score: number
  totalPoints: number
  submittedAt: string
}

function mergeResults(baseResults: ExamResult[], nextResults: ExamResult[]) {
  const merged = [...baseResults]

  nextResults.forEach((result) => {
    const existingIndex = merged.findIndex(
      (entry) => entry.examId === result.examId && entry.studentId === result.studentId,
    )

    if (existingIndex >= 0) {
      merged[existingIndex] = result
      return
    }

    merged.push(result)
  })

  return merged.sort(
    (left, right) =>
      new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  )
}

function readStoredResults() {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(STUDENT_EXAM_RESULTS_STORAGE_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? (parsed as ExamResult[]) : []
  } catch {
    return []
  }
}

function writeStoredResults(results: ExamResult[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STUDENT_EXAM_RESULTS_STORAGE_KEY, JSON.stringify(results))
}

function toExamResult(record: StudentExamResultApiRecord): ExamResult {
  return {
    examId: record.examId,
    studentId: record.studentId,
    classId: record.classId,
    score: record.score,
    totalPoints: record.totalPoints,
    answers: record.answers,
    submittedAt: record.submittedAt,
  }
}

export function getCachedStudentExamResults() {
  return mergeResults(examResults, readStoredResults())
}

function filterResults(
  results: ExamResult[],
  filters?: {
    examId?: string
    studentId?: string
    classId?: string
  },
) {
  return results.filter((result) => {
    if (filters?.examId && result.examId !== filters.examId) {
      return false
    }

    if (filters?.studentId && result.studentId !== filters.studentId) {
      return false
    }

    if (filters?.classId && result.classId !== filters.classId) {
      return false
    }

    return true
  })
}

export async function loadStudentExamResults(filters?: {
  examId?: string
  studentId?: string
  classId?: string
}) {
  try {
    const searchParams = new URLSearchParams()

    if (filters?.examId) searchParams.set('examId', filters.examId)
    if (filters?.studentId) searchParams.set('studentId', filters.studentId)
    if (filters?.classId) searchParams.set('classId', filters.classId)

    const query = searchParams.toString()
    const records = await requestBackendJson<StudentExamResultApiRecord[]>(
      `/student-exam-results${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        fallbackMessage:
          'Оюутны шалгалтын дүнг backend-ээс уншиж чадсангүй. Cloudflare D1 одоогоор боломжгүй эсвэл миграци дутуу байж магадгүй.',
      },
    )

    const mergedResults = mergeResults(
      examResults,
      mergeResults(readStoredResults(), records.map(toExamResult)),
    )
    writeStoredResults(mergedResults)
    return filterResults(mergedResults, filters)
  } catch {
    return filterResults(getCachedStudentExamResults(), filters)
  }
}

export async function submitStudentExamResult(payload: SubmitStudentExamResultPayload) {
  const optimisticResult: ExamResult = {
    examId: payload.examId,
    studentId: payload.studentId,
    classId: payload.classId,
    score: payload.score,
    totalPoints: payload.totalPoints,
    answers: payload.answers,
    submittedAt: payload.submittedAt,
  }

  writeStoredResults(mergeResults(readStoredResults(), [optimisticResult]))

  try {
    const record = await requestBackendJson<StudentExamResultApiRecord>(
      '/student-exam-results',
      {
        method: 'POST',
        body: payload,
        fallbackMessage:
          'Шалгалтын дүнг backend дээр хадгалж чадсангүй. Cloudflare D1 одоогоор бичих боломжгүй эсвэл `student_exam_results` хүснэгт үүсээгүй байж магадгүй.',
      },
    )

    const savedResult = toExamResult(record)
    writeStoredResults(mergeResults(readStoredResults(), [savedResult]))
    return savedResult
  } catch {
    return optimisticResult
  }
}
