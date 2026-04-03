"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  type FinishedExamItem,
  getExamCategory,
  getStudentSchedule,
} from "@/components/student/student-exams-page-utils"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam, type ExamResult } from "@/lib/mock-data"
import { getCachedStudentExamResults, loadStudentExamResults } from "@/lib/student-exam-results"
import { getScheduleEnd } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

function getScheduleStartTime(exam: Exam, studentClass: string) {
  const schedule = getStudentSchedule(exam, studentClass)
  return schedule ? new Date(`${schedule.date}T${schedule.time}:00`).getTime() : Number.MAX_SAFE_INTEGER
}

export function useStudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "finished">("all")
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
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
  const myResults = useMemo(() => allResults.filter((result) => result.studentId === studentId), [allResults, studentId])
  const completedExamIds = useMemo(() => new Set(myResults.map((result) => result.examId)), [myResults])
  const latestResultsByExamId = useMemo(
    () =>
      new Map(
        myResults
          .slice()
          .sort(
            (left, right) =>
              new Date(right.submittedAt).getTime() -
              new Date(left.submittedAt).getTime(),
          )
          .map((result) => [result.examId, result] as const),
      ),
    [myResults],
  )
  const scheduledExams = useMemo(() => myExams.filter((exam) => exam.status === "scheduled"), [myExams])

  const activeScheduledExams = useMemo(
    () =>
      scheduledExams.filter((exam) => {
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
    [completedExamIds, scheduledExams, studentClass],
  )

  const missedExams = useMemo(
    () =>
      scheduledExams.filter((exam) => {
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
    [completedExamIds, scheduledExams, studentClass],
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
        .sort((left, right) => {
          const leftTime =
            left.kind === "result"
              ? new Date(left.result.submittedAt).getTime()
              : getScheduleEnd(
                  getStudentSchedule(left.exam, studentClass)?.date || "",
                  getStudentSchedule(left.exam, studentClass)?.time || "00:00",
                  left.exam.duration,
                  left.exam.availableIndefinitely,
                ).getTime()
          const rightTime =
            right.kind === "result"
              ? new Date(right.result.submittedAt).getTime()
              : getScheduleEnd(
                  getStudentSchedule(right.exam, studentClass)?.date || "",
                  getStudentSchedule(right.exam, studentClass)?.time || "00:00",
                  right.exam.duration,
                  right.exam.availableIndefinitely,
                ).getTime()
          return rightTime - leftTime
        }),
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
