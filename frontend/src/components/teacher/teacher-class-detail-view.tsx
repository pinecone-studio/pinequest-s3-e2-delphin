"use client"

import Link from "next/link"
import { ArrowRight, ChevronLeft } from "lucide-react"
import type { Class, ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExamAverage, getExamTotalPoints, getSemesterLabel } from "@/lib/teacher-class-detail"
import { TeacherClassScoreChart } from "@/components/teacher/teacher-class-score-chart"
import { TeacherClassStudentsTable } from "@/components/teacher/teacher-class-students-table"

export function TeacherClassDetailView({
  classData,
  classOptions,
  examResults,
  onClassChange,
  onExamSelect,
  onSemesterChange,
  selectedExamId,
  selectedExamResults,
  selectedSemester,
  semesterOptions,
  showBackLink = true,
  title,
  visibleCompletedExams,
}: TeacherClassDetailViewProps) {
  const selectedExam = visibleCompletedExams.find((exam) => exam.id === selectedExamId) ?? null

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#dbe7ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(241,247,255,0.88)_100%)] p-6 shadow-[0_28px_90px_rgba(120,152,212,0.18)] dark:border-[rgba(82,116,188,0.22)] dark:bg-[radial-gradient(circle_at_top,rgba(28,102,251,0.18)_0%,transparent_38%),linear-gradient(180deg,#0c1439_0%,#091235_100%)]">
        {showBackLink ? (
          <Link
            href="/teacher/classes"
            className="inline-flex items-center gap-2 text-sm text-[#6f7982] transition-colors hover:text-[#141a1f] dark:text-[#aeb8d8] dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Ангиуд руу буцах
          </Link>
        ) : null}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#7f8fb0] dark:text-[#7f95d2]">
              Class analytics
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#141a1f] dark:text-white">
              {title ?? classData.name}
            </h1>
            <p className="mt-2 text-sm text-[#6f7982] dark:text-[#aeb8d8]">
              {classData.students.length} сурагч бүртгэлтэй, completed шалгалтууд нь
              `Шалгалтууд` хэсгийн data source-оос орж ирнэ.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select onValueChange={onClassChange} value={classData.id}>
              <SelectTrigger className="h-12 min-w-[220px] rounded-full border-[#dbe7ff] bg-white/90 px-5 dark:border-[rgba(82,116,188,0.22)] dark:bg-[#0b163d]">
                <SelectValue placeholder="Ангиа сонгох" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((courseClass) => (
                  <SelectItem key={courseClass.id} value={courseClass.id}>
                    {courseClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={onSemesterChange} value={selectedSemester}>
              <SelectTrigger className="h-12 min-w-[220px] rounded-full border-[#dbe7ff] bg-white/90 px-5 dark:border-[rgba(82,116,188,0.22)] dark:bg-[#0b163d]">
                <SelectValue placeholder="Бүх улирал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх улирал</SelectItem>
                {semesterOptions.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[#141a1f] dark:text-white">
            Шалгалтын түүх
          </h2>
          <p className="mt-1 text-sm text-[#6f7982] dark:text-[#aeb8d8]">
            Картаас шалгалтаа сонгоод доорх график дээр асуулт тус бүрийн гүйцэтгэлийг харна.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleCompletedExams.map((exam) => {
            const schedule = exam.scheduledClasses.find((item) => item.classId === classData.id)
            const results = examResults.filter((result) => result.examId === exam.id)
            const isSelected = exam.id === selectedExamId

            return (
              <Card
                key={exam.id}
                className={`rounded-[28px] border transition-all ${
                  isSelected
                    ? "border-[#3c7ef7] bg-[#eef5ff] shadow-[0_26px_70px_rgba(60,126,247,0.18)] dark:border-[#4f8cff] dark:bg-[#0d1b49]"
                    : "border-[#dbe7ff] bg-white/90 shadow-[0_24px_60px_rgba(120,152,212,0.14)] dark:border-[rgba(82,116,188,0.22)] dark:bg-[#091235]"
                }`}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[#6f7982] dark:text-[#aeb8d8]">
                        {schedule?.date} · {schedule?.time}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[#141a1f] dark:text-white">
                        {exam.title}
                      </h3>
                    </div>
                    {schedule?.date ? (
                      <Badge className="rounded-full bg-[#dce9ff] px-3 py-1 text-[#275ccf] dark:bg-[#17306f] dark:text-[#d6e4ff]">
                        {getSemesterLabel(schedule.date)}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">{exam.questions.length} асуулт</Badge>
                    <Badge variant="outline">{getExamTotalPoints(exam)} оноо</Badge>
                    <Badge variant="secondary">{getExamAverage(results)}%</Badge>
                    <Badge variant="outline">{results.length} илгээлт</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="rounded-full"
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => onExamSelect(exam.id)}
                    >
                      {isSelected ? "Сонгогдсон" : "Графикт харах"}
                    </Button>
                    <Button asChild className="rounded-full" variant="ghost">
                      <Link href={`/teacher/classes/${classData.id}/exam/${exam.id}`}>
                        Үр дүн, үнэлгээ
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <TeacherClassScoreChart
        exam={selectedExam}
        results={selectedExamResults}
        students={classData.students}
      />
      <TeacherClassStudentsTable classData={classData} />
    </div>
  )
}

type TeacherClassDetailViewProps = {
  classData: Class
  classOptions: Class[]
  examResults: ExamResult[]
  onClassChange: (value: string) => void
  onExamSelect: (value: string) => void
  onSemesterChange: (value: string) => void
  selectedExamId: string | null
  selectedExamResults: ExamResult[]
  selectedSemester: string
  semesterOptions: string[]
  showBackLink?: boolean
  title?: string
  visibleCompletedExams: TeacherExam[]
}
