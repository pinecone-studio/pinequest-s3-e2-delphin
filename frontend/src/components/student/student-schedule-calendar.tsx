'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

function getWeekDates() {
  const today = new Date()
  const currentDay = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  return daysOfWeek.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      day,
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })
}

function findExamItem(myExams: Exam[], studentClass: string, date: string, time: string) {
  return myExams.flatMap((exam) =>
    exam.scheduledClasses
      .filter((schedule) => schedule.classId === studentClass && schedule.date === date && schedule.time === time)
      .map((schedule) => ({ exam, schedule })),
  )[0]
}

export function StudentScheduleCalendar({
  myExams,
  studentClass,
}: {
  myExams: Exam[]
  studentClass: string
}) {
  const weekDates = getWeekDates()

  return (
    <Card className="panel-surface rounded-[1.5rem]">
      <CardHeader>
        <CardTitle>Exam Schedule</CardTitle>
        <CardDescription className="secondary-text">Your upcoming exams this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="strong-divider grid grid-cols-6 border-b">
              <div className="secondary-text p-2 font-medium">Time</div>
              {weekDates.map(({ day, displayDate }) => (
                <div key={day} className="soft-divider p-2 text-center border-l">
                  <div className="font-medium">{day}</div>
                  <div className="secondary-text text-sm">{displayDate}</div>
                </div>
              ))}
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="strong-divider grid min-h-[60px] grid-cols-6 border-b">
                <div className="muted-text p-2 text-sm">{time}</div>
                {weekDates.map(({ day, date }) => {
                  const examItem = findExamItem(myExams, studentClass, date, time)
                  return (
                    <div key={`${day}-${time}`} className="soft-divider min-h-[60px] border-l p-1">
                      {examItem ? (
                        <div className={examItem.exam.status === 'completed' ? 'elevated-surface soft-divider rounded-md border p-1 text-xs' : 'rounded-md border border-destructive/20 bg-destructive/10 p-1 text-xs dark:border-[#315A79] dark:bg-[#1B3C57]'}>
                          <div className={examItem.exam.status === 'scheduled' ? 'font-medium text-destructive' : 'font-medium'}>
                            {examItem.exam.title}
                          </div>
                          <div className="secondary-text">{examItem.exam.duration} min</div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
