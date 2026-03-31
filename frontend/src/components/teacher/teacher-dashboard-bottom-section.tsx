"use client"

import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Class, Exam } from "@/lib/mock-data-types"
import { formatCompactDate } from "@/lib/teacher-dashboard-utils"

export function TeacherDashboardBottomSection(props: {
  classes: Class[]
  visibleCompletedCount: number
  visibleUpcomingExams: Exam[]
}) {
  const { classes, visibleCompletedCount, visibleUpcomingExams } = props

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
      <Card className="panel-surface rounded-[2rem] border-0">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#233a63]">Удахгүй болох шалгалтууд</h2>
              <p className="mt-1 text-sm text-[#7386a6]">Хуваарьтай шалгалт бүр холбоостой.</p>
            </div>
            <Link href="/teacher/exams" className="text-sm font-medium text-[#5b8cff] hover:text-[#3d6ef4]">Бүгдийг харах</Link>
          </div>
          <div className="mt-5 space-y-3">
            {visibleUpcomingExams.map((exam) => (
              <div key={exam.id} className="rounded-[1.5rem] border border-[#e5eeff] bg-white p-4 shadow-[0_10px_24px_rgba(92,131,199,0.08)]">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#28416b]">{exam.title}</h3>
                      <Badge className="rounded-full bg-[#eef4ff] text-[#5d79a7] hover:bg-[#eef4ff]">{exam.duration} мин</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#7386a6]">{exam.questions.length} асуулт • {exam.scheduledClasses.length} анги хуваарьтай</p>
                  </div>
                  <Link href={`/teacher/exams/${exam.id}/edit`} className="rounded-full border border-[#dce8ff] bg-white px-4 py-2 text-sm font-medium text-[#5b759d] hover:bg-[#f8fbff]">Засах</Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {exam.scheduledClasses.map((schedule) => (
                    <Link key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`} href={`/teacher/classes/${schedule.classId}/exam/${exam.id}`} className="inline-flex items-center rounded-full border border-[#e2ebff] bg-[#fbfdff] px-3 py-1.5 text-xs font-medium text-[#627a9e] hover:border-[#cddfff] hover:bg-white">
                      {schedule.classId} • {formatCompactDate(schedule.date)} • {schedule.time}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="panel-surface rounded-[2rem] border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#233a63]">Ангиудын тойм</h2>
              <p className="mt-1 text-sm text-[#7386a6]">Идэвхтэй ангиуд руугаа шууд орно.</p>
            </div>
            <Users className="h-5 w-5 text-[#8c9fbd]" />
          </div>
          <div className="mt-5 space-y-3">
            {classes.map((currentClass) => (
              <Link key={currentClass.id} href={`/teacher/classes/${currentClass.id}`} className="flex items-center justify-between rounded-[1.35rem] border border-[#e4edff] bg-white p-4 transition-transform hover:-translate-y-0.5">
                <div>
                  <p className="font-semibold text-[#28416b]">{currentClass.name}</p>
                  <p className="text-sm text-[#7386a6]">{currentClass.students.length} сурагч</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#91a5c3]" />
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[#e5edff] bg-[#f8fbff] p-4">
            <p className="text-sm font-semibold text-[#28416b]">Дууссан шалгалт</p>
            <p className="mt-1 text-3xl font-bold text-[#233a63]">{visibleCompletedCount}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
