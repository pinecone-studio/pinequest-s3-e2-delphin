"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StudentReportHero } from "@/components/student/report/student-report-hero"
import { StudentReportLocked } from "@/components/student/report/student-report-locked"
import { StudentReportQuestions } from "@/components/student/report/student-report-questions"
import { StudentReportSidebar } from "@/components/student/report/student-report-sidebar"
import { StudentReportSummary } from "@/components/student/report/student-report-summary"
import { useStudentSession } from "@/hooks/use-student-session"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
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

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (isMounted) setAllExams(nextExams)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh exam report data from the backend.", error)
      }
    }

    void loadExams()
    return () => {
      isMounted = false
    }
  }, [])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const result = examResults.find((entry) => entry.examId === examId && entry.studentId === studentId)

  if (!exam || !result) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Тайлан олдсонгүй</h1>
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
    ? "Мэдэгдэл баталгаажсан тул та одоо бүрэн тайлан, хариултын задаргааг харах боломжтой."
    : releaseDate
      ? `Багш бүх ангийг дууссаны дараа тайланг нээнэ. Төлөвлөгөөт огноо: ${releaseDate.toLocaleString("mn-MN")}.`
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
          scheduleLabel={schedule ? `${schedule.date} ${schedule.time}` : "Тов алга"}
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
        releaseMessage={releaseMessage}
      />
    </div>
  )
}
