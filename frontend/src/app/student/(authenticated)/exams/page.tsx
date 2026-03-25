"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { exams, examResults } from "@/lib/mock-data"

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

export default function StudentExamsPage() {
  const [studentClass, setStudentClass] = useState("")
  const [studentId, setStudentId] = useState("")
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})

  useEffect(() => {
    setStudentClass(localStorage.getItem('studentClass') || '')
    setStudentId(localStorage.getItem('studentId') || '')
  }, [])

  // Get exams for student's class
  const myExams = exams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  )
  
  const scheduledExams = myExams.filter(e => e.status === 'scheduled')
  const completedExams = myExams.filter(e => e.status === 'completed')
  
  // Get today's exams
  const today = new Date().toISOString().split('T')[0]
  const todaysExams = scheduledExams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass && sc.date === today)
  )

  // Update countdowns
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, number> = {}
      todaysExams.forEach(exam => {
        const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
        if (schedule) {
          newCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setCountdowns(newCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [todaysExams, studentClass])

  // Get my results
  const myResults = examResults.filter(r => r.studentId === studentId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="text-muted-foreground">View your upcoming and completed exams</p>
      </div>

      {/* Today's Exams with Countdown */}
      {todaysExams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Today&apos;s Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysExams.map(exam => {
              const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
              const countdown = countdowns[exam.id] || 0
              const isReady = countdown === 0

              return (
                <Card key={exam.id} className={isReady ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>
                          {schedule?.time} - {exam.duration} minutes
                        </CardDescription>
                      </div>
                      <Badge variant={isReady ? "default" : "secondary"}>
                        {isReady ? "Ready" : "Upcoming"}
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
                          {isReady ? "Take Exam" : "View Details"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming Exams (not today) */}
      {scheduledExams.filter(e => !todaysExams.includes(e)).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming Exams</h2>
          <div className="space-y-3">
            {scheduledExams
              .filter(e => !todaysExams.includes(e))
              .map(exam => {
                const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
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
      )}

      {/* Completed Exams / Results */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Completed Exams</h2>
        {myResults.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No completed exams yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myResults.map(result => {
              const exam = exams.find(e => e.id === result.examId)
              const percentage = Math.round((result.score / result.totalPoints) * 100)
              return (
                <Card key={`${result.examId}-${result.studentId}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{exam?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Submitted: {new Date(result.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}>
                          {percentage}%
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.score}/{result.totalPoints} points
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
    </div>
  )
}
