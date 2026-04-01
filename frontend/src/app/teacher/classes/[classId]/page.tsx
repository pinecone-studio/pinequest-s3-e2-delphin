"use client"

import { use, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TeacherClassDetailView } from "@/components/teacher/teacher-class-detail-view"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { classes } from "@/lib/mock-data"
import { getClassById } from "@/lib/mock-data-helpers"
import { getSemesterLabel, mergeTeacherExams } from "@/lib/teacher-class-detail"
import { loadStudentExamResults } from "@/lib/student-exam-results"
import { getLegacyTeacherExams, getTeacherExams, type TeacherExam } from "@/lib/teacher-exams"
import type { ExamResult } from "@/lib/mock-data-types"

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = use(params)
  const classData = getClassById(classId)
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [allExams, setAllExams] = useState<TeacherExam[]>(() => getLegacyTeacherExams())
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      try {
        const [backendExams, results] = await Promise.all([
          getTeacherExams().catch(() => []),
          loadStudentExamResults({ classId }),
        ])
        if (!isMounted) return
        setAllExams(mergeTeacherExams([...getLegacyTeacherExams(), ...backendExams]))
        setExamResults(results)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPage()
    return () => {
      isMounted = false
    }
  }, [classId])

  const completedExams = useMemo(
    () =>
      allExams.filter(
        (exam) =>
          exam.status === "completed" &&
          exam.scheduledClasses.some((schedule) => schedule.classId === classId),
      ),
    [allExams, classId],
  )

  const semesterOptions = useMemo(() => {
    const labels = completedExams
      .map((exam) => exam.scheduledClasses.find((schedule) => schedule.classId === classId)?.date)
      .filter((date): date is string => Boolean(date))
      .map(getSemesterLabel)

    return Array.from(new Set(labels)).sort((left, right) => right.localeCompare(left))
  }, [classId, completedExams])

  const visibleCompletedExams = useMemo(() => {
    if (selectedSemester === "all") {
      return completedExams
    }

    return completedExams.filter((exam) => {
      const examDate = exam.scheduledClasses.find((schedule) => schedule.classId === classId)?.date
      return examDate ? getSemesterLabel(examDate) === selectedSemester : false
    })
  }, [classId, completedExams, selectedSemester])

  useEffect(() => {
    if (!visibleCompletedExams.some((exam) => exam.id === selectedExamId)) {
      setSelectedExamId(visibleCompletedExams[0]?.id ?? null)
    }
  }, [selectedExamId, visibleCompletedExams])

  const selectedExamResults = useMemo(
    () => examResults.filter((result) => result.examId === selectedExamId),
    [examResults, selectedExamId],
  )

  if (!classData) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Анги олдсонгүй</h1>
        <Link href="/teacher/classes">
          <Button className="mt-4">Ангиуд руу буцах</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Ангийн тайланг ачааллаж байна...
      </div>
    )
  }

  return (
    <TeacherClassDetailView
      classData={classData}
      classOptions={classes}
      examResults={examResults}
      onClassChange={(value) =>
        startTransition(() => {
          router.push(`/teacher/classes/${value}`)
        })
      }
      onExamSelect={setSelectedExamId}
      onSemesterChange={setSelectedSemester}
      selectedExamId={selectedExamId}
      selectedExamResults={selectedExamResults}
      selectedSemester={selectedSemester}
      semesterOptions={semesterOptions}
      visibleCompletedExams={visibleCompletedExams}
    />
  )
}
