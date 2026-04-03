"use client"

import { StudentReportQuestionCard } from "@/components/student/report/student-report-question-card"
import { StudentReportLocked } from "@/components/student/report/student-report-locked"
import { studentReportPanelSurfaceClassName } from "@/components/student/report/student-report-panel-styles"
import type { Exam, ExamResult } from "@/lib/mock-data"

type StudentReportQuestionListProps = {
  exam: Exam
  isAvailable: boolean
  releaseMessage: string
  result: ExamResult
}

export function StudentReportQuestionList(props: StudentReportQuestionListProps) {
  return (
    <section className={`px-5 py-6 md:px-7 md:py-7 ${studentReportPanelSurfaceClassName}`}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#003366] dark:text-[#f4f8ff]">Хариултын задаргаа</h2>
          <p className="mt-2 text-[13px] text-[#728395] dark:text-[#9cadc7]">
            Асуулт бүрийн хариулт, зөв эсэх болон үнэлгээний мэдээлэл
          </p>
        </div>
      </div>

      {props.isAvailable ? (
        <div className="mt-5 space-y-4">
          {props.exam.questions.map((question, index) => (
            <StudentReportQuestionCard key={question.id} index={index} question={question} result={props.result} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <StudentReportLocked message={props.releaseMessage} />
        </div>
      )}
    </section>
  )
}
