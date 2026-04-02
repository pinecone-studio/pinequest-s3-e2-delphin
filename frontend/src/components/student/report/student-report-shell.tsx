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
        "min-h-screen px-4 py-4 md:px-4 md:py-4",
        isDark
          ? "bg-transparent"
          : "bg-[radial-gradient(circle_at_top,#eef7ff_0%,#edf6ff_38%,#f5f9ff_100%)]",
      )}
    >
      <div className={cn("mx-auto", isDark ? "max-w-[1692px]" : "max-w-[1380px]")}>
        <section
          className={cn(
            "relative overflow-hidden rounded-[34px] px-5 py-6 md:px-7 md:py-7",
            isDark
              ? "border border-[rgba(148,176,255,0.12)] bg-[linear-gradient(180deg,rgba(11,19,48,0.86)_0%,rgba(8,14,35,0.76)_100%)] shadow-[inset_0_1px_0_rgba(138,165,255,0.08)] backdrop-blur-[14px]"
              : "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px]",
          )}
        >
          {isDark ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(42,83,191,0.16)_0%,rgba(42,83,191,0)_100%)]" />
              <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(49,110,255,0.16)_0%,rgba(49,110,255,0)_70%)] blur-3xl" />
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
                      "flex h-12 w-12 items-center justify-center rounded-[14px]",
                      isDark
                        ? "border border-[rgba(151,168,255,0.12)] bg-[linear-gradient(180deg,#232a63_0%,#1d2354_100%)] shadow-[0_10px_22px_rgba(8,12,28,0.28)]"
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
                  "mt-6 h-11 min-w-[80px] rounded-[14px] px-5 text-[13px] font-semibold",
                  isDark
                    ? "bg-[linear-gradient(180deg,#3d7fe6_0%,#2d68c9_100%)] text-white shadow-[0_16px_30px_rgba(28,73,165,0.28)] hover:brightness-110"
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
