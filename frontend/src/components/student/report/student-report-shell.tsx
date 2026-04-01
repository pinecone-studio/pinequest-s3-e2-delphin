"use client"

import Image from "next/image"
import Link from "next/link"
import { MoveLeft } from "lucide-react"
import { StudentReportQuestionList } from "@/components/student/report/student-report-question-list"
import { StudentReportSummaryPanel } from "@/components/student/report/student-report-summary-panel"
import { Button } from "@/components/ui/button"
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
  void props.pendingReviewCount
  void props.scoreLabel
  void props.studentClass
  void props.studentName
  void props.submittedLabel

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef7ff_0%,#edf6ff_38%,#f5f9ff_100%)] px-4 py-4 dark:bg-[radial-gradient(circle_at_top,#0b1733_0%,#09111f_38%,#050910_100%)] md:px-8 md:py-6">
      <div className="mx-auto max-w-[1380px]">
        <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] px-5 py-5 shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,16,37,0.88)_0%,rgba(9,17,31,0.92)_100%)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.36)] md:px-8 md:py-6">
          <div className="mx-auto max-w-[980px]">
            <header className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <Link href="/student/exams" className="inline-flex items-center gap-2 text-sm font-medium text-[#61a3ff] dark:text-[#8ac7ff]">
                  <MoveLeft className="h-4 w-4" />
                  Буцах
                </Link>

                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f3ebff] shadow-[0_4px_10px_rgba(159,107,255,0.12)] dark:bg-[#1d1d48]">
                    <Image src="/report-header-icon.svg" alt="" width={40} height={40} className="h-10 w-10 rounded-[10px]" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-[29px] font-bold leading-tight tracking-[-0.03em] text-[#2b3f57] dark:text-[#edf4ff] md:text-[31px]">
                      {props.examTitle}
                    </h1>
                    <p className="mt-1 text-[13px] font-medium leading-6 text-[#7b8da1] dark:text-[#aab7cb]">
                      {`${props.examTitle} тайланг дэлгэрэнгүй харж байна.`}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="mt-8 h-9 rounded-[12px] bg-[#48a8ff] px-5 text-[12px] font-semibold shadow-[0_10px_22px_rgba(72,168,255,0.22)] hover:bg-[#349cff] dark:bg-[#1b4f9c] dark:hover:bg-[#2461b7]"
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
        </div>
      </div>
    </div>
  )
}
