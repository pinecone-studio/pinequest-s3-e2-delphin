'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeacherExam } from '@/lib/teacher-exams'
import { classes } from '@/lib/mock-data'

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
                  <Link href={`/teacher/exams/${exam.id}/edit`}>
                    <Button variant="outline" size="sm">Continue Editing</Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    {getDisplaySchedules(exam).map((schedule) =>
                      exam.status === 'completed' ? (
                        <div key={`${exam.id}-${schedule.classId}-${schedule.date}-${schedule.time}`} className="text-sm">
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
                    {exam.status === 'scheduled' ? (
                      <div className="flex gap-2 pt-2">
                        <Link href={`/teacher/exams/${exam.id}/edit`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                      </div>
                    ) : null}
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

const ALL_CLASSES_LABEL = 'All Classes'

function getDisplaySchedules(exam: TeacherExam) {
  if (exam.status === 'completed') {
    return exam.scheduledClasses
  }

  const allClassIds = new Set(classes.map((classEntry) => classEntry.id))
  const groups = new Map<string, typeof exam.scheduledClasses>()

  exam.scheduledClasses.forEach((schedule) => {
    const key = `${schedule.date}::${schedule.time}`
    const current = groups.get(key) ?? []
    current.push(schedule)
    groups.set(key, current)
  })

  return Array.from(groups.entries()).flatMap(([key, schedules]) => {
    const scheduledClassIds = new Set(schedules.map((schedule) => schedule.classId))
    const matchesAllClasses =
      scheduledClassIds.size === allClassIds.size &&
      Array.from(allClassIds).every((classId) => scheduledClassIds.has(classId))

    if (!matchesAllClasses) {
      return schedules
    }

    const [date, time] = key.split('::')
    return [
      {
        classId: ALL_CLASSES_LABEL,
        date,
        time,
      },
    ]
  })
}

function formatStatus(status: TeacherExam['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getBadgeVariant(status: TeacherExam['status']) {
  if (status === 'completed') return 'secondary'
  if (status === 'draft') return 'outline'
  return 'default'
}
