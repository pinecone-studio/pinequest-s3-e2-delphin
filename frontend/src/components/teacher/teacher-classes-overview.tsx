"use client"

import { useCurrentTime } from "@/hooks/use-current-time"
import type { Class, ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import { buildClassOverviewMetrics } from "@/lib/teacher-classes-overview"
import { formatHeaderDate, formatTimeLabel } from "@/lib/teacher-dashboard-utils"
import { TeacherClassesHeader } from "@/components/teacher/teacher-classes-header"
import { TeacherClassScoreChart } from "@/components/teacher/teacher-class-score-chart"
import { TeacherClassesSidePanels } from "@/components/teacher/teacher-classes-side-panels"
import type { TeacherStudentRegistrationInput } from "@/lib/teacher-student-registry"

export function TeacherClassesOverview(props: TeacherClassesOverviewProps) {
  const { classData, classOptions, examResults, onClassChange, onSemesterChange, selectedExam, selectedExamResults, selectedSemester, semesterOptions, visibleCompletedExams } = props
  const now = useCurrentTime()

  const metrics = buildClassOverviewMetrics({ classData, exams: visibleCompletedExams, results: examResults })
  const currentDateLabel = now ? formatHeaderDate(now) : "Огноо ачаалж байна"
  const currentTimeLabel = now ? formatTimeLabel(now) : "--:--"

  return (
    <div className="space-y-5">
      <TeacherClassesHeader
        classData={classData}
        classOptions={classOptions}
        metrics={metrics}
        onClassChange={onClassChange}
        onSemesterChange={onSemesterChange}
        selectedSemester={selectedSemester}
        semesterOptions={semesterOptions}
      />

      <section className="grid gap-5 xl:grid-cols-[900px_440px] xl:items-start">
        <div className="flex h-[724px] w-[900px] max-w-[900px] flex-col rounded-[16px] border border-[#ededed] bg-[linear-gradient(233deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] px-[18px] pb-[18px] pt-4 shadow-[50px_38px_102px_rgba(120,118,148,0.14)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]">
          <div className="flex min-h-0 flex-1 items-start justify-center">
            <TeacherClassScoreChart exam={selectedExam} results={selectedExamResults} students={classData.students} />
          </div>
        </div>

        <TeacherClassesSidePanels classData={classData} date={currentDateLabel} time={currentTimeLabel} />
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
