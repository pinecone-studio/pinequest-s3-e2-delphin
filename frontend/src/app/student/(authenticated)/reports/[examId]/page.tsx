"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { StudentReportLoadingState } from "@/components/student/report/student-report-loading-state"
import { Button } from "@/components/ui/button"
import { StudentReportShell } from "@/components/student/report/student-report-shell"
import { useStudentSession } from "@/hooks/use-student-session"
import type { Exam } from "@/lib/mock-data"
import {
  getCachedStudentExamResults,
  getLatestStudentExamResult,
  loadStudentExamResults,
} from "@/lib/student-exam-results"
import {
  getExamLetterGrade,
  getReportMetrics,
  getStudentExamSchedule,
} from "@/lib/student-report-view"
import {
  getStudentExamReportReleaseDate,
  getStudentExams,
  isStudentExamReportAvailable,
} from "@/lib/student-exams"

export default function StudentExamReportPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [allResults, setAllResults] = useState(() => getCachedStudentExamResults())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadReport = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([
          getStudentExams(studentClass),
          loadStudentExamResults({ studentId }),
        ])

        if (!isMounted) {
          return
        }

        setAllExams(nextExams)
        setAllResults(nextResults)
      } catch (error) {
        if (isMounted) {
          console.warn("Failed to refresh student report data from backend.", error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadReport()

    return () => {
      isMounted = false
    }
  }, [studentClass, studentId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const result = useMemo(
    () => getLatestStudentExamResult(allResults, examId, studentId),
    [allResults, examId, studentId],
  )

  if (isLoading) {
    return <StudentReportLoadingState />
  }

  if (!exam || !result) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f4f8ff]">Ð¢Ð°Ð¹Ð»Ð°Ð½ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</h1>
        <p className="mt-2 text-sm text-muted-foreground dark:text-[#a9b7ca]">
          Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð½ Ð´Ò¯Ð½ Ñ…Ð°Ñ€Ð°Ð°Ñ…Ð°Ð½ Ð±ÑÐ»ÑÐ½ Ð±Ð¾Ð»Ð¾Ð¾Ð³Ò¯Ð¹ ÑÑÐ²ÑÐ» Ð¼ÑÐ´ÑÑÐ»ÑÐ» Ñ‚Ð°Ñ‚Ð°Ñ…Ð°Ð´ ÑÐ°Ð°Ñ‚Ð°Ð» Ð³Ð°Ñ€ÑÐ°Ð½ Ð±Ð°Ð¹Ð¶ Ð¼Ð°Ð³Ð°Ð´Ð³Ò¯Ð¹.
        </p>
        <Link href="/student/exams">
          <Button className="mt-4">Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚ÑƒÑƒÐ´ Ñ€ÑƒÑƒ Ð±ÑƒÑ†Ð°Ñ…</Button>
        </Link>
      </div>
    )
  }

  const metrics = getReportMetrics(exam, result)
  const schedule = getStudentExamSchedule(exam, studentClass)
  const isAvailable = isStudentExamReportAvailable(exam)
  const releaseDate = getStudentExamReportReleaseDate(exam)
  const releaseMessage = isAvailable
    ? "ÐœÑÐ´ÑÑÐ»ÑÐ» Ð±Ð°Ñ‚Ð°Ð»Ð³Ð°Ð°Ð¶ÑÐ°Ð½ Ñ‚ÑƒÐ» Ñ‚Ð° Ð¾Ð´Ð¾Ð¾ Ð±Ò¯Ñ€ÑÐ½ Ñ‚Ð°Ð¹Ð»Ð°Ð½, Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‹Ð½ Ð·Ð°Ð´Ð°Ñ€Ð³Ð°Ð°Ð³Ð°Ð° Ñ…Ð°Ñ€Ð°Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ñ‚Ð¾Ð¹."
    : releaseDate
      ? `Ð‘Ð°Ð³Ñˆ Ð±Ò¯Ñ… Ð°Ð½Ð³Ð¸Ð¹Ð³ Ð´ÑƒÑƒÑÑÐ°Ð½Ñ‹ Ð´Ð°Ñ€Ð°Ð° Ñ‚Ð°Ð¹Ð»Ð°Ð½Ð³ Ð½ÑÑÐ½Ñ. Ð¢Ó©Ð»Ó©Ð²Ð»Ó©ÑÓ©Ð½ Ð¾Ð³Ð½Ð¾Ð¾: ${releaseDate.toLocaleString("mn-MN")}.`
      : "ÐÑÑÑ… Ð½Ó©Ñ…Ñ†Ó©Ð» Ð±Ð¸ÐµÐ»Ð¼ÑÐ³Ñ† ÑÐ½Ñ Ñ‚Ð°Ð¹Ð»Ð°Ð½ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð°Ð°Ñ€ Ñ…Ð°Ñ€Ð°Ð³Ð´Ð°Ð½Ð°."

  return (
    <StudentReportShell
      correctCount={metrics.correctCount}
      earnedPoints={metrics.earnedPoints}
      exam={exam}
      examTitle={exam.title}
      isAvailable={isAvailable}
      missedPoints={metrics.missedPoints}
      pendingReviewCount={metrics.pendingReviewCount}
      percentage={metrics.percentage}
      questionCount={metrics.totalQuestions}
      releaseMessage={releaseMessage}
      result={result}
      score={metrics.score}
      scoreLabel={`${metrics.score}/${metrics.totalPoints} â€¢ ${getExamLetterGrade(metrics.percentage)}`}
      scheduleLabel={schedule ? `${schedule.date} ${schedule.time}` : "Ð¢Ð¾Ð² Ð³Ð°Ñ€Ð°Ð°Ð³Ò¯Ð¹"}
      studentClass={studentClass}
      studentName={studentName || "Ð¡ÑƒÑ€Ð°Ð³Ñ‡"}
      submittedLabel={new Date(result.submittedAt).toLocaleString("mn-MN")}
      totalPoints={metrics.totalPoints}
      unansweredCount={metrics.unansweredCount}
      unansweredPoints={metrics.unansweredPoints}
      wrongCount={metrics.wrongCount}
    />
  )
}
