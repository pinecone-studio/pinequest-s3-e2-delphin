"use client"

import { use } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  exams,
  examResults,
  getExamReportReleaseDate,
  isExamReportAvailable,
} from "@/lib/mock-data"
import { useStudentSession } from "@/hooks/use-student-session"

export default function StudentExamReportPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const { studentId } = useStudentSession()
  const exam = exams.find((entry) => entry.id === examId)
  const result = examResults.find(
    (entry) => entry.examId === examId && entry.studentId === studentId,
  )

  if (!exam || !result) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    )
  }

  const percentage = Math.round((result.score / result.totalPoints) * 100)
  const isReportAvailable = isExamReportAvailable(examId)
  const releaseDate = getExamReportReleaseDate(exam)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to Exams
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title} Report</h1>
        <p className="text-muted-foreground">
          Your score is available immediately. Detailed answer review is released separately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Summary</CardTitle>
          <CardDescription>Visible as soon as you finish the exam</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Submitted</div>
            <div className="font-medium">{new Date(result.submittedAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <Badge>{percentage}%</Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {result.score}/{result.totalPoints} points
            </div>
          </div>
        </CardContent>
      </Card>

      {!isReportAvailable ? (
        <Card>
          <CardHeader>
            <CardTitle>Report Locked</CardTitle>
            <CardDescription>
              The teacher chose to release full reports only after all scheduled classes finish.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>You can already see your score above.</p>
            <p>
              {releaseDate
                ? `This report is expected to unlock after ${releaseDate.toLocaleString()}.`
                : "This report will unlock once the release condition is met."}
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
                        {question.type} • {question.points} points
                      </CardDescription>
                    </div>
                    <Badge variant={answer?.isCorrect ? "default" : "destructive"}>
                      {answer?.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Your Answer</div>
                    <div className="font-medium">{answer?.answer || "No answer submitted"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Expected Answer</div>
                    <div className="font-medium">
                      {question.correctAnswer || "Review with your teacher"}
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
