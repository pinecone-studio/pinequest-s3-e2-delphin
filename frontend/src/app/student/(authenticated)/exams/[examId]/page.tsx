"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { StudentExamDetailContent } from "@/components/student/student-exam-detail-content"
import { Button } from "@/components/ui/button"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import { formatCountdownParts, getLocalDateString, getSecondsUntil } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const { studentClass } = useStudentSession()
  const [countdown, setCountdown] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
      } catch (loadError) {
        if (!isMounted) return
        console.warn("Failed to refresh exam details from the backend.", loadError)
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const schedule = exam?.scheduledClasses.find((entry) => entry.classId === studentClass)
  const isTodayExam = schedule?.date === getLocalDateString()

  useEffect(() => {
    if (!schedule || !isTodayExam) return

    const updateCountdown = () => {
      setCountdown(getSecondsUntil(schedule.date, schedule.time))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [isTodayExam, schedule])

  if (!exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    )
  }

  const isReady = isTodayExam && countdown === 0
  const countdownParts = formatCountdownParts(countdown)

  const handleTakeExam = () => {
    alert("Starting exam... (This would redirect to the actual exam interface)")
  }

  return (
    <StudentExamDetailContent
      countdown={countdownParts}
      exam={exam}
      isFullscreen={isFullscreen}
      isReady={isReady}
      isTodayExam={isTodayExam}
      onExitFullscreen={() => setIsFullscreen(false)}
      onTakeExam={handleTakeExam}
      onViewFullscreen={() => setIsFullscreen(true)}
      scheduleDate={schedule?.date}
      scheduleTime={schedule?.time}
    />
  )
}
