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
import { loadStudentExamResults } from "@/lib/student-exam-results"
import { getLocalDateString, getSecondsUntil, isScheduleVisible } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export default function StudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [allResults, setAllResults] = useState(examResults)
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
        setAllResults(await loadStudentExamResults({ studentId }))
        knownScheduledExamIdsRef.current = nextExams
          .filter((exam) =>
            exam.status === "scheduled" &&
            exam.scheduledClasses.some((schedule) =>
              schedule.classId === studentClass && isScheduleVisible(schedule.date, schedule.time, exam.duration),
            ),
          )
          .map((exam) => exam.id)
      } catch (loadError) {
        if (!isMounted) return
        console.warn("Шалгалтын жагсаалтыг backend-ээс сэргээж чадсангүй.", loadError)
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
  }, [studentClass, studentId])

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
            exam.scheduledClasses.some((schedule) =>
              schedule.classId === studentClass && isScheduleVisible(schedule.date, schedule.time, exam.duration),
            ),
          )
          .map((exam) => exam.id)

        const hasNewExam = nextScheduledExamIds.some(
          (examId) => !knownScheduledExamIdsRef.current.includes(examId),
        )

        if (hasNewExam) {
          knownScheduledExamIdsRef.current = nextScheduledExamIds
          setAllExams(nextExams)
          setAllResults(await loadStudentExamResults({ studentId }))
          setShowNewExamAlert(true)
        }
      } catch {
        // Ignore polling failures and keep the current page state.
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [studentClass, studentId])

  const myExams = useMemo(() => allExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass)
  ), [allExams, studentClass])
  const completedExamIds = useMemo(
    () => new Set(allResults.filter((result) => result.studentId === studentId).map((result) => result.examId)),
    [allResults, studentId],
  )

  const scheduledExams = useMemo(
    () => myExams.filter((exam) =>
      exam.status === "scheduled" &&
      !completedExamIds.has(exam.id) &&
      exam.scheduledClasses.some((schedule) =>
        schedule.classId === studentClass && isScheduleVisible(schedule.date, schedule.time, exam.duration),
      )
    ),
    [completedExamIds, myExams, studentClass],
  )
  const today = getLocalDateString()
  const todaysExams = useMemo(() => scheduledExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass && schedule.date === today)
  ), [scheduledExams, studentClass, today])

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, number> = {}
      todaysExams.forEach((exam) => {
        const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
        if (schedule) {
          newCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setCountdowns((current) => {
        const currentKeys = Object.keys(current)
        const nextKeys = Object.keys(newCountdowns)

        if (
          currentKeys.length === nextKeys.length &&
          nextKeys.every((key) => current[key] === newCountdowns[key])
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

  const myResults = allResults.filter((result) => result.studentId === studentId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Шалгалтууд</h1>
        <p className="text-muted-foreground">Удахгүй болох болон дууссан шалгалтуудаа харах</p>
      </div>

      {showNewExamAlert ? (
        <Alert>
          <CircleAlert />
          <AlertTitle>Шинэ шалгалт нэмэгдлээ</AlertTitle>
          <AlertDescription>
            Багш шинэ шалгалт үүсгэсэн байна. Хуудсаа шинэчилнэ үү.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Шалгалтуудыг ачаалж байна...</p>
      ) : null}

      <StudentTodayExamsSection examsToday={todaysExams} studentClass={studentClass} countdowns={countdowns} />
      <StudentUpcomingExamsSection upcomingExams={scheduledExams} todaysExams={todaysExams} studentClass={studentClass} />
      <StudentCompletedExamsSection exams={allExams} results={myResults} />
    </div>
  )
}
