'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exams, isExamReportAvailable, type Exam, type ExamResult } from '@/lib/mock-data'

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export function StudentTodayExamsSection({
  examsToday,
  studentClass,
  countdowns,
}: {
  examsToday: Exam[]
  studentClass: string
  countdowns: Record<string, number>
}) {
  if (examsToday.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Today&apos;s Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examsToday.map((exam) => {
          const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
          const countdown = countdowns[exam.id] || 0
          const isReady = countdown === 0

          return (
            <Card key={exam.id} className={isReady ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>{schedule?.time} - {exam.duration} minutes</CardDescription>
                  </div>
                  <Badge variant={isReady ? 'default' : 'secondary'}>
                    {isReady ? 'Ready' : 'Upcoming'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    {isReady ? (
                      <div className="text-2xl font-bold text-primary">Exam is ready!</div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground mb-1">Starts in</div>
                        <div className="text-3xl font-mono font-bold">
                          {formatCountdown(countdown)}
                        </div>
                      </>
                    )}
                  </div>
                  <Link href={`/student/exams/${exam.id}`}>
                    <Button className="w-full" disabled={!isReady}>
                      {isReady ? 'Take Exam' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function StudentUpcomingExamsSection({
  upcomingExams,
  todaysExams,
  studentClass,
}: {
  upcomingExams: Exam[]
  todaysExams: Exam[]
  studentClass: string
}) {
  const futureExams = upcomingExams.filter((exam) => !todaysExams.includes(exam))
  if (futureExams.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Upcoming Exams</h2>
      <div className="space-y-3">
        {futureExams.map((exam) => {
          const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
          return (
            <Card key={exam.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {schedule?.date} at {schedule?.time} ({exam.duration} min)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exam.questions.length} questions</Badge>
                    <Link href={`/student/exams/${exam.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function StudentCompletedExamsSection({
  results,
}: {
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
            const isReportAvailable = isExamReportAvailable(result.examId)

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
