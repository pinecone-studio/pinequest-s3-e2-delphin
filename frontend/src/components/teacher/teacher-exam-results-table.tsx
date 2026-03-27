'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ExamResult } from '@/lib/mock-data'
import { getStudentById } from '@/lib/mock-data-helpers'
import { getAnswerReviewState, isManualReviewQuestionType } from '@/lib/student-report-view'
import type { TeacherExam } from '@/lib/teacher-exams'

type ResultStatus = {
  label: string
  helper: string
  variant: 'default' | 'secondary'
  pendingCount: number
}

function getResultStatus(exam: TeacherExam, result: ExamResult): ResultStatus {
  const answerMap = new Map(result.answers.map((answer) => [answer.questionId, answer]))
  const manualQuestions = exam.questions.filter((question) =>
    isManualReviewQuestionType(question.type),
  )
  const pendingCount = manualQuestions.filter(
    (question) => getAnswerReviewState(question, answerMap.get(question.id)) === 'pending',
  ).length

  if (pendingCount > 0) {
    return {
      label: 'Оноо дутуу',
      helper: `${pendingCount} задгай хариулт үнэлгээ хүлээж байна`,
      variant: 'secondary',
      pendingCount,
    }
  }

  return {
    label: 'Бүрэн шалгасан',
    helper: 'Бүх задгай хариултад оноо өгсөн',
    variant: 'default',
    pendingCount: 0,
  }
}

export function TeacherExamResultsTable({
  exam,
  results,
  selectedStudentId,
  onReview,
}: {
  exam: TeacherExam
  results: ExamResult[]
  selectedStudentId?: string | null
  onReview?: (studentId: string) => void
}) {
  const sortedResults = [...results].sort((left, right) => {
    const leftStatus = getResultStatus(exam, left)
    const rightStatus = getResultStatus(exam, right)

    if (leftStatus.pendingCount !== rightStatus.pendingCount) {
      return rightStatus.pendingCount - leftStatus.pendingCount
    }

    return new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  })

  return (
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Илгээсэн сурагчдын дүн</CardTitle>
        <CardDescription>
          Эндээс хэн шууд шалгах шаардлагатай, хэний үнэлгээ бүрэн болсон бэ гэдгийг
          тодорхой харна.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedResults.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сурагч</TableHead>
                <TableHead>Одоогийн оноо</TableHead>
                <TableHead>Хувь</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Тайлбар</TableHead>
                <TableHead>Илгээсэн огноо</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result) => {
                const student = getStudentById(result.studentId)
                const percentage = Math.round((result.score / result.totalPoints) * 100)
                const percentageVariant =
                  percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'
                const status = getResultStatus(exam, result)
                const isSelected = selectedStudentId === result.studentId

                return (
                  <TableRow
                    key={`${result.examId}-${result.studentId}-${result.submittedAt}`}
                    className={isSelected ? 'bg-sky-50/60' : undefined}
                  >
                    <TableCell className="font-medium">
                      {student?.name ?? result.studentId}
                    </TableCell>
                    <TableCell>
                      {result.score}/{result.totalPoints}
                    </TableCell>
                    <TableCell>
                      <Badge variant={percentageVariant}>{percentage}%</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{status.helper}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(result.submittedAt).toLocaleString('mn-MN')}
                    </TableCell>
                    <TableCell className="text-right">
                      {onReview ? (
                        <Button
                          variant={status.pendingCount > 0 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onReview(result.studentId)}
                        >
                          {status.pendingCount > 0 ? 'Одоо шалгах' : 'Дахин нээх'}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-sm text-slate-600">
            Энэ ангид одоогоор илгээсэн хариулт алга. Сурагчид шалгалтаа илгээсний дараа
            дүнгийн хүснэгт энд гарна.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
