"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTeacherSession } from "@/hooks/use-teacher-session";
import { getCurrentUtcWeekDates } from "@/lib/date-utils";
import { classes, exams, classSchedule } from "@/lib/mock-data";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export default function TeacherDashboard() {
  const { teacherName, teacherSubject } = useTeacherSession();
  const weekDates = getCurrentUtcWeekDates(daysOfWeek);
  const upcomingExams = exams.filter(e => e.status === "scheduled");
  const completedExams = exams.filter(e => e.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {teacherName}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Classes</CardDescription>
            <CardTitle className="text-3xl">{classes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{classes.reduce((sum, c) => sum + c.students.length, 0)}</CardTitle>
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
            <CardTitle className="text-3xl">{completedExams.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Classes and exams for this week</CardDescription>
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
                    // Check for class
                    const classItem = classSchedule.find(
                      cs => cs.day === day && cs.time.startsWith(time)
                    );
                    // Check for exam
                    const examItem = exams.flatMap(e => 
                      e.scheduledClasses
                        .filter(sc => sc.date === date && sc.time === time)
                        .map(sc => ({ exam: e, schedule: sc }))
                    )[0];

                    return (
                      <div key={`${day}-${time}`} className="p-1 border-l min-h-[60px]">
                        {classItem && (
                          <div className="p-1 bg-muted rounded text-xs">
                            <div className="font-medium">{classItem.classId}</div>
                            <div className="text-muted-foreground">
                              {teacherSubject || classItem.subject}
                            </div>
                          </div>
                        )}
                        {examItem && (
                          <div className="p-1 bg-destructive/10 border border-destructive/20 rounded text-xs mt-1">
                            <div className="font-medium text-destructive">{examItem.exam.title}</div>
                            <div className="text-muted-foreground">{examItem.schedule.classId}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Scheduled exams for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExams.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming exams scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-muted-foreground">
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
  );
}
