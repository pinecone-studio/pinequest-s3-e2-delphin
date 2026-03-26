"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CircleAlert } from "lucide-react"
import {
  StudentTodayExamsSection,
  StudentUpcomingExamsSection,
} from "@/components/student/student-exams-sections"
import { StudentCompletedExamsSection } from "@/components/student/student-completed-exams-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStudentSession } from "@/hooks/use-student-session"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getLocalDateString, getSecondsUntil } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export default function StudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewExamAlert, setShowNewExamAlert] = useState(false)
  const knownScheduledExamIdsRef = useRef<string[]>([])

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
        setError(null)
        knownScheduledExamIdsRef.current = nextExams
          .filter((exam) =>
            exam.status === "scheduled" &&
            exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
          )
          .map((exam) => exam.id)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : "Failed to load exams.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [studentClass])

  useEffect(() => {
    if (!studentClass) {
      return
    }

    const interval = setInterval(async () => {
      try {
        const nextExams = await getStudentExams()
        const nextScheduledExamIds = nextExams
          .filter((exam) =>
            exam.status === "scheduled" &&
            exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
          )
          .map((exam) => exam.id)

        const hasNewExam = nextScheduledExamIds.some(
          (examId) => !knownScheduledExamIdsRef.current.includes(examId),
        )

        if (hasNewExam) {
          setShowNewExamAlert(true)
        }
      } catch {
        // Ignore polling failures and keep the current page state.
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [studentClass])

  const myExams = useMemo(() => allExams.filter(e =>
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  ), [allExams, studentClass])

  const scheduledExams = useMemo(
    () => myExams.filter(e => e.status === 'scheduled'),
    [myExams],
  )
  const today = getLocalDateString()
  const todaysExams = useMemo(() => scheduledExams.filter(e =>
    e.scheduledClasses.some(sc => sc.classId === studentClass && sc.date === today)
  ), [scheduledExams, studentClass, today])

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, number> = {}
      todaysExams.forEach(exam => {
        const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
        if (schedule) {
          newCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setCountdowns(current => {
        const currentKeys = Object.keys(current)
        const nextKeys = Object.keys(newCountdowns)

        if (
          currentKeys.length === nextKeys.length &&
          nextKeys.every(key => current[key] === newCountdowns[key])
        ) {
          return current
        }

        return newCountdowns
      })
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [todaysExams, studentClass])

  const myResults = examResults.filter(r => r.studentId === studentId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="text-muted-foreground">View your upcoming and completed exams</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not refresh exams</AlertTitle>
          <AlertDescription>
            {error} Existing mock exam data is still shown while the backend list is unavailable.
          </AlertDescription>
        </Alert>
      ) : null}

      {showNewExamAlert ? (
        <Alert>
          <CircleAlert />
          <AlertTitle>New exam available</AlertTitle>
          <AlertDescription>
            A new test was created by the teacher. Please refresh the page.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading exams...</p>
      ) : null}

      <StudentTodayExamsSection examsToday={todaysExams} studentClass={studentClass} countdowns={countdowns} />
      <StudentUpcomingExamsSection upcomingExams={scheduledExams} todaysExams={todaysExams} studentClass={studentClass} />
      <StudentCompletedExamsSection exams={allExams} results={myResults} />
    </div>
  )
}
