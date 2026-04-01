"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Medal, Trophy } from "lucide-react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { StudentDashboardScheduleCard } from "@/components/student/student-dashboard-schedule-card"
import { StudentExamsOverviewPanel } from "@/components/student/student-exams-overview-panel"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getLocalDateString } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

const statCards = [
  { label: "Нийт амжилт", value: "92.4%", detail: "+1.2%", icon: Trophy },
  { label: "Мэдээлэл зүй", value: "98 A", detail: "Сүүлийн дүн", icon: Medal },
  { label: "Энэ 7 хоногт", value: "3", detail: "Өгөх шалгалт", icon: CalendarDays },
] as const

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (isMounted) setAllExams(nextExams)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh dashboard exams from the backend.", error)
      }
    }

    void loadExams()
    return () => {
      isMounted = false
    }
  }, [])

  const myExams = useMemo(
    () => allExams.filter((exam) =>
      exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
    ),
    [allExams, studentClass],
  )

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1360px] flex-col gap-5 pb-[28px] pt-[18px]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-sans text-[33px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#2D3642]">
            Сайн уу, {studentName}!
          </h1>
          <p className="mt-[6px] font-sans text-[16px] font-normal leading-5 text-[#606C80]">
            Өнөөдөр чиний гялалзах өдөр ✨
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {statCards.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#D9E8F4] bg-[#F3F9FF] text-[#39424E]">
                  <Icon className="h-[26px] w-[26px] stroke-[1.7]" />
                </div>
                <div>
                  <p className="text-[14px] leading-5 text-[#7A8698]">{item.label}</p>
                  <div className="mt-1 flex items-end gap-1.5">
                    <p className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-[#39424E]">{item.value}</p>
                    <p className="text-[12px] font-medium text-[#4A9DFF]">{item.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[900px_440px] xl:gap-[20px]">
        <div className="flex min-h-0 flex-col gap-[20px] xl:w-[900px]">
          <StudentDashboardProfileCard studentId={studentId} studentName={studentName} />
          <StudentDashboardScheduleCard exams={myExams} studentClass={studentClass} />
        </div>

        <StudentExamsOverviewPanel exams={myExams} studentClass={studentClass} today={getLocalDateString()} />
      </div>
    </div>
  )
}
