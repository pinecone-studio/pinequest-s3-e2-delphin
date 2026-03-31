"use client"

import { useEffect, useState } from "react"
import { classes } from "@/lib/mock-data"
import { teacher } from "@/lib/mock-data-helpers"
import { useTeacherDashboardMetrics } from "@/hooks/use-teacher-dashboard-metrics"
import { formatHeaderDate, getAcademicWeekLabel, getGreetingLabel, getTeacherWeekDates } from "@/lib/teacher-dashboard-utils"
import { TeacherDashboardHero } from "@/components/teacher/teacher-dashboard-hero"
import { TeacherDashboardScheduleSection } from "@/components/teacher/teacher-dashboard-schedule-section"
import { TeacherDashboardSidePanels } from "@/components/teacher/teacher-dashboard-side-panels"

export default function TeacherDashboard() {
  const [selectedClassId, setSelectedClassId] = useState("all")
  const [weekOffset, setWeekOffset] = useState(0)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = useTeacherDashboardMetrics(selectedClassId)
  const activeWeekDate = new Date(now)
  activeWeekDate.setDate(now.getDate() + weekOffset * 7)

  return (
    <div className="space-y-7 pt-[25px]">
      <TeacherDashboardHero academicWeekLabel={getAcademicWeekLabel(now)} classes={classes} currentGreeting={getGreetingLabel(now)} headerDate={formatHeaderDate(now)} metrics={metrics} selectedClassId={selectedClassId} teacherName={teacher.name} onClassChange={setSelectedClassId} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,900px)_minmax(360px,440px)]">
        <TeacherDashboardScheduleSection calendarTitle={`${activeWeekDate.getMonth() + 1}-р сар ${activeWeekDate.getFullYear()} он`} onNextWeek={() => setWeekOffset((current) => current + 1)} onPreviousWeek={() => setWeekOffset((current) => current - 1)} selectedClassId={selectedClassId} todayDate={now.toISOString().split("T")[0]} weekDates={getTeacherWeekDates(activeWeekDate)} />
        <TeacherDashboardSidePanels selectedClassId={selectedClassId} />
      </section>
    </div>
  )
}
