"use client"

import { useEffect, useMemo, useState } from "react"
import { TeacherClassesOverview } from "@/components/teacher/teacher-classes-overview"
import { Spinner } from "@/components/ui/spinner"
import { classes } from "@/lib/mock-data"
import { getSemesterLabel, mergeTeacherExams } from "@/lib/teacher-class-detail"
import { loadStudentExamResults } from "@/lib/student-exam-results"
import {
  getTeacherManagedClasses,
  registerTeacherStudent,
  type TeacherStudentRegistrationInput,
} from "@/lib/teacher-student-registry"
import { getLegacyTeacherExams, getTeacherExams, type TeacherExam } from "@/lib/teacher-exams"
import type { Class, ExamResult } from "@/lib/mock-data-types"

export default function ClassesPage() {
  const [classOptions, setClassOptions] = useState<Class[]>(() => classes)
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? "")
  const [allExams, setAllExams] = useState<TeacherExam[]>(() => getLegacyTeacherExams())
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)

  useEffect(() => {
    setClassOptions(getTeacherManagedClasses())
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      try {
        const [backendExams, results] = await Promise.all([
          getTeacherExams().catch(() => []),
          loadStudentExamResults(),
        ])
        if (!isMounted) return
        setAllExams(mergeTeacherExams([...getLegacyTeacherExams(), ...backendExams]))
        setExamResults(results)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadPage()
    return () => {
      isMounted = false
    }
  }, [])

  const classData = classOptions.find((item) => item.id === selectedClassId) ?? classOptions[0]
  const classStudentIds = useMemo(
    () => new Set((classData?.students ?? []).map((student) => student.id)),
    [classData],
  )

  const completedExams = useMemo(
    () =>
      allExams.filter(
        (exam) =>
          exam.status === "completed" &&
          exam.scheduledClasses.some((schedule) => schedule.classId === classData?.id),
      ),
    [allExams, classData?.id],
  )

  const semesterOptions = useMemo(() => {
    const labels = completedExams
      .map((exam) => exam.scheduledClasses.find((schedule) => schedule.classId === classData?.id)?.date)
      .filter((date): date is string => Boolean(date))
      .map(getSemesterLabel)

    return Array.from(new Set(labels)).sort((left, right) => right.localeCompare(left))
  }, [classData?.id, completedExams])

  const visibleCompletedExams = useMemo(() => {
    if (selectedSemester === "all") return completedExams

    return completedExams.filter((exam) => {
      const examDate = exam.scheduledClasses.find((schedule) => schedule.classId === classData?.id)?.date
      return examDate ? getSemesterLabel(examDate) === selectedSemester : false
    })
  }, [classData?.id, completedExams, selectedSemester])

  useEffect(() => {
    setSelectedSemester("all")
  }, [selectedClassId])

  useEffect(() => {
    if (!visibleCompletedExams.some((exam) => exam.id === selectedExamId)) {
      setSelectedExamId(visibleCompletedExams[0]?.id ?? null)
    }
  }, [selectedExamId, visibleCompletedExams])

  const classExamResults = useMemo(
    () =>
      examResults.filter(
        (result) =>
          result.classId === classData?.id || classStudentIds.has(result.studentId),
      ),
    [classData?.id, classStudentIds, examResults],
  )

  const selectedExamResults = useMemo(
    () => classExamResults.filter((result) => result.examId === selectedExamId),
    [classExamResults, selectedExamId],
  )
  const selectedExam =
    visibleCompletedExams.find((exam) => exam.id === selectedExamId) ?? visibleCompletedExams[0] ?? null

  if (!classData || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Ангийн тайланг ачааллаж байна...
      </div>
    )
  }

  const handleAddStudent = async (input: TeacherStudentRegistrationInput) => {
    const nextClasses = await registerTeacherStudent(input)
    setClassOptions(nextClasses)
  }

  return (
    <TeacherClassesOverview
      classData={classData}
      classOptions={classOptions}
      examResults={classExamResults}
      onAddStudent={handleAddStudent}
      onClassChange={setSelectedClassId}
      onSemesterChange={setSelectedSemester}
      selectedExam={selectedExam}
      selectedExamResults={selectedExamResults}
      selectedSemester={selectedSemester}
      semesterOptions={semesterOptions}
      visibleCompletedExams={visibleCompletedExams}
    />
  )
}
