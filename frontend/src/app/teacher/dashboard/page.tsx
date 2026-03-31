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
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const syncTimer = window.setTimeout(() => setNow(new Date()), 0)
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => {
      window.clearTimeout(syncTimer)
      window.clearInterval(timer)
    }
  }, [])

  const metrics = useTeacherDashboardMetrics(selectedClassId)
  const dashboardNow = now ?? new Date("2026-01-01T09:00:00")
  const activeWeekDate = new Date(dashboardNow)
  activeWeekDate.setDate(dashboardNow.getDate() + weekOffset * 7)

  return (
    <div className="space-y-6">
      <TeacherDashboardHero
        academicWeekLabel={now ? getAcademicWeekLabel(dashboardNow) : "--"}
        classes={classes}
        currentGreeting={now ? getGreetingLabel(dashboardNow) : "Сайн байна уу"}
        headerDate={now ? formatHeaderDate(dashboardNow) : ""}
        metrics={metrics}
        selectedClassId={selectedClassId}
        teacherName={teacher.name}
        onClassChange={setSelectedClassId}
      />

      <section className="grid gap-4 xl:ml-[86px] xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)] 2xl:grid-cols-[minmax(0,1.7fr)_minmax(380px,1fr)]">
        <TeacherDashboardScheduleSection
          calendarTitle={`${activeWeekDate.getMonth() + 1}-р сар ${activeWeekDate.getFullYear()} он`}
          onNextWeek={() => setWeekOffset((current) => current + 1)}
          onPreviousWeek={() => setWeekOffset((current) => current - 1)}
          selectedClassId={selectedClassId}
          todayDate={dashboardNow.toISOString().split("T")[0]}
          weekDates={getTeacherWeekDates(activeWeekDate)}
        />
        <TeacherDashboardSidePanels selectedClassId={selectedClassId} />
      </section>
    </div>
  )
}
