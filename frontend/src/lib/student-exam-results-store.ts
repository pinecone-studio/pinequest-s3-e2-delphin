import { examResults, type ExamResult } from '@/lib/mock-data'

const STUDENT_EXAM_RESULTS_STORAGE_KEY = 'studentExamResults'

export type StudentExamResultApiRecord = {
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

function mergeExamResultAnswers(
  baseAnswers: ExamResult['answers'],
  nextAnswers: ExamResult['answers'],
) {
  const merged = new Map(baseAnswers.map((answer) => [answer.questionId, answer]))
  nextAnswers.forEach((answer) => {
    const current = merged.get(answer.questionId)
    merged.set(answer.questionId, current ? { ...current, ...answer } : answer)
  })
  return Array.from(merged.values())
}

function sumAwardedPoints(answers: ExamResult['answers']) {
  return answers.reduce((sum, answer) => sum + (typeof answer.awardedPoints === 'number' ? answer.awardedPoints : 0), 0)
}

function mergeExamResult(baseResult: ExamResult, nextResult: ExamResult): ExamResult {
  const answers = mergeExamResultAnswers(baseResult.answers, nextResult.answers)
  return {
    examId: nextResult.examId,
    studentId: nextResult.studentId,
    classId: nextResult.classId ?? baseResult.classId,
    score: Math.max(baseResult.score, nextResult.score, sumAwardedPoints(answers)),
    totalPoints: Math.max(baseResult.totalPoints, nextResult.totalPoints),
    answers,
    submittedAt: new Date(nextResult.submittedAt) > new Date(baseResult.submittedAt)
      ? nextResult.submittedAt
      : baseResult.submittedAt,
  }
}

export function mergeResults(baseResults: ExamResult[], nextResults: ExamResult[]) {
  const merged = [...baseResults]
  nextResults.forEach((result) => {
    const existingIndex = merged.findIndex(
      (entry) => entry.examId === result.examId && entry.studentId === result.studentId,
    )
    if (existingIndex >= 0) merged[existingIndex] = mergeExamResult(merged[existingIndex], result)
    else merged.push(result)
  })
  return merged.sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())
}

export function readStoredResults() {
  if (typeof window === 'undefined') return []
  const rawValue = window.localStorage.getItem(STUDENT_EXAM_RESULTS_STORAGE_KEY)
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? (parsed as ExamResult[]) : []
  } catch {
    return []
  }
}

export function writeStoredResults(results: ExamResult[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STUDENT_EXAM_RESULTS_STORAGE_KEY, JSON.stringify(results))
  }
}

export function toExamResult(record: StudentExamResultApiRecord): ExamResult {
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

export function filterResults(results: ExamResult[], filters?: { examId?: string; studentId?: string; classId?: string }) {
  return results.filter((result) => {
    if (filters?.examId && result.examId !== filters.examId) return false
    if (filters?.studentId && result.studentId !== filters.studentId) return false
    if (filters?.classId && result.classId !== filters.classId) return false
    return true
  })
}
