"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { TeacherExamAttemptsTable } from "@/components/teacher/teacher-exam-attempts-table"
import { TeacherExamResultsTable } from "@/components/teacher/teacher-exam-results-table"
import { TeacherQuestionAnalysisCard } from "@/components/teacher/teacher-question-analysis-card"
import type { ExamResult } from "@/lib/mock-data"
import { getClassById, getStudentById } from "@/lib/mock-data-helpers"
import { loadStudentExamAttempts, type StudentExamAttempt } from "@/lib/student-exam-attempts"
import { loadStudentExamResults, submitStudentExamResult } from "@/lib/student-exam-results"
import { getAnswerReviewState, isManualReviewQuestionType } from "@/lib/student-report-view"
import { getLegacyTeacherExams, getTeacherExams, type TeacherExam } from "@/lib/teacher-exams"

function getAnswerPoints(questionPoints: number, awardedPoints: number | null | undefined, isCorrect: boolean | null) {
  if (typeof awardedPoints === "number") {
    return awardedPoints
  }

  return isCorrect ? questionPoints : 0
}

export default function ExamStatsPage({
  params,
}: {
  params: Promise<{ classId: string; examId: string }>
}) {
  const { classId, examId } = use(params)
  const classData = getClassById(classId)
  const [allExams, setAllExams] = useState<TeacherExam[]>(() => getLegacyTeacherExams())
  const [results, setResults] = useState<ExamResult[]>([])
  const [attempts, setAttempts] = useState<StudentExamAttempt[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [draftScores, setDraftScores] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      try {
        const [backendExams, nextResults, nextAttempts] = await Promise.all([
          getTeacherExams().catch(() => []),
          loadStudentExamResults({ examId, classId }),
          loadStudentExamAttempts({ examId, classId }),
        ])

        if (!isMounted) {
          return
        }

        const mergedExams = [...getLegacyTeacherExams(), ...backendExams].filter(
          (exam, index, collection) => collection.findIndex((entry) => entry.id === exam.id) === index,
        )

        setAllExams(mergedExams)
        setResults(nextResults)
        setAttempts(nextAttempts)
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
  }, [classId, examId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])

  const filteredResults = useMemo(() => {
    const classStudentIds = new Set((classData?.students ?? []).map((student) => student.id))
    return results.filter((result) => result.examId === examId && classStudentIds.has(result.studentId))
  }, [classData?.students, examId, results])

  const pendingResults = useMemo(() => {
    if (!exam) {
      return []
    }

    return filteredResults.filter((result) =>
      exam.questions.some((question) =>
        getAnswerReviewState(
          question,
          result.answers.find((answer) => answer.questionId === question.id),
        ) === "pending",
      ),
    )
  }, [exam, filteredResults])

  useEffect(() => {
    if (!selectedStudentId) {
      setSelectedStudentId(pendingResults[0]?.studentId ?? filteredResults[0]?.studentId ?? null)
      return
    }

    const selectedStillVisible = filteredResults.some((result) => result.studentId === selectedStudentId)
    if (!selectedStillVisible && filteredResults.length > 0) {
      setSelectedStudentId(pendingResults[0]?.studentId ?? filteredResults[0]?.studentId ?? null)
    }
  }, [filteredResults, pendingResults, selectedStudentId])

  const selectedResult = filteredResults.find((result) => result.studentId === selectedStudentId) ?? null

  useEffect(() => {
    if (!exam || !selectedResult) {
      setDraftScores({})
      return
    }

    const nextDraftScores: Record<string, string> = {}

    exam.questions.forEach((question) => {
      if (!isManualReviewQuestionType(question.type)) {
        return
      }

      const answer = selectedResult.answers.find((entry) => entry.questionId === question.id)
      if (!answer?.answer.trim()) {
        return
      }

      nextDraftScores[question.id] = typeof answer.awardedPoints === "number" ? String(answer.awardedPoints) : ""
    })

    setDraftScores(nextDraftScores)
  }, [exam, selectedResult])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Шалгалтын үнэлгээний хуудсыг ачааллаж байна...
      </div>
    )
  }

  if (!classData || !exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Энэ шалгалтын мэдээлэл backend-ээс ирээгүй эсвэл тухайн ангид холбогдоогүй байна.
        </p>
        <Link href={`/teacher/classes/${classId}`}>
          <Button className="mt-4">Анги руу буцах</Button>
        </Link>
      </div>
    )
  }

  const avgScore = filteredResults.length > 0
    ? Math.round(
        filteredResults.reduce((sum, result) => sum + (result.score / result.totalPoints) * 100, 0) /
          filteredResults.length,
      )
    : 0

  const submittedCount = filteredResults.length
  const inProgressCount = attempts.filter(
    (attempt) =>
      attempt.classId === classId &&
      attempt.examId === examId &&
      attempt.status === "in_progress" &&
      !filteredResults.some((result) => result.studentId === attempt.studentId),
  ).length
  const notStartedCount = Math.max(classData.students.length - submittedCount - inProgressCount, 0)

  const questionStats = exam.questions.map((question) => {
    const answers = filteredResults.flatMap((result) =>
      result.answers.filter((answer) => answer.questionId === question.id && answer.answer.trim()),
    )
    const correctCount = answers.filter((answer) => answer.isCorrect).length
    const totalCount = answers.length

    return {
      questionId: question.id,
      question: question.question,
      type: question.type,
      correctCount,
      totalCount,
      failRate: totalCount > 0 ? ((totalCount - correctCount) / totalCount) * 100 : 0,
    }
  })

  const selectedStudent = selectedResult ? getStudentById(selectedResult.studentId) : null
  const manualQuestions = exam.questions.filter((question) => isManualReviewQuestionType(question.type))
  const reviewQuestions = manualQuestions
    .map((question) => ({
      question,
      answer: selectedResult?.answers.find((entry) => entry.questionId === question.id),
    }))
    .filter((entry) => entry.answer?.answer.trim())
  const hasPendingForSelectedStudent = selectedResult
    ? pendingResults.some((result) => result.studentId === selectedResult.studentId)
    : false

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setIsReviewDialogOpen(true)
  }

  const handleSaveReview = async () => {
    if (!selectedResult || !selectedStudent) {
      return
    }

    setIsSaving(true)

    try {
      const updatedAnswers = selectedResult.answers.map((answer) => {
        const question = exam.questions.find((entry) => entry.id === answer.questionId)
        if (!question || !isManualReviewQuestionType(question.type) || !answer.answer.trim()) {
          return answer
        }

        const rawScore = draftScores[question.id]
        const parsedScore = Number(rawScore)
        const clampedScore = Number.isFinite(parsedScore)
          ? Math.min(question.points, Math.max(0, parsedScore))
          : 0

        return {
          ...answer,
          awardedPoints: clampedScore,
          reviewStatus: "graded" as const,
          isCorrect: clampedScore === question.points ? true : clampedScore === 0 ? false : null,
        }
      })

      const score = exam.questions.reduce((sum, question) => {
        const answer = updatedAnswers.find((entry) => entry.questionId === question.id)
        return sum + getAnswerPoints(question.points, answer?.awardedPoints, answer?.isCorrect ?? null)
      }, 0)

      const savedResult = await submitStudentExamResult({
        examId: exam.id,
        studentId: selectedResult.studentId,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId,
        answers: updatedAnswers,
        score,
        totalPoints: selectedResult.totalPoints,
        submittedAt: selectedResult.submittedAt,
      })

      setResults((current) =>
        current.map((result) =>
          result.examId === savedResult.examId && result.studentId === savedResult.studentId ? savedResult : result,
        ),
      )
      setIsReviewDialogOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-sky-200 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_100%)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link href={`/teacher/classes/${classId}`} className="text-sm text-muted-foreground hover:underline">
              &larr; {classData.name} руу буцах
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{exam.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {classData.name}-ийн шалгалтын явц, илгээсэн сурагчид, хүлээгдэж буй гар үнэлгээ бүгд энэ хуудсан дээр байна.
              </p>
            </div>
          </div>
          <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Илгээсэн</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{submittedCount}</div>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Өгч байна</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{inProgressCount}</div>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Хүлээгдэж буй</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{pendingResults.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Анги</CardDescription>
            <CardTitle className="text-2xl">{classData.name}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Сурагчдын тоо</CardDescription>
            <CardTitle className="text-2xl">{classData.students.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Дундаж оноо</CardDescription>
            <CardTitle className="text-2xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Эхлээгүй</CardDescription>
            <CardTitle className="text-2xl">{notStartedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <TeacherExamAttemptsTable
        attempts={attempts}
        results={filteredResults}
        classData={classData}
        selectedStudentId={selectedStudentId}
        onReview={handleSelectStudent}
      />

      <TeacherExamResultsTable
        exam={exam}
        results={filteredResults}
        selectedStudentId={selectedStudentId}
        onReview={handleSelectStudent}
      />

      <TeacherQuestionAnalysisCard questionStats={questionStats} />

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader className="space-y-3">
            <DialogTitle>
              {selectedStudent ? `${selectedStudent.name} · ${classData.name}` : "Илгээсэн сурагч"}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent
                ? "Энд тухайн сурагчийн задгай хариултууд, одоогийн оноо, хүлээгдэж буй үнэлгээний төлөв харагдана."
                : "Сурагчийн хариултыг шалгах цонх."}
            </DialogDescription>

            {selectedResult && selectedStudent ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Одоогийн оноо</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {selectedResult.score}/{selectedResult.totalPoints}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Илгээсэн хугацаа</div>
                  <div className="mt-2 text-sm font-medium leading-6 text-slate-900">
                    {new Date(selectedResult.submittedAt).toLocaleString("mn-MN")}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Үнэлгээний төлөв</div>
                  <div className="mt-2 text-sm font-medium leading-6 text-slate-900">
                    {hasPendingForSelectedStudent
                      ? `Энэ сурагчийн ${reviewQuestions.length} задгай хариултанд оноо өгөх шаардлагатай байна.`
                      : "Энэ сурагчийн бүх задгай хариултад оноо өгч дууссан байна."}
                  </div>
                </div>
              </div>
            ) : null}
          </DialogHeader>

          <div className="space-y-4">
            {selectedResult && selectedStudent ? (
              <>
                {reviewQuestions.length > 0 ? (
                  reviewQuestions.map(({ question, answer }) => {
                    const reviewState = getAnswerReviewState(question, answer)

                    return (
                      <div key={question.id} className="rounded-2xl border border-sky-100 bg-sky-50/30 p-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-sky-700">
                            Асуулт {exam.questions.findIndex((entry) => entry.id === question.id) + 1} ·{" "}
                            {question.type === "essay" ? "Эсээ" : "Богино хариулт"} · {question.points} оноо
                          </p>
                          <h3 className="text-base font-semibold text-slate-900">{question.question}</h3>
                          <p className="text-sm text-slate-600">
                            {reviewState === "pending"
                              ? "Энэ хариулт одоогоор үнэлгээ хүлээж байна. Доор оноо оруулж хадгална уу."
                              : "Энэ хариултад оноо өгсөн байна. Хэрэв шаардлагатай бол оноог шинэчилж болно."}
                          </p>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                          <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Сурагчийн хариулт
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{answer?.answer}</p>
                          </div>
                          <div className="rounded-xl border-2 border-sky-200 bg-white p-4 shadow-sm">
                            <label htmlFor={`score-${question.id}`} className="text-sm font-semibold text-slate-700">
                              Өгөх оноо
                            </label>
                            <Input
                              id={`score-${question.id}`}
                              type="number"
                              min={0}
                              max={question.points}
                              step={1}
                              value={draftScores[question.id] ?? ""}
                              onChange={(event) =>
                                setDraftScores((current) => ({ ...current, [question.id]: event.target.value }))
                              }
                              className="mt-3 h-12 border-2 border-sky-300 bg-sky-50 text-base font-semibold text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-sky-200"
                            />
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              0-{question.points} хүртэл оноо оруулна. Хадгалсны дараа сурагчийн тайлан болон нийт оноо
                              шууд шинэчлэгдэнэ.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                    <AlertCircle className="h-4 w-4" />
                    Энэ сурагчид гараар үнэлэх задгай хариулт алга.
                  </div>
                )}
              </>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Хаах
            </Button>
            <Button onClick={() => void handleSaveReview()} disabled={isSaving || reviewQuestions.length === 0}>
              {isSaving ? "Хадгалж байна..." : "Үнэлгээ хадгалах"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
