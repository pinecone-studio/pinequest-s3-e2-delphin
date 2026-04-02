"use client"

import type { Class } from "@/lib/mock-data-types"
import {
  buildMockStudentExamResults,
  mockClassAverageData,
} from "@/lib/teacher-classes-side-panel-data"
import { TeacherClassesAverageChart } from "@/components/teacher/teacher-classes-average-chart"
import { TeacherClassesStudentResultsCard } from "@/components/teacher/teacher-classes-student-results-card"

export function TeacherClassesSidePanels(props: {
  classData: Class
  date: string
  time: string
}) {
  const { classData, date, time } = props
  const studentResults = buildMockStudentExamResults({
    className: classData.name,
    students: classData.students,
  })

  return (
    <div className="flex h-[724px] w-[440px] flex-col gap-5">
      <ScoreInsightCard averages={mockClassAverageData} />
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
  averages: typeof mockClassAverageData
}) {
  const { averages } = props

  return (
    <section className="rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">
        Дүнгийн мэдээлэл
      </h2>
      <p className="mt-1 text-[13px] text-[#8a96b2]">
        Сурагчдын дундаж үнэлгээ.
      </p>

      <div className="mt-4 rounded-[20px] border border-[#eef3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(251,252,255,0.96)_100%)] p-3">
        <TeacherClassesAverageChart averages={averages} />
      </div>
    </section>
  )
}
