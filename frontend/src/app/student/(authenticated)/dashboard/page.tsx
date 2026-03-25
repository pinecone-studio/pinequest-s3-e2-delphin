"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { exams, examResults, getStudentById } from "@/lib/mock-data"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

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

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [studentName, setStudentName] = useState("")

  useEffect(() => {
    setStudentId(localStorage.getItem('studentId') || '')
    setStudentClass(localStorage.getItem('studentClass') || '')
    setStudentName(localStorage.getItem('studentName') || '')
  }, [])

  const weekDates = getWeekDates()
  
  // Get exams for student's class
  const myExams = exams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  )
  const upcomingExams = myExams.filter(e => e.status === 'scheduled')
  const completedExams = myExams.filter(e => e.status === 'completed')
  
  // Get student's results
  const myResults = examResults.filter(r => r.studentId === studentId)

  // Calculate stats
  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / myResults.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {studentName}</p>
      </div>

      {/* Notifications / Upcoming Exams Alert */}
      {upcomingExams.length > 0 && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              Upcoming Exams
              <Badge>{upcomingExams.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingExams.map(exam => {
                const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
                return (
                  <div key={exam.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {schedule?.date} at {schedule?.time} ({exam.duration} min)
                      </div>
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
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your Class</CardDescription>
            <CardTitle className="text-3xl">{studentClass}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Exams</CardDescription>
            <CardTitle className="text-3xl">{upcomingExams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Exams</CardDescription>
            <CardTitle className="text-3xl">{myResults.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Exam Schedule Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>Your upcoming exams this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Calendar Header */}
              <div className="grid grid-cols-6 border-b">
                <div className="p-2 font-medium text-muted-foreground">Time</div>
                {weekDates.map(({ day, displayDate }) => (
                  <div key={day} className="p-2 text-center border-l">
                    <div className="font-medium">{day}</div>
                    <div className="text-sm text-muted-foreground">{displayDate}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6 border-b min-h-[60px]">
                  <div className="p-2 text-sm text-muted-foreground">{time}</div>
                  {weekDates.map(({ day, date }) => {
                    const examItem = myExams.flatMap(e => 
                      e.scheduledClasses
                        .filter(sc => sc.classId === studentClass && sc.date === date && sc.time === time)
                        .map(sc => ({ exam: e, schedule: sc }))
                    )[0]

                    return (
                      <div key={`${day}-${time}`} className="p-1 border-l min-h-[60px]">
                        {examItem && (
                          <div className={`p-1 rounded text-xs ${
                            examItem.exam.status === 'completed' 
                              ? 'bg-muted' 
                              : 'bg-destructive/10 border border-destructive/20'
                          }`}>
                            <div className={`font-medium ${
                              examItem.exam.status === 'scheduled' ? 'text-destructive' : ''
                            }`}>
                              {examItem.exam.title}
                            </div>
                            <div className="text-muted-foreground">{examItem.exam.duration} min</div>
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

      {/* Recent Results */}
      {myResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Your exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myResults.map(result => {
                const exam = exams.find(e => e.id === result.examId)
                const percentage = Math.round((result.score / result.totalPoints) * 100)
                return (
                  <div key={`${result.examId}-${result.studentId}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{exam?.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}>
                        {percentage}%
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {result.score}/{result.totalPoints}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
