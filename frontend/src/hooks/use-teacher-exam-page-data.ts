"use client"

import { useEffect, useMemo, useState } from "react"
import type { Class, ExamResult } from "@/lib/mock-data"
import { loadStudentExamAttempts, type StudentExamAttempt } from "@/lib/student-exam-attempts"
import { loadStudentExamResults } from "@/lib/student-exam-results"
import { isMatchingDemoClassId } from "@/lib/teacher-class-detail"
import { getAnswerReviewState, isManualReviewQuestionType } from "@/lib/student-report-view"
import { getLegacyTeacherExams, getTeacherExams, type TeacherExam } from "@/lib/teacher-exams"

export function useTeacherExamPageData({
  classId,
  examId,
  classData,
}: {
  classId: string
  examId: string
  classData: Class | undefined
}) {
  const [allExams, setAllExams] = useState<TeacherExam[]>(() => getLegacyTeacherExams())
  const [results, setResults] = useState<ExamResult[]>([])
  const [attempts, setAttempts] = useState<StudentExamAttempt[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [draftScores, setDraftScores] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      try {
        const [backendExams, nextResults, nextAttempts] = await Promise.all([
          getTeacherExams().catch(() => []),
          loadStudentExamResults({ examId, classId }),
          loadStudentExamAttempts({ examId, classId }),
        ])
        if (!isMounted) return
        const mergedExams = [...getLegacyTeacherExams(), ...backendExams].filter(
          (exam, index, collection) => collection.findIndex((entry) => entry.id === exam.id) === index,
        )
        setAllExams(mergedExams)
        setResults(nextResults)
        setAttempts(nextAttempts)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadPage()
    return () => {
      isMounted = false
    }
  }, [classId, examId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const filteredResults = useMemo(() => {
    const classStudentIds = new Set((classData?.students ?? []).map((student) => student.id))
    return results.filter(
      (result) =>
        result.examId === examId &&
        (classStudentIds.has(result.studentId) || isMatchingDemoClassId(result.classId, classId)),
    )
  }, [classData?.students, classId, examId, results])
  const pendingResults = useMemo(() => {
    if (!exam) return []
    return filteredResults.filter((result) =>
      exam.questions.some((question) =>
        getAnswerReviewState(question, result.answers.find((answer) => answer.questionId === question.id)) === "pending",
      ),
    )
  }, [exam, filteredResults])
  const selectedResult = filteredResults.find((result) => result.studentId === selectedStudentId) ?? null

  useEffect(() => {
    if (!selectedStudentId) {
      setSelectedStudentId(pendingResults[0]?.studentId ?? filteredResults[0]?.studentId ?? null)
      return
    }
    if (!filteredResults.some((result) => result.studentId === selectedStudentId) && filteredResults.length > 0) {
      setSelectedStudentId(pendingResults[0]?.studentId ?? filteredResults[0]?.studentId ?? null)
    }
  }, [filteredResults, pendingResults, selectedStudentId])

  useEffect(() => {
    if (!exam || !selectedResult) {
      setDraftScores({})
      return
    }
    const nextDraftScores: Record<string, string> = {}
    exam.questions.forEach((question) => {
      if (!isManualReviewQuestionType(question.type)) return
      const answer = selectedResult.answers.find((entry) => entry.questionId === question.id)
      if (!answer?.answer.trim()) return
      nextDraftScores[question.id] = typeof answer.awardedPoints === "number" ? String(answer.awardedPoints) : ""
    })
    setDraftScores(nextDraftScores)
  }, [exam, selectedResult])

  return {
    attempts,
    draftScores,
    exam,
    filteredResults,
    isLoading,
    pendingResults,
    results,
    selectedResult,
    selectedStudentId,
    setDraftScores,
    setResults,
    setSelectedStudentId,
  }
}
