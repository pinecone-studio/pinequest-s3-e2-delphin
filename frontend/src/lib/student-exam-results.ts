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

export { getCachedStudentExamResults }

function buildResultKey(result: Pick<ExamResult, 'examId' | 'studentId'>) {
  return `${result.examId}::${result.studentId}`
}

function matchesFilters(
  result: Pick<ExamResult, 'examId' | 'studentId' | 'classId'>,
  filters?: {
    examId?: string
    studentId?: string
    classId?: string
  },
) {
  if (filters?.examId && result.examId !== filters.examId) return false
  if (filters?.studentId && result.studentId !== filters.studentId) return false
  if (filters?.classId && result.classId !== filters.classId) return false
  return true
}

export function getLatestStudentExamResults(results: ExamResult[]) {
  const resultMap = new Map<string, ExamResult>()

  results
    .slice()
    .sort(
      (left, right) =>
        new Date(right.submittedAt).getTime() -
        new Date(left.submittedAt).getTime(),
    )
    .forEach((result) => {
      const key = buildResultKey(result)
      if (!resultMap.has(key)) {
        resultMap.set(key, result)
      }
    })

  return Array.from(resultMap.values())
}

export function getLatestStudentExamResult(
  results: ExamResult[],
  examId: string,
  studentId: string,
) {
  return getLatestStudentExamResults(results).find(
    (result) => result.examId === examId && result.studentId === studentId,
  )
}

function mergeWithAuthoritativeResults(
  cachedResults: ExamResult[],
  authoritativeResults: ExamResult[],
) {
  const authoritativeKeys = new Set(
    authoritativeResults.map((result) => buildResultKey(result)),
  )

  return mergeResults(
    cachedResults.filter((result) => !authoritativeKeys.has(buildResultKey(result))),
    authoritativeResults,
  )
}

function replaceResultsInScope(
  cachedResults: ExamResult[],
  authoritativeResults: ExamResult[],
  filters?: {
    examId?: string
    studentId?: string
    classId?: string
  },
) {
  return mergeResults(
    cachedResults.filter((result) => !matchesFilters(result, filters)),
    authoritativeResults,
  )
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
      { method: 'GET', fallbackMessage: 'Шалгалтын дүнг backend-ээс уншиж чадсангүй.' },
    )
    const fetchedResults = records.map(toExamResult)
    const nextStoredResults =
      filters && (filters.examId || filters.studentId || filters.classId)
        ? replaceResultsInScope(getCachedStudentExamResults(), fetchedResults, filters)
        : mergeWithAuthoritativeResults(getCachedStudentExamResults(), fetchedResults)
    writeStoredResults(nextStoredResults)
    return filterResults(nextStoredResults, filters)
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
    writeStoredResults(mergeWithAuthoritativeResults(readStoredResults(), [savedResult]))
    return savedResult
  } catch {
    return optimisticResult
  }
}
