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
      <h2 className="text-lg font-semibold mb-3">Completed Exams</h2>
      {results.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No completed exams yet
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
                        Submitted: {new Date(result.submittedAt).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {isReportAvailable
                          ? 'Detailed report is available'
                          : 'Detailed report will unlock after every class finishes the exam'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={variant}>{percentage}%</Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.score}/{result.totalPoints} points
                      </div>
                      <div className="mt-3">
                        <Link href={`/student/reports/${result.examId}`}>
                          <Button size="sm" variant="outline">
                            {isReportAvailable ? 'View Report' : 'Report Locked'}
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
