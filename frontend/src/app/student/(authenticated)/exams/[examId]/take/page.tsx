"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, Clock3, FileQuestion, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam, type ExamQuestion } from "@/lib/mock-data"
import {
  loadStudentExamResults,
  submitStudentExamResult,
} from "@/lib/student-exam-results"
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts"
import { isScheduleOpenNow } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

function normalizeAnswer(value: string | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function gradeQuestion(question: ExamQuestion, answer: string) {
  if (!answer.trim()) {
    return null
  }

  if (question.type === "short-answer" || question.type === "essay") {
    return null
  }

  if (!question.correctAnswer) {
    return null
  }

  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer)
}

function getAwardedPoints(question: ExamQuestion, answer: string, isCorrect: boolean | null) {
  if (!answer.trim()) {
    return 0
  }

  if (question.type === "short-answer" || question.type === "essay") {
    return null
  }

  return isCorrect ? question.points : 0
}

function getReviewStatus(question: ExamQuestion, answer: string, isCorrect: boolean | null) {
  if (!answer.trim()) {
    return undefined
  }

  if (question.type === "short-answer" || question.type === "essay") {
    return "pending" as const
  }

  return isCorrect ? "auto-correct" as const : "auto-wrong" as const
}

function getQuestionTypeLabel(question: ExamQuestion) {
  switch (question.type) {
    case "multiple-choice":
      return "Сонгох асуулт"
    case "true-false":
      return "Үнэн / Худал"
    case "short-answer":
      return "Богино хариулт"
    case "essay":
      return "Дэлгэрэнгүй хариулт"
    default:
      return "Асуулт"
  }
}

export default function StudentTakeExamPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const router = useRouter()
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([
          getStudentExams(),
          loadStudentExamResults({ examId, studentId }),
        ])

        if (!isMounted) return

        setAllExams(nextExams)
        setAlreadySubmitted(
          nextResults.some((result) => result.examId === examId && result.studentId === studentId),
        )
      } catch (error) {
        if (!isMounted) return
        console.warn("Failed to load the exam-taking page.", error)
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
  }, [examId, studentId])

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId])
  const schedule = exam?.scheduledClasses.find((entry) => entry.classId === studentClass)
  const isOpenNow = schedule && exam
    ? isScheduleOpenNow(schedule.date, schedule.time, exam.duration)
    : false

  useEffect(() => {
    if (!exam || !schedule || !isOpenNow || alreadySubmitted || !studentId) {
      return
    }

    void upsertStudentExamAttempt({
      examId: exam.id,
      studentId,
      studentName: studentName || "Сурагч",
      classId: studentClass,
      status: "in_progress",
      startedAt: new Date().toISOString(),
      submittedAt: null,
    })
  }, [alreadySubmitted, exam, isOpenNow, schedule, studentClass, studentId, studentName])

  const answeredCount = exam
    ? exam.questions.filter((question) => (answers[question.id] ?? "").trim().length > 0).length
    : 0
  const totalQuestions = exam?.questions.length ?? 0
  const completionPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Шалгалтыг ачаалж байна...</p>
  }

  if (!exam || !schedule) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  if (alreadySubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Энэ шалгалтыг аль хэдийн илгээсэн байна</h1>
        <p className="text-muted-foreground">
          Таны хариулт хадгалагдсан. Тайлангийн хуудсаас дүнгээ үзнэ үү.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/student/reports/${examId}`)}>Тайлан үзэх</Button>
          <Button variant="outline" onClick={() => router.push("/student/exams")}>
            Шалгалтууд руу буцах
          </Button>
        </div>
      </div>
    )
  }

  if (!isOpenNow) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Шалгалт одоогоор нээлттэй биш байна</h1>
        <p className="text-muted-foreground">
          Энэ шалгалтыг зөвхөн товлосон эхлэх хугацаанд өгөх боломжтой.
        </p>
        <Button variant="outline" onClick={() => router.push(`/student/exams/${examId}`)}>
          Шалгалтын дэлгэрэнгүй рүү буцах
        </Button>
      </div>
    )
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const scoredAnswers = exam.questions.map((question) => {
        const answer = answers[question.id] ?? ""
        const isCorrect = gradeQuestion(question, answer)

        return {
          questionId: question.id,
          answer,
          isCorrect,
          awardedPoints: getAwardedPoints(question, answer, isCorrect),
          reviewStatus: getReviewStatus(question, answer, isCorrect),
        }
      })

      const score = exam.questions.reduce((sum, question) => {
        const matchedAnswer = scoredAnswers.find((entry) => entry.questionId === question.id)
        return sum + (matchedAnswer?.awardedPoints ?? 0)
      }, 0)

      const totalPoints = exam.questions.reduce((sum, question) => sum + question.points, 0)

      await submitStudentExamResult({
        examId: exam.id,
        studentId,
        studentName: studentName || "Сурагч",
        classId: studentClass,
        answers: scoredAnswers,
        score,
        totalPoints,
        submittedAt: new Date().toISOString(),
      })

      await upsertStudentExamAttempt({
        examId: exam.id,
        studentId,
        studentName: studentName || "Сурагч",
        classId: studentClass,
        status: "submitted",
        startedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
      })

      router.push(`/student/reports/${exam.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Link href={`/student/exams/${exam.id}`} className="text-sm text-muted-foreground hover:underline">
                &larr; Шалгалтын дэлгэрэнгүй рүү буцах
              </Link>
              <div className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                      Оюутны шалгалт өгөх хэсэг
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{exam.title}</h1>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      Асуулт бүрийг анхааралтай уншаад хариулна уу. Сонгох асуултын мөр бүхэлдээ дарж
                      сонгох боломжтой болгосон.
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-sky-700" />
                      <span>{schedule.date} {schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileQuestion className="size-4 text-sky-700" />
                      <span>{exam.duration} минут • {exam.questions.length} асуулт</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-sky-700" />
                      <span>{studentName || "Сурагч"} • {studentClass}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {exam.questions.map((question, index) => {
                const value = answers[question.id] ?? ""
                const isAnswered = value.trim().length > 0
                const options = question.options ?? ["Үнэн", "Худал"]

                return (
                  <Card
                    key={question.id}
                    className={cn(
                      "overflow-hidden rounded-[1.5rem] border-slate-200 bg-white/95 shadow-sm",
                      isAnswered ? "ring-1 ring-emerald-200" : "",
                    )}
                  >
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            <span>Асуулт {index + 1}</span>
                            <span>•</span>
                            <span>{getQuestionTypeLabel(question)}</span>
                          </div>
                          <CardTitle className="text-xl leading-7 text-slate-900">
                            {question.question}
                          </CardTitle>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                          {question.points} оноо
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {question.type === "multiple-choice" || question.type === "true-false" ? (
                        <RadioGroup
                          value={value}
                          onValueChange={(nextValue) => handleAnswerChange(question.id, nextValue)}
                          className="gap-3"
                        >
                          {options.map((option) => {
                            const isSelected = value === option
                            const controlId = `${question.id}-${option}`

                            return (
                              <Label
                                key={option}
                                htmlFor={controlId}
                                className={cn(
                                  "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition-all",
                                  "hover:border-sky-300 hover:bg-sky-50/80",
                                  "focus-within:ring-2 focus-within:ring-sky-200",
                                  isSelected
                                    ? "border-sky-500 bg-sky-50 text-slate-900 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700",
                                )}
                              >
                                <div className="relative flex items-center justify-center">
                                  <RadioGroupItem
                                    value={option}
                                    id={controlId}
                                    className={cn(
                                      "size-5 border-2 border-slate-400 bg-white shadow-none",
                                      isSelected ? "border-sky-600 text-sky-600" : "",
                                    )}
                                  />
                                </div>
                                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                  <span className="text-base font-medium leading-6">{option}</span>
                                  {isSelected ? (
                                    <CheckCircle2 className="size-5 shrink-0 text-sky-600" />
                                  ) : (
                                    <Circle className="size-4 shrink-0 text-slate-300" />
                                  )}
                                </div>
                              </Label>
                            )
                          })}
                        </RadioGroup>
                      ) : question.type === "short-answer" ? (
                        <div className="space-y-2">
                          <Label htmlFor={question.id} className="text-sm font-semibold text-slate-700">
                            Хариулт
                          </Label>
                          <Input
                            id={question.id}
                            value={value}
                            onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                            className="h-12 rounded-xl border-slate-300 bg-white text-base"
                            placeholder="Хариултаа энд бичнэ үү"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor={question.id} className="text-sm font-semibold text-slate-700">
                            Хариулт
                          </Label>
                          <Textarea
                            id={question.id}
                            value={value}
                            onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                            rows={7}
                            className="rounded-xl border-slate-300 bg-white text-base leading-6"
                            placeholder="Дэлгэрэнгүй хариултаа энд бичнэ үү"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-[1.5rem] border-sky-100 bg-white/95 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900">Явц</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Хариулсан</span>
                    <span className="font-semibold text-slate-900">{answeredCount}/{totalQuestions}</span>
                  </div>
                  <Progress value={completionPercent} className="h-3 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <div className="text-sm text-emerald-700">Хариулсан</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-900">{answeredCount}</div>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <div className="text-sm text-amber-700">Үлдсэн</div>
                    <div className="mt-1 text-2xl font-bold text-amber-900">{unansweredCount}</div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Илгээхээс өмнө хариулаагүй асуулт үлдсэн эсэхийг шалгаарай.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border-slate-200 bg-slate-900 text-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Шалгалт дуусгах</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-200">
                  Илгээсний дараа хариултыг хадгалж тайлан руу шилжинэ.
                </p>
                <div className="grid gap-3">
                  <Button
                    onClick={() => void handleSubmit()}
                    disabled={isSubmitting}
                    className="h-11 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
                  >
                    {isSubmitting ? "Илгээж байна..." : "Шалгалт илгээх"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/student/exams/${exam.id}`)}
                    className="h-11 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Буцах
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
