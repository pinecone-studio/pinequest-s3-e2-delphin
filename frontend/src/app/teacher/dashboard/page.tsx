"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { classes, exams } from "@/lib/mock-data"
import { classSchedule, teacher } from "@/lib/mock-data-helpers"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

// Get current week dates
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
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  })
}

export default function TeacherDashboard() {
  const weekDates = getWeekDates()
  const upcomingExams = exams.filter(e => e.status === 'scheduled')
  const completedExams = exams.filter(e => e.status === 'completed')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {teacher.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Total Classes</CardDescription>
            <CardTitle className="text-3xl">{classes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Total Students</CardDescription>
            <CardTitle className="text-3xl">{classes.reduce((sum, c) => sum + c.students.length, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Upcoming Exams</CardDescription>
            <CardTitle className="text-3xl">{upcomingExams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Completed Exams</CardDescription>
            <CardTitle className="text-3xl">{completedExams.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card className="panel-surface rounded-[1.5rem]">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription className="secondary-text">Classes and exams for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Calendar Header */}
              <div className="strong-divider grid grid-cols-6 border-b">
                <div className="secondary-text p-2 font-medium">Time</div>
                {weekDates.map(({ day, displayDate }) => (
                  <div key={day} className="soft-divider p-2 text-center border-l">
                    <div className="font-medium">{day}</div>
                    <div className="secondary-text text-sm">{displayDate}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="strong-divider grid min-h-[60px] grid-cols-6 border-b">
                  <div className="muted-text p-2 text-sm">{time}</div>
                  {weekDates.map(({ day, date }) => {
                    // Check for class
                    const classItem = classSchedule.find(
                      cs => cs.day === day && cs.time.startsWith(time)
                    )
                    // Check for exam
                    const examItem = exams.flatMap(e => 
                      e.scheduledClasses
                        .filter(sc => sc.date === date && sc.time === time)
                        .map(sc => ({ exam: e, schedule: sc }))
                    )[0]

                    return (
                      <div key={`${day}-${time}`} className="soft-divider min-h-[60px] border-l p-1">
                        {classItem && (
                          <div className="elevated-surface rounded-md border p-1 text-xs soft-divider">
                            <div className="font-medium">{classItem.classId}</div>
                            <div className="secondary-text">{classItem.subject}</div>
                          </div>
                        )}
                        {examItem && (
                          <div className="mt-1 rounded-md border border-destructive/20 bg-destructive/10 p-1 text-xs dark:border-[#315A79] dark:bg-[#1B3C57]">
                            <div className="font-medium text-destructive">{examItem.exam.title}</div>
                            <div className="secondary-text">{examItem.schedule.classId}</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams List */}
      <Card className="panel-surface rounded-[1.5rem]">
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription className="secondary-text">Scheduled exams for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExams.length === 0 ? (
            <p className="muted-text text-sm">No upcoming exams scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="elevated-surface soft-divider flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-medium">{exam.title}</div>
                    <div className="secondary-text text-sm">
                      {exam.questions.length} questions, {exam.duration} min
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exam.scheduledClasses.map(sc => (
                      <Badge key={`${exam.id}-${sc.classId}`} variant="outline">
                        {sc.classId} - {sc.date} {sc.time}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
