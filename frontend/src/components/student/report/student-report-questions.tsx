"use client"

import { CheckCircle2, CircleDashed, XCircle } from "lucide-react"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { questionTypeLabels } from "@/lib/student-report-view"

type StudentReportQuestionsProps = {
  exam: Exam
  result: ExamResult
}

export function StudentReportQuestions({ exam, result }: StudentReportQuestionsProps) {
  return (
    <section className="rounded-[28px] border border-[#d8eaff] bg-white p-5 shadow-[0_16px_40px_rgba(102,157,214,0.09)]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">Хариултын задлан</h2>
        <p className="mt-1 text-sm text-slate-500">Асуулт бүрийн хариулт, зөв эсэх, онооны мэдээлэл</p>
      </div>

      <div className="space-y-4">
        {exam.questions.map((question, index) => {
          const answer = result.answers.find((entry) => entry.questionId === question.id)
          const isCorrect = Boolean(answer?.isCorrect)
          const statusLabel = answer ? (isCorrect ? "Зөв" : "Буруу") : "Илгээгээгүй"
          const StatusIcon = answer ? (isCorrect ? CheckCircle2 : XCircle) : CircleDashed

          return (
            <article key={question.id} className="rounded-[22px] border border-[#dbeafc] bg-[#fbfdff] p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#5c7ea5]">
                      Асуулт {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {questionTypeLabels[question.type]} • {question.points} оноо
                    </span>
                  </div>
                  <h3 className="text-base font-semibold leading-7 text-slate-800">{question.question}</h3>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                    isCorrect
                      ? "bg-[#e8fff3] text-[#35a66b]"
                      : answer
                        ? "bg-[#fff1ee] text-[#df6c5b]"
                        : "bg-[#eef5ff] text-[#5c7ea5]"
                  }`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusLabel}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[18px] border border-[#dbeafc] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Таны хариулт
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {answer?.answer || "Хариулт илгээгдээгүй"}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#dbeafc] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Зөв хариулт
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {question.correctAnswer || "Багш тайлбарын хамт дараа нэмж оруулна"}
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
