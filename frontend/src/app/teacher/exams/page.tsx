"use client"

import * as React from "react"
import Link from "next/link"
import { CircleAlert } from "lucide-react"
import { TeacherExamsSection } from "@/components/teacher/teacher-exams-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getLegacyTeacherExams, getTeacherExams, type TeacherExam } from "@/lib/teacher-exams"

export default function ExamsPage() {
  const [backendExams, setBackendExams] = React.useState<TeacherExam[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const exams = await getTeacherExams()
        if (!isMounted) return
        setBackendExams(exams)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : "Failed to load exams.")
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
      (exam, index, collection) => collection.findIndex((entry) => entry.id === exam.id) === index,
    )
  }, [backendExams])

  const draftExams = exams.filter((exam) => exam.status === "draft")
  const scheduledExams = exams.filter((exam) => exam.status === "scheduled")
  const completedExams = exams.filter((exam) => exam.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-muted-foreground">Create and manage your exams</p>
        </div>
        <Link href="/teacher/exams/create">
          <Button>Create New Exam</Button>
        </Link>
      </div>

      {error ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not refresh backend exams</AlertTitle>
          <AlertDescription>
            {error} Legacy mock exams are still shown below while the exam flow is being migrated.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Loading exams...
        </div>
      ) : null}

      <TeacherExamsSection emptyLabel="No scheduled exams" exams={scheduledExams} title="Scheduled Exams" />
      <TeacherExamsSection emptyLabel="No completed exams" exams={completedExams} title="Completed Exams" />

      {draftExams.length > 0 ? (
        <TeacherExamsSection emptyLabel="No drafts" exams={draftExams} title="Drafts" />
      ) : null}
    </div>
  )
}
