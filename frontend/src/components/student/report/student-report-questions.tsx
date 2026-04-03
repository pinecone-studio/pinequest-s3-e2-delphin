"use client"

import { CheckCircle2, CircleDashed, ClipboardCheck, XCircle } from "lucide-react"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { getAnswerReviewState, questionTypeLabels } from "@/lib/student-report-view"

type StudentReportQuestionsProps = {
  exam: Exam
  result: ExamResult
}

function getStatusPresentation(reviewState: ReturnType<typeof getAnswerReviewState>) {
  switch (reviewState) {
    case "correct":
      return {
        label: "Зөв",
        icon: CheckCircle2,
        className: "bg-[#e8fff3] text-[#35a66b]",
      }
    case "wrong":
      return {
        label: "Буруу",
        icon: XCircle,
        className: "bg-[#fff1ee] text-[#df6c5b]",
      }
    case "graded":
      return {
        label: "Үнэлсэн",
        icon: ClipboardCheck,
        className: "bg-[#eef7ff] text-[#3179c6]",
      }
    case "pending":
      return {
        label: "Шалгаж байна",
        icon: CircleDashed,
        className: "bg-[#fff8e8] text-[#c98a1a]",
      }
    default:
      return {
        label: "Илгээгээгүй",
        icon: CircleDashed,
        className: "bg-[#eef5ff] text-[#5c7ea5]",
      }
  }
}

export function StudentReportQuestions({ exam, result }: StudentReportQuestionsProps) {
  return (
    <section className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,251,255,0.94)_100%)] p-6 shadow-[0_24px_54px_rgba(122,175,220,0.16)] backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-[31px] font-bold tracking-[-0.03em] text-[#003366]">Хариултын задлан</h2>
        <p className="mt-1 text-sm text-[#6f7982]">Асуулт бүрийн хариулт, шалгалтын төлөв болон үнэлгээний мэдээлэл</p>
      </div>

      <div className="space-y-5">
        {exam.questions.map((question, index) => {
          const answer = result.answers.find((entry) => entry.questionId === question.id)
          const reviewState = getAnswerReviewState(question, answer)
          const status = getStatusPresentation(reviewState)
          const StatusIcon = status.icon
          const isManualQuestion = reviewState === "pending" || reviewState === "graded"
          const awardedPoints = typeof answer?.awardedPoints === "number" ? answer.awardedPoints : null

          return (
            <article key={question.id} className="rounded-[28px] border border-[#dbeafc] bg-[linear-gradient(180deg,#fbfdff_0%,#f5faff_100%)] p-5 shadow-[0_12px_28px_rgba(160,194,225,0.1)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#5c7ea5]">
                      Асуулт {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#8aa3ba]">
                      {questionTypeLabels[question.type]} • {question.points} оноо
                    </span>
                  </div>
                  <h3 className="text-[17px] font-semibold leading-8 text-[#003366]">{question.question}</h3>
                </div>

                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${status.className}`}>
                  <StatusIcon className="h-4 w-4" />
                  {status.label}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-[#dbeafc] bg-white p-4 shadow-[0_10px_24px_rgba(148,185,220,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8aa3ba]">
                    Таны хариулт
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#4d6781]">
                    {answer?.answer || "Хариулт илгээгээгүй"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#dbeafc] bg-white p-4 shadow-[0_10px_24px_rgba(148,185,220,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8aa3ba]">
                    {isManualQuestion ? "Үнэлгээний төлөв" : "Зөв хариулт"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#4d6781]">
                    {isManualQuestion
                      ? reviewState === "graded"
                        ? `Багш ${awardedPoints ?? 0}/${question.points} оноо өгсөн.`
                        : reviewState === "pending"
                          ? "Энэ хариултыг багш гараар шалгаж, оноо өгсний дараа эцсийн дүн шинэчлэгдэнэ."
                          : "Хариулт илгээгээгүй."
                      : question.correctAnswer || "Багш тайлбарын хамт дараа нэмэж оруулна"}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
