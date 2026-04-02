"use client"

import Image from "next/image"
import Link from "next/link"
import { MoveLeft } from "lucide-react"
import { StudentReportQuestionList } from "@/components/student/report/student-report-question-list"
import { StudentReportSummaryPanel } from "@/components/student/report/student-report-summary-panel"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Exam, ExamResult } from "@/lib/mock-data"

type StudentReportShellProps = {
  correctCount: number
  exam: Exam
  examTitle: string
  isAvailable: boolean
  pendingReviewCount: number
  percentage: number
  questionCount: number
  releaseMessage: string
  result: ExamResult
  scoreLabel: string
  scheduleLabel: string
  studentClass: string
  studentName: string
  submittedLabel: string
  totalPoints: number
  unansweredCount: number
  wrongCount: number
}

export function StudentReportShell(props: StudentReportShellProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  void props.pendingReviewCount
  void props.scoreLabel
  void props.studentClass
  void props.studentName
  void props.submittedLabel

  return (
    <div
      className={cn(
        "min-h-screen px-4 py-4 md:px-8 md:py-6",
        isDark
          ? "bg-[radial-gradient(circle_at_top,#101a44_0%,#0a122c_36%,#060b16_100%)]"
          : "bg-[radial-gradient(circle_at_top,#eef7ff_0%,#edf6ff_38%,#f5f9ff_100%)]",
      )}
    >
      <div className={cn("mx-auto", isDark ? "max-w-[1692px]" : "max-w-[1380px]")}>
        <section
          className={cn(
            "relative overflow-hidden rounded-[34px] px-5 py-5 md:px-8 md:py-6",
            isDark
              ? "border border-white/10 bg-[linear-gradient(180deg,#0a122d_0%,#091126_100%)] shadow-[0_24px_70px_rgba(2,6,23,0.36)]"
              : "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px]",
          )}
        >
          {isDark ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(31,63,152,0.14)_0%,rgba(31,63,152,0)_100%)]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,rgba(20,42,96,0.14)_0%,rgba(20,42,96,0)_100%)]" />
            </>
          ) : null}

          <div className={cn("relative mx-auto", isDark ? "max-w-[1088px]" : "max-w-[980px]")}>
            <header className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <Link
                  href="/student/exams"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium",
                    isDark ? "text-[#8bc8ff]" : "text-[#61a3ff]",
                  )}
                >
                  <MoveLeft className="h-4 w-4" />
                  Буцах
                </Link>

                <div className="mt-5 flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-[12px]",
                      isDark
                        ? "bg-[#202455] shadow-[0_8px_16px_rgba(8,12,28,0.42)]"
                        : "bg-[#f3ebff] shadow-[0_4px_10px_rgba(159,107,255,0.12)]",
                    )}
                  >
                    <Image src="/report-header-icon.svg" alt="" width={40} height={40} className="h-10 w-10 rounded-[10px]" />
                  </div>
                  <div className="min-w-0">
                    <h1
                      className={cn(
                        "text-[29px] font-bold leading-tight tracking-[-0.03em] md:text-[31px]",
                        isDark ? "text-[#edf4ff]" : "text-[#2b3f57]",
                      )}
                    >
                      {props.examTitle}
                    </h1>
                    <p
                      className={cn(
                        "mt-1 text-[13px] font-medium leading-6",
                        isDark ? "text-[#aab7cb]" : "text-[#7b8da1]",
                      )}
                    >
                      {`${props.examTitle} тайланг дэлгэрэнгүй харж байна.`}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className={cn(
                  "mt-8 h-11 rounded-[14px] px-6 text-[13px] font-semibold",
                  isDark
                    ? "bg-[linear-gradient(180deg,#2c67c0_0%,#2254a9_100%)] text-white shadow-[0_18px_38px_rgba(24,64,148,0.34)] hover:brightness-110"
                    : "bg-[#48a8ff] text-white shadow-[0_10px_22px_rgba(72,168,255,0.22)] hover:bg-[#349cff]",
                )}
              >
                <Link href="/student/exams">Татах</Link>
              </Button>
            </header>

            <StudentReportSummaryPanel
              correctCount={props.correctCount}
              duration={props.exam.duration}
              percentage={props.percentage}
              questionCount={props.questionCount}
              scheduleLabel={props.scheduleLabel}
              score={props.result.score}
              totalPoints={props.totalPoints}
              unansweredCount={props.unansweredCount}
              wrongCount={props.wrongCount}
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
