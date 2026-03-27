"use client"

import { useEffect, useMemo, useState } from "react"
import { StudentCompletedExamsSection } from "@/components/student/student-completed-exams-section"
import { StudentTodayExamsSection, StudentUpcomingExamsSection } from "@/components/student/student-exams-sections"
import { useStudentSession } from "@/hooks/use-student-session"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
import { loadStudentExamResults } from "@/lib/student-exam-results"
import { getLocalDateString, getSecondsUntil, isScheduleVisible } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export default function StudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [allResults, setAllResults] = useState(examResults)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh student exams from the backend.", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadExams()
    return () => {
      isMounted = false
    }
  }, [studentClass, studentId])

  const myExams = useMemo(() => allExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
  ), [allExams, studentClass])
  const scheduledExams = useMemo(() => myExams.filter((exam) => exam.status === "scheduled"), [myExams])
  const today = getLocalDateString()
  const todaysExams = useMemo(() => scheduledExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass && schedule.date === today),
  ), [scheduledExams, studentClass, today])
  const myResults = useMemo(() => examResults.filter((result) => result.studentId === studentId), [studentId])

  useEffect(() => {
    const updateCountdowns = () => {
      const nextCountdowns: Record<string, number> = {}
      todaysExams.forEach((exam) => {
        const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
        if (schedule) nextCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
      })
      setCountdowns(nextCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [todaysExams, studentClass])

  return (
    <div className="space-y-6 px-[20px] pb-[20px] pt-[30px]">
      <div>
        <h1 className="text-2xl font-bold">Шалгалтууд</h1>
        <p className="text-muted-foreground">Удахгүй болох болон дууссан шалгалтуудаа харах</p>
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Шалгалтуудыг ачаалж байна...</p> : null}
      <StudentTodayExamsSection examsToday={todaysExams} studentClass={studentClass} countdowns={countdowns} />
      <StudentUpcomingExamsSection upcomingExams={scheduledExams} todaysExams={todaysExams} studentClass={studentClass} />
      <StudentCompletedExamsSection exams={allExams} results={myResults} />
    </div>
  )
}
