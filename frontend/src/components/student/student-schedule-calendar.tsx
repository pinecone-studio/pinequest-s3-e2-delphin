'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)

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
      .filter((schedule) => {
        const scheduleHour = schedule.time.slice(0, 2)
        const slotHour = time.slice(0, 2)

        return (
          schedule.classId === studentClass &&
          schedule.date === date &&
          scheduleHour === slotHour
        )
      })
      .map((schedule) => ({ exam, schedule })),
  )[0]
}

function getLocalDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export function StudentScheduleCalendar({
  myExams,
  studentClass,
}: {
  myExams: Exam[]
  studentClass: string
}) {
  const weekDates = getWeekDates()
  const today = getLocalDateString()

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
                        <div className={examItem.exam.status === 'completed' ? 'elevated-surface soft-divider rounded-md border p-1 text-xs' : `rounded-md border p-1 text-xs ${examItem.schedule.date === today ? 'border-primary/50 bg-primary/15 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]' : 'border-destructive/20 bg-destructive/10 dark:border-[#315A79] dark:bg-[#1B3C57]'}`}>
                          <div className={examItem.exam.status === 'scheduled' ? 'font-medium text-destructive' : 'font-medium'}>
                            {examItem.exam.title}
                          </div>
                          <div className="secondary-text">{examItem.schedule.time}</div>
                          <div className="secondary-text">{examItem.exam.duration} min</div>
                          {examItem.schedule.date === today && examItem.exam.status === 'scheduled' ? (
                            <div className="mt-1 font-semibold text-primary">
                              {getSecondsUntil(examItem.schedule.date, examItem.schedule.time) === 0
                                ? 'Ready now'
                                : formatCountdown(getSecondsUntil(examItem.schedule.date, examItem.schedule.time))}
                            </div>
                          ) : null}
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
