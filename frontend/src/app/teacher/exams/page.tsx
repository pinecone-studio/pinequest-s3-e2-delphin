"use client"

import * as React from "react"
import Link from "next/link"
import {
  TeacherPageHeader,
  TeacherPageShell,
  TeacherPageStatCard,
  TeacherPageStatGrid,
} from "@/components/teacher/teacher-page-primitives"
import { TeacherExamsSection } from "@/components/teacher/teacher-exams-section"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams"
import { ClipboardList, FileClock, PlayCircle, Trophy } from "lucide-react"

function isExamOngoing(exam: TeacherExam, now = new Date()) {
  if (exam.status !== "scheduled") {
    return false
  }

  return exam.scheduledClasses.some((schedule) => {
    const start = new Date(`${schedule.date}T${schedule.time}:00`)
    const end = new Date(start.getTime() + exam.duration * 60 * 1000)
    return now >= start && now <= end
  })
}

export default function ExamsPage() {
  const [backendExams, setBackendExams] = React.useState<TeacherExam[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const exams = await getTeacherExams()
        if (!isMounted) return
        setBackendExams(exams)
      } catch (loadError) {
        if (!isMounted) return
        console.warn("Backend-ээс багшийн шалгалтуудыг сэргээж чадсангүй.", loadError)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const exams = React.useMemo(() => {
    const merged = [...getLegacyTeacherExams(), ...backendExams]
    return merged.filter(
      (exam, index, collection) =>
        collection.findIndex((entry) => entry.id === exam.id) === index,
    )
  }, [backendExams])

  const draftExams = exams.filter((exam) => exam.status === "draft")
  const completedExams = exams.filter((exam) => exam.status === "completed")
  const ongoingExams = exams.filter((exam) => isExamOngoing(exam))
  const scheduledExams = exams.filter(
    (exam) => exam.status === "scheduled" && !isExamOngoing(exam),
  )

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Шалгалтууд"
        description="Шалгалтын ноорог, товлолт, явц, дууссан үр дүнг нэг урсгалд харуулах шинэ shell суурь."
        icon={ClipboardList}
        eyebrow={<span>Дараагийн PR-д бүрэн Figma exam flow руу салгаж шилжүүлнэ.</span>}
        actions={
          <Link href="/teacher/question-bank/create">
            <Button>Шинэ асуултууд үүсгэх</Button>
          </Link>
        }
      />

      <TeacherPageStatGrid>
        <TeacherPageStatCard
          icon={PlayCircle}
          label="Явагдаж буй"
          value={`${ongoingExams.length} шалгалт`}
        />
        <TeacherPageStatCard
          icon={FileClock}
          label="Товлогдсон"
          tone="mint"
          value={`${scheduledExams.length} шалгалт`}
        />
        <TeacherPageStatCard
          icon={Trophy}
          label="Дууссан"
          tone="violet"
          value={`${completedExams.length} шалгалт`}
        />
      </TeacherPageStatGrid>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Шалгалтуудыг ачааллаж байна...
        </div>
      ) : null}

      <TeacherExamsSection
        actionLabelOverride="Анги руу орох"
        emptyLabel="Одоогоор явагдаж буй шалгалт алга"
        exams={ongoingExams}
        reviewMode="live"
        statusLabelOverride="Явагдаж байна"
        title="Одоогоор явагдаж буй шалгалтууд"
      />
      <TeacherExamsSection
        emptyLabel="Товлогдсон шалгалт алга"
        exams={scheduledExams}
        title="Товлогдсон шалгалтууд"
      />
      <TeacherExamsSection
        actionLabelOverride="Үр дүн, үнэлгээ"
        emptyLabel="Дууссан шалгалт алга"
        exams={completedExams}
        reviewMode="completed"
        title="Дууссан шалгалтууд"
      />

      {draftExams.length > 0 ? (
        <TeacherExamsSection
          emptyLabel="Ноорог алга"
          exams={draftExams}
          title="Нооргууд"
        />
      ) : null}
    </TeacherPageShell>
  )
}
