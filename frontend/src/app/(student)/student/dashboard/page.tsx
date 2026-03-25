"use client";

import Link from "next/link";
import { StudentRecentResultsCard } from "@/components/student/student-recent-results-card";
import { StudentScheduleCalendar } from "@/components/student/student-schedule-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentSession } from "@/hooks/use-student-session";
import { getCurrentUtcWeekDates } from "@/lib/date-utils";
import { exams, examResults } from "@/lib/high-school-data";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession();

  const weekDates = getCurrentUtcWeekDates(daysOfWeek);
  
  // Get exams for student's class
  const myExams = exams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  );
  const upcomingExams = myExams.filter(e => e.status === "scheduled");
  
  // Get student's results
  const myResults = examResults.filter(r => r.studentId === studentId);

  // Calculate stats
  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / myResults.length)
    : 0;

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
                const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass);
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
                );
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

      <StudentScheduleCalendar
        myExams={myExams}
        studentClass={studentClass}
        timeSlots={timeSlots}
        weekDates={weekDates}
      />
      <StudentRecentResultsCard
        findExamTitle={(examId) => exams.find((exam) => exam.id === examId)?.title ?? "Unknown exam"}
        results={myResults}
      />
    </div>
  );
}
