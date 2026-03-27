'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Exam, ExamResult } from '@/lib/mock-data'
import { isStudentExamReportAvailable } from '@/lib/student-exams'

export function StudentCompletedExamsSection({
  exams,
  results,
}: {
  exams: Exam[]
  results: ExamResult[]
}) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Дууссан шалгалтууд</h2>
      {results.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Одоогоор дууссан шалгалт алга байна.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((result) => {
            const exam = exams.find((entry) => entry.id === result.examId)
            const percentage = Math.round((result.score / result.totalPoints) * 100)
            const variant =
              percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'
            const isReportAvailable = exam ? isStudentExamReportAvailable(exam) : false

            return (
              <Card key={`${result.examId}-${result.studentId}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{exam?.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Илгээсэн: {new Date(result.submittedAt).toLocaleString('mn-MN')}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {isReportAvailable
                          ? 'Дэлгэрэнгүй тайланг үзэх боломжтой'
                          : 'Бүх анги шалгалтаа дууссаны дараа дэлгэрэнгүй тайлан нээгдэнэ'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={variant}>{percentage}%</Badge>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {result.score}/{result.totalPoints} оноо
                      </div>
                      <div className="mt-3">
                        <Link href={`/student/reports/${result.examId}`}>
                          <Button size="sm" variant="outline">
                            {isReportAvailable ? 'Тайлан үзэх' : 'Тайлан түгжээтэй'}
                          </Button>
                        </Link>
                      </div>
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
