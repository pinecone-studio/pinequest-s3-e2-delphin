"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  examResults,
  exams as legacyExams,
  type Exam,
} from "@/lib/mock-data"
import { useStudentSession } from "@/hooks/use-student-session"
import {
  getStudentExamReportReleaseDate,
  getStudentExams,
  isStudentExamReportAvailable,
} from "@/lib/student-exams"

const questionTypeLabels = {
  "multiple-choice": "Сонгох",
  "true-false": "Үнэн/худал",
  "short-answer": "Богино хариулт",
  essay: "Эсээ",
} as const

export default function StudentExamReportPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const { studentId } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
      } catch (loadError) {
        if (!isMounted) return
        console.warn("Failed to refresh exam report data from the backend.", loadError)
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const exam = useMemo(
    () => allExams.find((entry) => entry.id === examId),
    [allExams, examId],
  )
  const result = examResults.find(
    (entry) => entry.examId === examId && entry.studentId === studentId,
  )

  if (!exam || !result) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Тайлан олдсонгүй</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Шалгалтууд руу буцах</Button>
        </Link>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.totalPoints) * 100)
  const isReportAvailable = isStudentExamReportAvailable(exam)
  const releaseDate = getStudentExamReportReleaseDate(exam)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Шалгалтууд руу буцах
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title} тайлан</h1>
        <p className="text-muted-foreground">
          Таны оноо шууд харагдана. Дэлгэрэнгүй хариултын тайлан тусад нь нээгдэнэ.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Онооны тойм</CardTitle>
          <CardDescription>Шалгалтаа дуусмагц шууд харагдана</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Илгээсэн</div>
            <div className="font-medium">{new Date(result.submittedAt).toLocaleString('mn-MN')}</div>
          </div>
          <div className="text-right">
            <Badge>{percentage}%</Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {result.score}/{result.totalPoints} оноо
            </div>
          </div>
        </CardContent>
      </Card>

      {!isReportAvailable ? (
        <Card>
          <CardHeader>
            <CardTitle>Тайлан түгжээтэй</CardTitle>
            <CardDescription>
              Багш бүх товлогдсон анги шалгалтаа дууссаны дараа бүтэн тайланг нээхээр тохируулсан байна.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Та дээрх хэсгээс оноогоо аль хэдийн харах боломжтой.</p>
            <p>
              {releaseDate
                ? `Энэ тайлан ${releaseDate.toLocaleString('mn-MN')}-с хойш нээгдэх төлөвтэй байна.`
                : "Нээх нөхцөл биелсний дараа энэ тайлан нээгдэнэ."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exam.questions.map((question) => {
            const answer = result.answers.find((entry) => entry.questionId === question.id)

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">{question.question}</CardTitle>
                      <CardDescription>
                        {questionTypeLabels[question.type]} • {question.points} оноо
                      </CardDescription>
                    </div>
                    <Badge variant={answer?.isCorrect ? "default" : "destructive"}>
                      {answer?.isCorrect ? "Зөв" : "Буруу"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Таны хариулт</div>
                    <div className="font-medium">{answer?.answer || "Хариулт илгээгдээгүй"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Зөв хариулт</div>
                    <div className="font-medium">
                      {question.correctAnswer || "Багштайгаа хамт нягтална уу"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
