"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { StudentDashboardScheduleCard } from "@/components/student/student-dashboard-schedule-card"
import { StudentExamsOverviewPanel } from "@/components/student/student-exams-overview-panel"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam, type ExamResult } from "@/lib/mock-data"
import { getCachedStudentExamResults, loadStudentExamResults } from "@/lib/student-exam-results"
import { getLocalDateString } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"
import { getExamLetterGrade } from "@/lib/student-report-view"
import { useTheme } from "@/components/theme-provider"

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [allResults, setAllResults] = useState<ExamResult[]>(() => getCachedStudentExamResults())

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([getStudentExams(), loadStudentExamResults({ studentId })])
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
  }, [studentId])

  const myExams = useMemo(() => allExams.filter((exam) => exam.scheduledClasses.some((schedule) => schedule.classId === studentClass)), [allExams, studentClass])
  const studentResults = useMemo(() => allResults.filter((result) => result.studentId === studentId), [allResults, studentId])
  const completedExamIds = useMemo(() => new Set(studentResults.map((result) => result.examId)), [studentResults])
  const statCards = useMemo(() => {
    const averagePercentage = studentResults.length ? Math.round(studentResults.reduce((sum, result) => sum + (result.score / Math.max(result.totalPoints, 1)) * 100, 0) / studentResults.length) : 0
    const latestResult = [...studentResults].sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())[0]
    const latestExam = latestResult ? allExams.find((exam) => exam.id === latestResult.examId) : null
    const latestPercentage = latestResult ? Math.round((latestResult.score / Math.max(latestResult.totalPoints, 1)) * 100) : 0
    const now = new Date()
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const upcomingThisWeek = myExams.filter((exam) => exam.status === "scheduled" && exam.scheduledClasses.some((schedule) => {
      if (schedule.classId !== studentClass) return false
      const startsAt = new Date(`${schedule.date}T${schedule.time}:00`)
      return startsAt >= now && startsAt <= nextWeek
    })).length
    return [
      { label: "Нийт амжилт", value: `${averagePercentage}%`, detail: `${studentResults.length} шалгалт`, iconPath: isDark ? "/student-dashboard-dark-achievement.svg" : "/trophyIcon.svg" },
      { label: latestExam?.title ?? "Сүүлийн шалгалт", value: latestResult ? `${latestPercentage}% ${getExamLetterGrade(latestPercentage)}` : "-", detail: "Сүүлийн дүн", iconPath: isDark ? "/student-dashboard-dark-score.svg" : "/dunIcon.svg" },
      { label: "Энэ 7 хоногт", value: String(upcomingThisWeek), detail: "Өгөх шалгалт", iconPath: isDark ? "/student-dashboard-dark-calendar.svg" : "/calendarIcon.svg" },
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
        <div className="hidden gap-[10px] sm:grid sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-8">
          {statCards.map((item) => (
            <div
              key={item.label}
              className="flex min-h-[88px] items-center gap-3 rounded-[20px] border border-[#DCE8F3] bg-white px-4 py-3 shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-transparent dark:bg-transparent dark:shadow-none"
            >
              <Image src={item.iconPath} alt="" width={56} height={56} className="h-[56px] w-[56px] shrink-0 object-contain" />
              <div>
                <p className="text-[14px] leading-5 text-[#7A8698] dark:text-[#9eacc3]">{item.label}</p>
                <div className="mt-1 flex items-end gap-1.5">
                  <p className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-[#39424E] dark:text-[#edf4ff]">{item.value}</p>
                  <p className="text-[12px] font-medium text-[#4A9DFF]">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
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
