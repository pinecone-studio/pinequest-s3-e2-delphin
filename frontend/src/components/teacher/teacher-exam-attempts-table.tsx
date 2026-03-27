'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Class, ExamResult } from '@/lib/mock-data'
import type { StudentExamAttempt } from '@/lib/student-exam-attempts'

type AttemptStatusView = {
  label: string
  variant: 'default' | 'secondary' | 'outline'
}

function getAttemptStatusView(
  status: 'not_started' | 'in_progress' | 'submitted',
): AttemptStatusView {
  if (status === 'submitted') {
    return { label: 'Илгээсэн', variant: 'default' }
  }

  if (status === 'in_progress') {
    return { label: 'Өгч байна', variant: 'secondary' }
  }

  return { label: 'Эхлээгүй', variant: 'outline' }
}

function getResolvedStudentState(
  attempt: StudentExamAttempt | undefined,
  result: ExamResult | undefined,
) {
  if (result) {
    return {
      status: getAttemptStatusView('submitted'),
      startedAt: attempt?.startedAt ?? result.submittedAt,
      submittedAt: attempt?.submittedAt ?? result.submittedAt,
    }
  }

  return {
    status: getAttemptStatusView(attempt?.status ?? 'not_started'),
    startedAt: attempt?.startedAt ?? null,
    submittedAt: attempt?.submittedAt ?? null,
  }
}

export function TeacherExamAttemptsTable({
  attempts,
  results,
  classData,
  selectedStudentId,
  onReview,
}: {
  attempts: StudentExamAttempt[]
  results: ExamResult[]
  classData: Class
  selectedStudentId?: string | null
  onReview?: (studentId: string) => void
}) {
  const attemptsByStudent = new Map(attempts.map((attempt) => [attempt.studentId, attempt]))
  const resultsByStudent = new Map(results.map((result) => [result.studentId, result]))

  return (
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Сурагчдын явц</CardTitle>
        <CardDescription>
          Хэн эхлээгүй, хэн өгч байгаа, хэн илгээснийг нэг хүснэгтээс харна. Илгээсэн
          сурагчийг шууд сонгож шалгаж болно.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сурагч</TableHead>
              <TableHead>Анги</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Эхэлсэн</TableHead>
              <TableHead>Илгээсэн</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classData.students.map((student) => {
              const attempt = attemptsByStudent.get(student.id)
              const result = resultsByStudent.get(student.id)
              const resolved = getResolvedStudentState(attempt, result)
              const isSelected = selectedStudentId === student.id

              return (
                <TableRow key={student.id} className={isSelected ? 'bg-sky-50/60' : undefined}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{classData.name}</TableCell>
                  <TableCell>
                    <Badge variant={resolved.status.variant}>{resolved.status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resolved.startedAt
                      ? new Date(resolved.startedAt).toLocaleString('mn-MN')
                      : 'Эхлээгүй'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resolved.submittedAt
                      ? new Date(resolved.submittedAt).toLocaleString('mn-MN')
                      : 'Илгээгээгүй'}
                  </TableCell>
                  <TableCell className="text-right">
                    {resolved.status.label === 'Илгээсэн' && onReview ? (
                      <Button size="sm" variant="outline" onClick={() => onReview(student.id)}>
                        Хариулт харах
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
