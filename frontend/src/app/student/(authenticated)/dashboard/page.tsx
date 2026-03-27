"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell } from "lucide-react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { StudentDashboardScheduleCard } from "@/components/student/student-dashboard-schedule-card"
import { StudentExamsOverviewPanel } from "@/components/student/student-exams-overview-panel"
import { useStudentSession } from "@/hooks/use-student-session"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getLocalDateString } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

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
    () =>
      allExams.filter((exam) =>
        exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
      ),
    [allExams, studentClass],
  )

  const myResults = useMemo(
    () => examResults.filter((result) => result.studentId === studentId),
    [studentId],
  )

  return (
    <div className="grid gap-6 px-[20px] pb-[20px] pt-[30px] xl:grid-cols-[minmax(0,780px)_minmax(0,520px)]">
      <div className="space-y-6">
        <div className="flex w-full max-w-[780px] items-start gap-4">
          <div className="min-w-0">
            <h1 className="font-sans text-[24px] font-bold leading-[1.2] text-[#1f2937]">
              Сайн уу, {studentName}!
            </h1>
            <p className="mt-1 font-sans text-[14px] font-normal text-[#5B646F]">
              Өнөөдөр чиний гялалзах өдөр ✨
            </p>
          </div>
          <button
            type="button"
            className="relative ml-auto mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_4px_12px_rgba(86,127,168,0.18)]"
            aria-label="Мэдэгдэл"
          >
            <Bell className="h-[18px] w-[18px] stroke-[2.2]" />
            <span className="absolute -right-[7px] -top-[7px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#4f9cf9] text-[12px] font-bold text-white">
              1
            </span>
          </button>
        </div>

        <StudentDashboardProfileCard studentName={studentName} />
        <StudentDashboardScheduleCard exams={myExams} studentClass={studentClass} />
      </div>

      <StudentExamsOverviewPanel
        exams={myExams}
        results={myResults}
        today={getLocalDateString()}
      />
    </div>
  )
}
