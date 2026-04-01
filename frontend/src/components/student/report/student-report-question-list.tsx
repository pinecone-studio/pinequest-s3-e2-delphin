"use client"

import type { Exam, ExamResult } from "@/lib/mock-data"
import { StudentReportQuestionCard } from "@/components/student/report/student-report-question-card"

type StudentReportQuestionListProps = {
  exam: Exam
  isAvailable: boolean
  releaseMessage: string
  result: ExamResult
}

export function StudentReportQuestionList(props: StudentReportQuestionListProps) {
  return (
    <section className="rounded-[28px] border border-[#edf5ff] bg-white px-5 py-5 shadow-[0_10px_20px_rgba(185,207,228,0.06)] md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#003366]">Хариултын задаргаа</h2>
          <p className="mt-2 text-[13px] text-[#728395]">Асуулт бүрийн хариулт, зөв эсэх болон үнэлгээний мэдээлэл</p>
        </div>
      </div>

      {props.isAvailable ? (
        <div className="mt-5 space-y-4">
          {props.exam.questions.map((question, index) => (
            <StudentReportQuestionCard key={question.id} index={index} question={question} result={props.result} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[18px] border border-white/80 bg-white/84 p-6 text-center text-[15px] leading-8 text-[#5f7286]">
          {props.releaseMessage}
        </div>
      )}
    </section>
  )
}
