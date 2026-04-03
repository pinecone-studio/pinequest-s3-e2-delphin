"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { StudentExamDetailContent } from "@/components/student/student-exam-detail-content"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8 dark:bg-transparent">
      <div className="mx-auto flex min-h-[420px] w-full max-w-[358px] flex-col items-center justify-center rounded-[20px] border border-[#E6F2FF] bg-[#F5FAFF] px-6 py-10 text-center shadow-[0_9px_24px_rgba(24,100,251,0.05)] sm:max-w-[904px] sm:rounded-[16px] sm:px-8 dark:border-[rgba(82,146,237,0.24)] dark:bg-[linear-gradient(127deg,#060B26_18%,#0B1230_58%,#1A1F37_100%)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.42)]">
        <div className="rounded-full bg-sky-100 p-4 text-sky-700 dark:bg-[#17305f] dark:text-[#8bc8ff]">
          <Spinner className="size-6" />
        </div>
        <div className="mt-4 space-y-2">
          <h1 className="text-[20px] font-bold text-slate-900 sm:text-2xl dark:text-[#f4f8ff]">
            Шалгалтын мэдээллийг ачаалж байна
          </h1>
          <p className="max-w-[260px] text-sm leading-6 text-slate-600 sm:max-w-md dark:text-[#a9b7ca]">
            Түр хүлээнэ үү. Таны сонгосон шалгалтын мэдээллийг backend-ээс авч байна.
          </p>
        </div>
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
    ? isScheduleVisible(
        schedule.date,
        schedule.time,
        exam.duration,
        exam.availableIndefinitely,
      )
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
        <p className="mt-2 text-muted-foreground">
          Энэ шалгалт одоо идэвхтэй жагсаалтад харагдахгүй.
        </p>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  const isReady = schedule && exam
    ? isScheduleOpenNow(
        schedule.date,
        schedule.time,
        exam.duration,
        exam.availableIndefinitely,
      )
    : false
  const countdownParts = formatCountdownParts(countdown)

  return (
    <StudentExamDetailContent
      countdown={countdownParts}
      exam={exam}
      isFullscreen={isFullscreen}
      isReady={isReady}
      isTodayExam={isTodayExam}
      onClose={() => router.push("/student/exams")}
      onExitFullscreen={() => setIsFullscreen(false)}
      onTakeExam={() => router.push(`/student/exams/${examId}/take`)}
      scheduleDate={schedule?.date}
      scheduleTime={schedule?.time}
    />
  )
}
