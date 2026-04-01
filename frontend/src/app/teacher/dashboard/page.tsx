"use client"

import { useState } from "react"
import { classes } from "@/lib/mock-data"
import { useTeacherSession } from "@/hooks/use-teacher-session"
import { useCurrentTime } from "@/hooks/use-current-time"
import { useTeacherDashboardMetrics } from "@/hooks/use-teacher-dashboard-metrics"
import { formatHeaderDate, formatIsoDate, getAcademicWeekLabel, getGreetingLabel, getTeacherWeekDates } from "@/lib/teacher-dashboard-utils"
import { TeacherDashboardHero } from "@/components/teacher/teacher-dashboard-hero"
import { TeacherDashboardScheduleSection } from "@/components/teacher/teacher-dashboard-schedule-section"
import { TeacherDashboardSidePanels } from "@/components/teacher/teacher-dashboard-side-panels"

export default function TeacherDashboard() {
  const [selectedClassId, setSelectedClassId] = useState("all")
  const [weekOffset, setWeekOffset] = useState(0)
  const now = useCurrentTime()
  const { teacherName } = useTeacherSession()

  const metrics = useTeacherDashboardMetrics(selectedClassId)
  const currentDate = now ?? new Date("2024-01-01T00:00:00")
  const activeWeekDate = new Date(currentDate)
  activeWeekDate.setDate(currentDate.getDate() + weekOffset * 7)

  return (
    <div className="space-y-7 pt-[25px]">
      <TeacherDashboardHero academicWeekLabel={now ? getAcademicWeekLabel(now) : "..." } classes={classes} currentGreeting={now ? getGreetingLabel(now) : "Сайн байна уу"} headerDate={now ? formatHeaderDate(now) : "Огноо ачаалж байна"} metrics={metrics} selectedClassId={selectedClassId} teacherName={teacherName || "Багш"} onClassChange={setSelectedClassId} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,900px)_minmax(360px,440px)]">
        <TeacherDashboardScheduleSection calendarTitle={`${activeWeekDate.getMonth() + 1}-р сар ${activeWeekDate.getFullYear()} он`} onNextWeek={() => setWeekOffset((current) => current + 1)} onPreviousWeek={() => setWeekOffset((current) => current - 1)} selectedClassId={selectedClassId} todayDate={now ? formatIsoDate(now) : ""} weekDates={getTeacherWeekDates(activeWeekDate)} />
        <TeacherDashboardSidePanels selectedClassId={selectedClassId} />
      </section>
    </div>
  )
}
