"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { StudentReportShell } from "@/components/student/report/student-report-shell"
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
          getStudentExams(studentClass),
          loadStudentExamResults({ studentId }),
        ])

        if (!isMounted) {
          return
        }

        setAllExams(nextExams)
        setAllResults(nextResults)
      } catch (error) {
        if (isMounted) {
          console.warn("Failed to refresh student report data from backend.", error)
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
  }, [studentClass, studentId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const result = allResults.find((entry) => entry.examId === examId && entry.studentId === studentId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-4 md:px-4 md:py-4">
        <div className="mx-auto max-w-[1380px] dark:max-w-[1692px]">
          <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] px-5 py-6 shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px] dark:border-[rgba(148,176,255,0.12)] dark:bg-[linear-gradient(180deg,rgba(11,19,48,0.86)_0%,rgba(8,14,35,0.76)_100%)] dark:shadow-[inset_0_1px_0_rgba(138,165,255,0.08)] dark:backdrop-blur-[14px] md:px-7 md:py-7">
            <div className="relative mx-auto flex min-h-[420px] max-w-[358px] flex-col items-center justify-center text-center dark:max-w-[1088px] sm:max-w-[980px]">
              <div className="rounded-full bg-sky-100 p-4 text-sky-700 dark:bg-[#17305f] dark:text-[#8bc8ff]">
                <Spinner className="size-6" />
              </div>
              <div className="mt-4 space-y-2">
                <h1 className="text-[20px] font-bold text-slate-900 sm:text-2xl dark:text-[#f4f8ff]">
                  Тайланг бэлдэж байна
                </h1>
                <p className="max-w-[260px] text-sm leading-6 text-slate-600 sm:max-w-md dark:text-[#a9b7ca]">
                  Таны илгээсэн хариултыг шалгаж, тайлангийн хуудсанд шилжүүлж байна. Түр хүлээнэ үү.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (!exam || !result) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#f4f8ff]">Тайлан олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground dark:text-[#a9b7ca]">
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
    ? "Мэдээлэл баталгаажсан тул та одоо бүрэн тайлан, хариултын задаргаагаа харах боломжтой."
    : releaseDate
      ? `Багш бүх ангийг дууссаны дараа тайланг нээнэ. Төлөвлөсөн огноо: ${releaseDate.toLocaleString("mn-MN")}.`
      : "Нээх нөхцөл биелмэгц энэ тайлан автоматаар харагдана."

  return (
    <StudentReportShell
      correctCount={metrics.correctCount}
      earnedPoints={metrics.earnedPoints}
      exam={exam}
      examTitle={exam.title}
      isAvailable={isAvailable}
      missedPoints={metrics.missedPoints}
      pendingReviewCount={metrics.pendingReviewCount}
      percentage={metrics.percentage}
      questionCount={metrics.totalQuestions}
      releaseMessage={releaseMessage}
      result={result}
      scoreLabel={`${metrics.score}/${metrics.totalPoints} • ${getExamLetterGrade(metrics.percentage)}`}
      scheduleLabel={schedule ? `${schedule.date} ${schedule.time}` : "Тов гараагүй"}
      studentClass={studentClass}
      studentName={studentName || "Сурагч"}
      submittedLabel={new Date(result.submittedAt).toLocaleString("mn-MN")}
      totalPoints={metrics.totalPoints}
      unansweredCount={metrics.unansweredCount}
      unansweredPoints={metrics.unansweredPoints}
      wrongCount={metrics.wrongCount}
    />
  )
}
