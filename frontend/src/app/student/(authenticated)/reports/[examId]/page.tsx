"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { StudentReportHero } from "@/components/student/report/student-report-hero"
import { StudentReportLocked } from "@/components/student/report/student-report-locked"
import { StudentReportQuestions } from "@/components/student/report/student-report-questions"
import { StudentReportSidebar } from "@/components/student/report/student-report-sidebar"
import { StudentReportSummary } from "@/components/student/report/student-report-summary"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getCachedStudentExamResults, loadStudentExamResults } from "@/lib/student-exam-results"
import {
  getExamLetterGrade,
  getReportMetrics,
  getStudentExamSchedule,
} from "@/lib/student-report-view"
import {
  getStudentExamReportReleaseDate,
  getStudentExams,
  isStudentExamReportAvailable,
} from "@/lib/student-exams"

export default function StudentExamReportPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [allResults, setAllResults] = useState(() => getCachedStudentExamResults())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadReport = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([
          getStudentExams(),
          loadStudentExamResults({ studentId }),
        ])

        if (!isMounted) {
          return
        }

        setAllExams(nextExams)
        setAllResults(nextResults)
      } catch (error) {
        if (isMounted) {
          console.warn("Шалгалтын тайлангийн мэдээллийг backend-ээс сэргээж чадсангүй.", error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadReport()

    return () => {
      isMounted = false
    }
  }, [studentId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const result = allResults.find((entry) => entry.examId === examId && entry.studentId === studentId)

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-sky-100 p-4 text-sky-700">
          <Spinner className="size-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Тайланг бэлдэж байна</h1>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Таны илгээсэн хариултыг шалгаж, тайлангийн хуудсанд шилжүүлж байна. Түр хүлээнэ үү.
          </p>
        </div>
      </div>
    )
  }

  if (!exam || !result) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Тайлан олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Шалгалтын дүн хараахан бэлэн болоогүй эсвэл мэдээлэл татахад саатал гарсан байж магадгүй.
        </p>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  const metrics = getReportMetrics(exam, result)
  const schedule = getStudentExamSchedule(exam, studentClass)
  const isAvailable = isStudentExamReportAvailable(exam)
  const releaseDate = getStudentExamReportReleaseDate(exam)
  const releaseMessage = isAvailable
    ? "Мэдээлэл баталгаажсан тул та одоо бүрэн тайлан, хариултын задлангаа харах боломжтой."
    : releaseDate
      ? `Багш бүх ангийг дууссаны дараа тайланг нээнэ. Төлөвлөсөн огноо: ${releaseDate.toLocaleString("mn-MN")}.`
      : "Нээх нөхцөл биелмэгц энэ тайлан автоматаар харагдана."

  return (
    <div className="mx-auto grid max-w-[1400px] gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <StudentReportHero
          examTitle={exam.title}
          studentClass={studentClass}
          studentName={studentName || "Сурагч"}
        />
        <StudentReportSummary
          duration={exam.duration}
          percentage={metrics.percentage}
          scoreLabel={`${result.score}/${result.totalPoints}`}
          scheduleLabel={schedule ? `${schedule.date} ${schedule.time}` : "Тов гараагүй"}
          submittedLabel={new Date(result.submittedAt).toLocaleString("mn-MN")}
        />
        {isAvailable ? (
          <StudentReportQuestions exam={exam} result={result} />
        ) : (
          <StudentReportLocked message={releaseMessage} />
        )}
      </div>

      <StudentReportSidebar
        examTitle={exam.title}
        isAvailable={isAvailable}
        percentage={metrics.percentage}
        scoreLabel={`${result.score}/${result.totalPoints} • ${getExamLetterGrade(metrics.percentage)}`}
        questionCount={metrics.totalQuestions}
        correctCount={metrics.correctCount}
        wrongCount={metrics.wrongCount}
        unansweredCount={metrics.unansweredCount}
        pendingReviewCount={metrics.pendingReviewCount}
        releaseMessage={releaseMessage}
      />
    </div>
  )
}
