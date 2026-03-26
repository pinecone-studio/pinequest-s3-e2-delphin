'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'
import { formatCountdown } from '@/lib/student-exam-time'

export function StudentUpcomingExamsCard({
  exams,
  studentClass,
  today,
  todayCountdowns,
}: {
  exams: Exam[]
  studentClass: string
  today: string
  todayCountdowns: Record<string, number>
}) {
  if (exams.length === 0) return null

  return (
    <Card className="panel-surface border-primary rounded-[1.5rem]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          Upcoming Exams
          <Badge>{exams.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exams.map((exam) => {
            const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
            const isTodayExam = schedule?.date === today
            const countdown = todayCountdowns[exam.id] ?? 0

            return (
              <div
                key={exam.id}
                className={`elevated-surface flex items-center justify-between rounded-xl border p-3 soft-divider ${isTodayExam ? 'border-primary ring-1 ring-primary/40' : ''}`}
              >
                <div>
                  <div className="font-medium">{exam.title}</div>
                  <div className="secondary-text text-sm">
                    {schedule?.date} at {schedule?.time} ({exam.duration} min)
                  </div>
                  {isTodayExam ? (
                    <div className="mt-2 inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                      {countdown === 0 ? 'Ready to start now' : `Starts in ${formatCountdown(countdown)}`}
                    </div>
                  ) : null}
                </div>
                <Link href={`/student/exams/${exam.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
