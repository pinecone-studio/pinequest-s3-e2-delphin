"use client"

import { Bell } from "lucide-react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { useStudentSession } from "@/hooks/use-student-session"

export default function StudentDashboard() {
  const { studentName } = useStudentSession()

  return (
    <div className="space-y-6 px-[20px] pb-[20px] pt-[30px]">
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
    </div>
  )
}
