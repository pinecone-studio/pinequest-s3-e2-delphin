'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exams, isExamReportAvailable, type ExamResult } from '@/lib/mock-data'

export function StudentRecentResultsCard({
  results,
}: {
  results: ExamResult[]
}) {
  if (results.length === 0) {
    return null
  }

  return (
    <Card className="panel-surface rounded-[1.5rem]">
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
        <CardDescription className="secondary-text">Your exam scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => {
            const exam = exams.find((entry) => entry.id === result.examId)
            const percentage = Math.round((result.score / result.totalPoints) * 100)
            const badgeVariant =
              percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'
            const isReportAvailable = isExamReportAvailable(result.examId)

            return (
              <div key={`${result.examId}-${result.studentId}`} className="elevated-surface soft-divider flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="font-medium">{exam?.title}</div>
                  <div className="secondary-text text-sm">
                    Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={badgeVariant}>{percentage}%</Badge>
                  <div className="secondary-text text-sm">
                    {result.score}/{result.totalPoints}
                  </div>
                  <div className="mt-2">
                    <Link href={`/student/reports/${result.examId}`}>
                      <Button size="sm" variant="outline">
                        {isReportAvailable ? 'View Report' : 'Report Locked'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
