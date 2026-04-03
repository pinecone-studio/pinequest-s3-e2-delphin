'use client'

import type { ExamResult } from '@/lib/mock-data'
import { requestBackendJson } from '@/lib/backend-fetch'
import {
  filterResults,
  getCachedStudentExamResults,
  mergeResults,
  readStoredResults,
  toExamResult,
  type StudentExamResultApiRecord,
  writeStoredResults,
} from '@/lib/student-exam-results-store'

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

type GradeStudentExamResultPayload = {
  answers: Record<string, string>
  classId: string
  examId: string
  studentId: string
  studentName: string
  submittedAt: string
}

export { getCachedStudentExamResults }

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
      { method: 'GET', fallbackMessage: 'Шалгалтын дүнг backend-ээс уншиж чадсангүй.' },
    )
    const mergedResults = mergeResults(getCachedStudentExamResults(), records.map(toExamResult))
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
    const record = await requestBackendJson<StudentExamResultApiRecord>('/student-exam-results', {
      method: 'POST',
      body: payload,
      fallbackMessage: 'Шалгалтын дүнг backend дээр хадгалж чадсангүй.',
    })
    const savedResult = toExamResult(record)
    writeStoredResults(mergeResults(readStoredResults(), [savedResult]))
    return savedResult
  } catch {
    return optimisticResult
  }
}

export async function gradeStudentExamResult(payload: GradeStudentExamResultPayload) {
  const record = await requestBackendJson<StudentExamResultApiRecord>('/student-exam-results/grade', {
    method: 'POST',
    body: payload,
    timeoutMs: 45_000,
    fallbackMessage: 'Шалгалтын AI үнэлгээтэй дүнг backend дээр хадгалж чадсангүй.',
  })
  const savedResult = toExamResult(record)
  writeStoredResults(mergeResults(readStoredResults(), [savedResult]))
  return savedResult
}
