"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentRecentResultsCard } from "@/components/student/student-recent-results-card"
import { StudentScheduleCalendar } from "@/components/student/student-schedule-calendar"
import { exams, examResults } from "@/lib/mock-data"
import { useStudentSession } from "@/hooks/use-student-session"

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const myExams = exams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  )
  const upcomingExams = myExams.filter(e => e.status === 'scheduled')
  const myResults = examResults.filter(r => r.studentId === studentId)
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
        <Card className="panel-surface border-primary rounded-[1.5rem]">
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
                  <div key={exam.id} className="elevated-surface flex items-center justify-between rounded-xl border p-3 soft-divider">
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="secondary-text text-sm">
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
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Your Class</CardDescription>
            <CardTitle className="text-3xl">{studentClass}</CardTitle>
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
            <CardTitle className="text-3xl">{myResults.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Average Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <StudentScheduleCalendar myExams={myExams} studentClass={studentClass} />
      <StudentRecentResultsCard results={myResults} />
    </div>
  )
}
