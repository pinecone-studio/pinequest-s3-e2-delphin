"use client"

import Image from "next/image"
import Link from "next/link"
import { MoveLeft } from "lucide-react"
import { StudentReportQuestionList } from "@/components/student/report/student-report-question-list"
import { StudentReportSummaryPanel } from "@/components/student/report/student-report-summary-panel"
import { getExamIcon } from "@/components/student/student-exams-page-utils"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Exam, ExamResult } from "@/lib/mock-data"

type StudentReportShellProps = {
  correctCount: number
  earnedPoints: number
  exam: Exam
  examTitle: string
  isAvailable: boolean
  missedPoints: number
  pendingReviewCount: number
  percentage: number
  questionCount: number
  releaseMessage: string
  result: ExamResult
  score: number
  scoreLabel: string
  scheduleLabel: string
  studentClass: string
  studentName: string
  submittedLabel: string
  totalPoints: number
  unansweredCount: number
  unansweredPoints: number
  wrongCount: number
}

export function StudentReportShell(props: StudentReportShellProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const outerShellClassName = "mx-auto max-w-[1692px]"
  const contentClassName = "relative mx-auto max-w-[1088px]"

  void props.pendingReviewCount
  void props.scoreLabel
  void props.studentClass
  void props.studentName
  void props.submittedLabel

  return (
    <div className={cn("min-h-screen px-4 py-4 md:px-4 md:py-4", isDark ? "bg-transparent" : "bg-[radial-gradient(circle_at_top,#eef7ff_0%,#edf6ff_38%,#f5f9ff_100%)]")}>
      <div className={outerShellClassName}>
        <section className="relative px-5 py-6 md:px-7 md:py-7">
          <div className={contentClassName}>
            <header className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <Link
                  href="/student/exams"
                  className={cn("inline-flex items-center gap-2 text-sm font-medium", isDark ? "text-[#8bc8ff]" : "text-[#61a3ff]")}
                >
                  <MoveLeft className="h-4 w-4" />
                  Буцах
                </Link>

                <div className="mt-5 flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-[14px]",
                      isDark
                        ? "border border-[rgba(151,168,255,0.12)] bg-[linear-gradient(180deg,#232a63_0%,#1d2354_100%)] shadow-[0_10px_22px_rgba(8,12,28,0.28)]"
                        : "bg-[#f3ebff] shadow-[0_4px_10px_rgba(159,107,255,0.12)]",
                    )}
                  >
                    <Image src={getExamIcon(props.exam.title)} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-[10px] object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h1 className={cn("text-[29px] font-bold leading-tight tracking-[-0.03em] md:text-[31px]", isDark ? "text-[#edf4ff]" : "text-[#2b3f57]")}>
                      {props.examTitle}
                    </h1>
                    <p className={cn("mt-1 text-[13px] font-medium leading-6", isDark ? "text-[#aab7cb]" : "text-[#7b8da1]")}>
                      {`${props.examTitle} тайланг дэлгэрэнгүй харж байна.`}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <StudentReportSummaryPanel
              duration={props.exam.duration}
              earnedPoints={props.earnedPoints}
              missedPoints={props.missedPoints}
              percentage={props.percentage}
              scheduleLabel={props.scheduleLabel}
              score={props.score}
              totalPoints={props.totalPoints}
              unansweredPoints={props.unansweredPoints}
            />

            <div className="mt-4">
              <StudentReportQuestionList
                exam={props.exam}
                isAvailable={props.isAvailable}
                releaseMessage={props.releaseMessage}
                result={props.result}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
