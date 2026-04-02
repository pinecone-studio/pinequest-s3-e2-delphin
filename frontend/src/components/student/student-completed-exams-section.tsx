'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Exam, ExamResult } from '@/lib/mock-data'
import { getScheduleEnd } from '@/lib/student-exam-time'
import { isStudentExamReportAvailable } from '@/lib/student-exams'

export function StudentCompletedExamsSection({
  exams,
  missedExams,
  results,
  studentClass,
}: {
  exams: Exam[]
  missedExams: Exam[]
  results: ExamResult[]
  studentClass: string
}) {
  const sortedResults = [...results].sort((left, right) =>
    right.submittedAt.localeCompare(left.submittedAt),
  )

  const sortedMissedExams = [...missedExams].sort((left, right) => {
    const leftSchedule = left.scheduledClasses.find((entry) => entry.classId === studentClass)
    const rightSchedule = right.scheduledClasses.find((entry) => entry.classId === studentClass)

    const leftEndTime = leftSchedule
      ? getScheduleEnd(
          leftSchedule.date,
          leftSchedule.time,
          left.duration,
          left.availableIndefinitely,
        ).getTime()
      : 0
    const rightEndTime = rightSchedule
      ? getScheduleEnd(
          rightSchedule.date,
          rightSchedule.time,
          right.duration,
          right.availableIndefinitely,
        ).getTime()
      : 0

    return rightEndTime - leftEndTime
  })

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Дууссан шалгалтууд</h2>
      {sortedResults.length === 0 && sortedMissedExams.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Одоогоор дууссан шалгалт алга байна.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedResults.map((result) => {
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
                      <div className="font-medium">{exam?.title ?? result.examId}</div>
                      <div className="text-sm text-muted-foreground">
                        Илгээсэн: {new Date(result.submittedAt).toLocaleString('mn-MN')}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {isReportAvailable
                          ? 'Тайлангаа шалгах боломжтой'
                          : 'Бүх анги шалгалтаа дууссаны дараа тайлан нээгдэнэ'}
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
                            {isReportAvailable ? 'Тайлан шалгах' : 'Тайлан түгжээтэй'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {sortedMissedExams.map((exam) => {
            const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)

            return (
              <Card key={`missed-${exam.id}`} className="border-amber-200 bg-amber-50/40">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {schedule ? `${schedule.date} ${schedule.time} (${exam.duration} мин)` : 'Хуваарь олдсонгүй'}
                      </div>
                      <div className="mt-1 text-sm text-amber-700">
                        Та энэ шалгалтыг хоцорсон байна.
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Хоцорсон
                      </Badge>
                      <div className="mt-3 text-sm font-medium text-amber-700">
                        Тайлан байхгүй
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
