"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentRecentResultsCard } from "@/components/student/student-recent-results-card"
import { StudentScheduleCalendar } from "@/components/student/student-schedule-calendar"
import { StudentUpcomingExamsCard } from "@/components/student/student-upcoming-exams-card"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getLocalDateString, getSecondsUntil } from "@/lib/student-exam-time"
import { useStudentSession } from "@/hooks/use-student-session"
import { getStudentExams } from "@/lib/student-exams"

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [todayCountdowns, setTodayCountdowns] = useState<Record<string, number>>({})

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
      } catch (loadError) {
        if (!isMounted) return
        console.warn("Failed to refresh dashboard exams from the backend.", loadError)
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const myExams = useMemo(() => allExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass)
  ), [allExams, studentClass])
  const upcomingExams = useMemo(
    () => myExams.filter((exam) => exam.status === "scheduled"),
    [myExams],
  )
  const today = getLocalDateString()
  const todaysExams = useMemo(() => upcomingExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass && schedule.date === today)
  ), [studentClass, today, upcomingExams])
  const myResults = examResults.filter((result) => result.studentId === studentId)
  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, result) => sum + (result.score / result.totalPoints) * 100, 0) / myResults.length)
    : 0

  useEffect(() => {
    const updateCountdowns = () => {
      const nextCountdowns: Record<string, number> = {}
      todaysExams.forEach((exam) => {
        const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
        if (schedule) {
          nextCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setTodayCountdowns(nextCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [studentClass, todaysExams])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {studentName}</p>
      </div>

      <StudentUpcomingExamsCard
        exams={upcomingExams}
        studentClass={studentClass}
        today={today}
        todayCountdowns={todayCountdowns}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Your Class</CardDescription>
            <CardTitle className="text-3xl">{studentClass}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Upcoming Exams</CardDescription>
            <CardTitle className="text-3xl">{upcomingExams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Completed Exams</CardDescription>
            <CardTitle className="text-3xl">{myResults.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Average Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <StudentScheduleCalendar myExams={myExams} studentClass={studentClass} />
      <StudentRecentResultsCard exams={allExams} results={myResults} />
    </div>
  )
}
