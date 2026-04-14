"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  type FinishedExamItem,
  getExamCategory,
  getStudentSchedule,
} from "@/components/student/student-exams-page-utils"
import {
  getFinishedItemSortTime,
  getLatestResultsByExamId,
  getScheduleStartTime,
} from "@/hooks/use-student-exams-page-helpers"
import { useStudentSession } from "@/hooks/use-student-session"
import type { Exam, ExamResult } from "@/lib/mock-data"
import {
  getCachedStudentExamResults,
  getLatestStudentExamResults,
  loadStudentExamResults,
} from "@/lib/student-exam-results"
import { getScheduleEnd } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export function useStudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "finished">("all")
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [allResults, setAllResults] = useState<ExamResult[]>(() => getCachedStudentExamResults())
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([
          getStudentExams(studentClass),
          loadStudentExamResults({ studentId }),
        ])
        if (!isMounted) return
        setAllExams(nextExams)
        setAllResults(nextResults)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh student exams from the backend.", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadExams()
    return () => { isMounted = false }
  }, [studentClass, studentId])
  const myExams = useMemo(() => allExams.filter((exam) => exam.scheduledClasses.some((schedule) => schedule.classId === studentClass)), [allExams, studentClass])
  const myExamIds = useMemo(() => new Set(myExams.map((exam) => exam.id)), [myExams])
  const myResults = useMemo(
    () =>
      getLatestStudentExamResults(
        allResults.filter((result) => result.studentId === studentId && myExamIds.has(result.examId)),
      ),
    [allResults, myExamIds, studentId],
  )
  const completedExamIds = useMemo(() => new Set(myResults.map((result) => result.examId)), [myResults])
  const latestResultsByExamId = useMemo(() => getLatestResultsByExamId(myResults), [myResults])
  const availableExams = useMemo(() => myExams.filter((exam) => exam.status !== "draft"), [myExams])

  const activeScheduledExams = useMemo(
    () =>
      availableExams.filter((exam) => {
        if (completedExamIds.has(exam.id)) return false
        const schedule = getStudentSchedule(exam, studentClass)
        if (!schedule) return false
        return getScheduleEnd(
          schedule.date,
          schedule.time,
          exam.duration,
          exam.availableIndefinitely,
        ) > new Date()
      }),
    [availableExams, completedExamIds, studentClass],
  )

  const missedExams = useMemo(
    () =>
      availableExams.filter((exam) => {
        if (completedExamIds.has(exam.id)) return false
        const schedule = getStudentSchedule(exam, studentClass)
        if (!schedule) return false
        return getScheduleEnd(
          schedule.date,
          schedule.time,
          exam.duration,
          exam.availableIndefinitely,
        ) <= new Date()
      }),
    [availableExams, completedExamIds, studentClass],
  )

  const categoryOptions = useMemo(() => {
    const nextCategories = new Set<string>(); myExams.forEach((exam) => nextCategories.add(getExamCategory(exam)))
    return ["all", ...Array.from(nextCategories)]
  }, [myExams])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const matchesFilters = useCallback(
    (exam: Exam) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        exam.title.toLowerCase().includes(normalizedQuery) ||
        getExamCategory(exam).toLowerCase().includes(normalizedQuery)
      const matchesCategory =
        selectedCategory === "all" || getExamCategory(exam) === selectedCategory
      return matchesSearch && matchesCategory
    },
    [normalizedQuery, selectedCategory],
  )

  const filteredUpcomingExams = useMemo(
    () => activeScheduledExams.filter(matchesFilters).sort((left, right) => getScheduleStartTime(left, studentClass) - getScheduleStartTime(right, studentClass)),
    [activeScheduledExams, matchesFilters, studentClass],
  )

  const finishedItems = useMemo<FinishedExamItem[]>(
    () =>
      [
        ...myExams
          .filter((exam) => latestResultsByExamId.has(exam.id))
          .map((exam) => ({
            kind: "result" as const,
            exam,
            result: latestResultsByExamId.get(exam.id)!,
          })),
        ...missedExams.map((exam) => ({ kind: "missed", exam } as const)),
      ]
        .filter((item) => matchesFilters(item.exam))
        .sort(
          (left, right) =>
            getFinishedItemSortTime(right, studentClass) -
            getFinishedItemSortTime(left, studentClass),
        ),
    [latestResultsByExamId, matchesFilters, missedExams, myExams, studentClass],
  )

  return {
    activeTab,
    categoryOptions,
    filteredUpcomingExams,
    finishedItems,
    isLoading,
    searchQuery,
    selectedCategory,
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    studentClass,
  }
}
