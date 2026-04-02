"use client"

import type { Class } from "@/lib/mock-data-types"
import {
  buildMockStudentExamResults,
  buildClassDifficultyChartData,
} from "@/lib/teacher-classes-side-panel-data"
import { TeacherClassesAverageChart } from "@/components/teacher/teacher-classes-average-chart"
import { TeacherClassesStudentResultsCard } from "@/components/teacher/teacher-classes-student-results-card"
import type { ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"

export function TeacherClassesSidePanels(props: {
  classOptions: Class[]
  classData: Class
  date: string
  examResults: ExamResult[]
  selectedExamResults: ExamResult[]
  selectedExam: TeacherExam | null
  time: string
}) {
  const { classData, classOptions, date, examResults, selectedExam, selectedExamResults, time } = props
  const studentResults = buildMockStudentExamResults({
    className: classData.name,
    results: selectedExamResults,
    students: classData.students,
  })
  const chartData = buildClassDifficultyChartData({
    classOptions,
    exam: selectedExam,
    examResults,
  })

  return (
    <div className="flex h-[724px] w-[440px] flex-col gap-5">
      <ScoreInsightCard data={chartData} />
      <TeacherClassesStudentResultsCard
        className={classData.name}
        date={date}
        results={studentResults}
        time={time}
      />
    </div>
  )
}

function ScoreInsightCard(props: {
  data: ReturnType<typeof buildClassDifficultyChartData>
}) {
  const { data } = props

  return (
    <section className="rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">
        Дүнгийн мэдээлэл
      </h2>
      <p className="mt-1 text-[13px] text-[#8a96b2]">
        Сонгосон шалгалтын ангийн гүйцэтгэл.
      </p>

      <div className="mt-4 rounded-[20px] border border-[#eef3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(251,252,255,0.96)_100%)] p-3">
        <TeacherClassesAverageChart data={data} />
      </div>
    </section>
  )
}
