"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock3 } from "lucide-react"
import type { Class, ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buildClassOverviewMetrics, buildExamInsightCards } from "@/lib/teacher-classes-overview"
import { TeacherClassesHeader } from "@/components/teacher/teacher-classes-header"
import { TeacherClassScoreChart } from "@/components/teacher/teacher-class-score-chart"
import { OverviewInsightCard } from "@/components/teacher/teacher-classes-overview-cards"
import { TeacherClassesRosterPanel } from "@/components/teacher/teacher-classes-roster-panel"
import type { TeacherStudentRegistrationInput } from "@/lib/teacher-student-registry"

export function TeacherClassesOverview(props: TeacherClassesOverviewProps) {
  const { classData, classOptions, examResults, onAddStudent, onClassChange, onSemesterChange, selectedExam, selectedExamResults, selectedSemester, semesterOptions, visibleCompletedExams } = props
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = buildClassOverviewMetrics({ classData, exams: visibleCompletedExams, results: examResults })
  const statCards = buildExamInsightCards(selectedExam, selectedExamResults)
  const currentDateLabel = now.toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" })
  const currentTimeLabel = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-5">
      <TeacherClassesHeader
        classData={classData}
        classOptions={classOptions}
        currentDateLabel={currentDateLabel}
        metrics={metrics}
        onClassChange={onClassChange}
        onSemesterChange={onSemesterChange}
        selectedSemester={selectedSemester}
        semesterOptions={semesterOptions}
      />

      <section className="grid gap-4 xl:grid-cols-[900px_440px] xl:items-start">
        <div className="flex h-[724px] flex-col rounded-[30px] bg-white/96 px-4 pb-[45px] pt-4 shadow-[0_24px_68px_rgba(170,190,225,0.2)]">
          <div className="mb-3 w-full max-w-[856px] self-center pl-[40px]">
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="exam-result">
                <SelectTrigger className="h-[42px] min-w-[196px] rounded-full border border-[#e5e9f2] bg-white px-4 text-[20px] font-semibold text-[#5b5b73] shadow-none">
                  <SelectValue placeholder="Шалгалтын дүн" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-[14px]" value="exam-result">Шалгалтын дүн</SelectItem>
                  <SelectItem className="text-[14px]" value="exam-quality">Шалгалтын чанар</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#a1acc2]">
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />{currentDateLabel}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />Өнөөдөр - {currentTimeLabel}</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-start justify-center">
            <TeacherClassScoreChart exam={selectedExam} results={selectedExamResults} students={classData.students} />
          </div>

          <div className="mt-4 grid h-[108px] w-[864px] grid-cols-3 gap-3 self-center">
            {statCards.map((card) => <OverviewInsightCard key={card.label} card={card} />)}
          </div>
        </div>

        <TeacherClassesRosterPanel classData={classData} date={currentDateLabel} onAddStudent={onAddStudent} time={currentTimeLabel} />
      </section>
    </div>
  )
}

type TeacherClassesOverviewProps = {
  classData: Class
  classOptions: Class[]
  examResults: ExamResult[]
  onAddStudent: (input: TeacherStudentRegistrationInput) => Promise<void>
  onClassChange: (value: string) => void
  onSemesterChange: (value: string) => void
  selectedExam: TeacherExam | null
  selectedExamResults: ExamResult[]
  selectedSemester: string
  semesterOptions: string[]
  visibleCompletedExams: TeacherExam[]
}
