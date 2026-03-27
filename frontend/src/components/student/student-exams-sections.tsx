'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'
import { formatCountdown } from '@/lib/student-exam-time'
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
      <h2 className="text-lg font-semibold mb-3">Өнөөдрийн шалгалтууд</h2>
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
                    <CardDescription>{schedule?.time} - {exam.duration} минут</CardDescription>
                  </div>
                  <Badge variant={isReady ? 'default' : 'secondary'}>
                    {isReady ? 'Бэлэн' : 'Удахгүй'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    {isReady ? (
                      <div className="text-2xl font-bold text-primary">Шалгалт эхлэхэд бэлэн!</div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground mb-1">Эхлэх хүртэл</div>
                        <div className="text-3xl font-mono font-bold">
                          {formatCountdown(countdown)}
                        </div>
                      </>
                    )}
                  </div>
                  <Link href={`/student/exams/${exam.id}`}>
                    <Button className="w-full" disabled={!isReady}>
                      {isReady ? 'Шалгалт өгөх' : 'Дэлгэрэнгүй үзэх'}
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
      <h2 className="text-lg font-semibold mb-3">Удахгүй болох шалгалтууд</h2>
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
                      {schedule?.date} - {schedule?.time} ({exam.duration} мин)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exam.questions.length} асуулт</Badge>
                    <Link href={`/student/exams/${exam.id}`}>
                      <Button variant="outline" size="sm">Үзэх</Button>
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
