"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { StudentExamDetailContent } from "@/components/student/student-exam-detail-content"
import { Button } from "@/components/ui/button"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import {
  formatCountdownParts,
  getLocalDateString,
  getSecondsUntil,
  isScheduleOpenNow,
  isScheduleVisible,
} from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

function StudentExamPageLoadingState() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-sky-100 p-4 text-sky-700">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Шалгалтын мэдээллийг ачаалж байна</h1>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          Түр хүлээнэ үү. Таны сонгосон шалгалтын мэдээллийг backend-ээс авч байна.
        </p>
      </div>
    </div>
  )
}

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const router = useRouter()
  const { studentClass } = useStudentSession()
  const [countdown, setCountdown] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        if (!isMounted) return
        setIsLoading(false)
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
  const isScheduleStillVisible = schedule && exam
    ? isScheduleVisible(schedule.date, schedule.time, exam.duration)
    : false

  useEffect(() => {
    if (!schedule || !isTodayExam) return

    const updateCountdown = () => {
      setCountdown(getSecondsUntil(schedule.date, schedule.time))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [isTodayExam, schedule])

  if (isLoading) {
    return <StudentExamPageLoadingState />
  }

  if (!exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  if (!isScheduleStillVisible) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалтын хугацаа дууссан байна</h1>
        <p className="mt-2 text-muted-foreground">Энэ шалгалт одоо идэвхтэй жагсаалтад харагдахгүй.</p>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  const isReady = schedule && exam
    ? isScheduleOpenNow(schedule.date, schedule.time, exam.duration)
    : false
  const countdownParts = formatCountdownParts(countdown)

  const handleTakeExam = () => {
    router.push(`/student/exams/${examId}/take`)
  }

  return (
    <StudentExamDetailContent
      countdown={countdownParts}
      exam={exam}
      isFullscreen={isFullscreen}
      isReady={isReady}
      isTodayExam={isTodayExam}
      onClose={() => router.push('/student/exams')}
      onExitFullscreen={() => setIsFullscreen(false)}
      onTakeExam={handleTakeExam}
      onViewFullscreen={() => setIsFullscreen(true)}
      scheduleDate={schedule?.date}
      scheduleTime={schedule?.time}
    />
  )
}
