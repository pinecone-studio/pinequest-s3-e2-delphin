'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeacherExam } from '@/lib/teacher-exams'

export function TeacherExamsSection({
  emptyLabel,
  exams,
  title,
}: {
  emptyLabel: string
  exams: TeacherExam[]
  title: string
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {exams.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">{emptyLabel}</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.questions.length} questions, {exam.duration} min
                    </CardDescription>
                  </div>
                  <Badge variant={getBadgeVariant(exam.status)}>{formatStatus(exam.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {exam.status === 'draft' ? (
                  <Button variant="outline" size="sm">Continue Editing</Button>
                ) : (
                  <div className="space-y-2">
                    {exam.scheduledClasses.map((schedule) =>
                      exam.status === 'completed' ? (
                        <div key={`${exam.id}-${schedule.classId}`} className="text-sm">
                          <Link
                            href={`/teacher/classes/${schedule.classId}/exam/${exam.id}`}
                            className="hover:underline"
                          >
                            {schedule.classId} - {schedule.date} - View Results
                          </Link>
                        </div>
                      ) : (
                        <div
                          key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`}
                          className="text-sm flex justify-between"
                        >
                          <span className="font-medium">{schedule.classId}</span>
                          <span className="text-muted-foreground">{schedule.date} at {schedule.time}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function formatStatus(status: TeacherExam['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getBadgeVariant(status: TeacherExam['status']) {
  if (status === 'completed') return 'secondary'
  if (status === 'draft') return 'outline'
  return 'default'
}
