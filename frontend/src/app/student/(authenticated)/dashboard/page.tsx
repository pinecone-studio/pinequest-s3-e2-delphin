"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { StudentDashboardScheduleCard } from "@/components/student/student-dashboard-schedule-card"
import { StudentExamsOverviewPanel } from "@/components/student/student-exams-overview-panel"
import { useStudentSession } from "@/hooks/use-student-session"
import type { Exam, ExamResult } from "@/lib/mock-data"
import {
  getCachedStudentExamResults,
  getLatestStudentExamResults,
  loadStudentExamResults,
} from "@/lib/student-exam-results"
import { getLocalDateString, getScheduleEnd } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"
import { getExamLetterGrade, getNormalizedStudentExamResult } from "@/lib/student-report-view"
import { useTheme } from "@/components/theme-provider"

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [allResults, setAllResults] = useState<ExamResult[]>(() => getCachedStudentExamResults())

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([getStudentExams(studentClass), loadStudentExamResults({ studentId })])
        if (!isMounted) return
        setAllExams(nextExams)
        setAllResults(nextResults)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh dashboard exams from the backend.", error)
      }
    }
    void loadData()
    return () => {
      isMounted = false
    }
  }, [studentClass, studentId])

  const myExams = useMemo(() => allExams.filter((exam) => exam.scheduledClasses.some((schedule) => schedule.classId === studentClass)), [allExams, studentClass])
  const myExamIds = useMemo(() => new Set(myExams.map((exam) => exam.id)), [myExams])
  const studentResults = useMemo(
    () =>
      getLatestStudentExamResults(
        allResults.filter((result) => result.studentId === studentId && myExamIds.has(result.examId)),
      ),
    [allResults, myExamIds, studentId],
  )
  const completedExamIds = useMemo(() => new Set(studentResults.map((result) => result.examId)), [studentResults])
  const statCards = useMemo(() => {
    const normalizedResults = studentResults
      .map((result) => {
        const exam = allExams.find((entry) => entry.id === result.examId)
        return exam ? getNormalizedStudentExamResult(exam, result) : null
      })
      .filter((result): result is ReturnType<typeof getNormalizedStudentExamResult> => Boolean(result))
    const averagePercentage = normalizedResults.length ? Math.round(normalizedResults.reduce((sum, result) => sum + result.percentage, 0) / normalizedResults.length) : 0
    const latestResult = [...studentResults].sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())[0]
    const latestExam = latestResult ? allExams.find((exam) => exam.id === latestResult.examId) : null
    const latestPercentage = latestResult && latestExam ? getNormalizedStudentExamResult(latestExam, latestResult).percentage : 0
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfWindow = new Date(startOfToday)
    endOfWindow.setDate(endOfWindow.getDate() + 6)
    endOfWindow.setHours(23, 59, 59, 999)
    const upcomingThisWeek = myExams.filter((exam) => exam.status !== "draft" && exam.scheduledClasses.some((schedule) => {
      if (schedule.classId !== studentClass) return false
      const scheduledAt = new Date(`${schedule.date}T${schedule.time}:00`)
      return scheduledAt >= startOfToday && scheduledAt <= endOfWindow && getScheduleEnd(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely) > new Date()
    })).length
    return [
      { label: "Нийт амжилт", value: `${averagePercentage}%`, detail: `${studentResults.length} шалгалт`, iconPath: isDark ? "/student-dashboard-dark-achievement.svg" : "/student-dashboard-light-achievement.svg" },
      { label: latestExam?.title ?? "Сүүлийн шалгалт", value: latestResult ? `${latestPercentage}% ${getExamLetterGrade(latestPercentage)}` : "-", detail: "Сүүлийн дүн", iconPath: isDark ? "/student-dashboard-dark-score.svg" : "/student-dashboard-light-score.svg" },
      { label: "Энэ 7 хоногт", value: String(upcomingThisWeek), detail: "Өгөх шалгалт", iconPath: isDark ? "/student-dashboard-dark-calendar.svg" : "/student-dashboard-light-calendar.svg" },
    ] as const
  }, [allExams, isDark, myExams, studentClass, studentResults])
  const mobileStatCards = [statCards[0], statCards[2], statCards[1]]

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-[10px] px-4 pb-[28px] pt-[18px] sm:max-w-[1360px] sm:gap-5 sm:px-6">
      <div className="flex flex-col gap-[10px] sm:gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 pb-0 pt-[10px] sm:py-0">
          <h1 className="font-sans text-[18px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#2D3642] dark:text-[#edf4ff] sm:text-[33px]">Сайн уу, {studentName}!</h1>
          <p className="mt-[6px] font-sans text-[12px] font-normal leading-4 text-[#606C80] dark:text-[#aab7cb] sm:text-[16px] sm:leading-5">Өнөөдөр чиний гялалзах өдөр ✨</p>
        </div>
        <div className="hidden items-center gap-4 sm:grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-10">
          {statCards.map((item) => <div key={item.label} className="flex items-center gap-2.5"><Image src={item.iconPath} alt="" width={56} height={56} className="h-[56px] w-[56px] shrink-0 object-contain" /><div><p className="text-[11px] leading-4 text-[#7A8698] dark:text-[#9eacc3]">{item.label}</p><div className="mt-0.5 flex items-end gap-1"><p className="text-[14px] font-semibold leading-none tracking-[-0.03em] text-[#39424E] dark:text-[#edf4ff]">{item.value}</p><p className="text-[10px] font-medium text-[#4A9DFF]">{item.detail}</p></div></div></div>)}
        </div>
      </div>
      <div className="grid gap-[10px] sm:gap-5 xl:grid-cols-[900px_440px] xl:items-stretch xl:gap-[20px]">
        <div className="flex h-full flex-col gap-[10px] sm:gap-[20px] xl:w-[900px]">
          <StudentDashboardProfileCard mobileStats={mobileStatCards} studentId={studentId} studentName={studentName} />
          <StudentDashboardScheduleCard completedExamIds={completedExamIds} exams={myExams} studentClass={studentClass} />
        </div>
        <StudentExamsOverviewPanel exams={myExams} results={studentResults} studentClass={studentClass} today={getLocalDateString()} />
      </div>
    </div>
  )
}
