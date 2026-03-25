"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  persistStudentSession,
  persistTeacherSession,
  studentPersonas,
  teacherPersonas,
} from "@/lib/demo-personas";
import { notifyStudentSessionChange } from "@/hooks/use-student-session";
import { notifyTeacherSessionChange } from "@/hooks/use-teacher-session";

export default function LandingPage() {
  const router = useRouter();

  const enterTeacher = (teacherId: string) => {
    persistTeacherSession(teacherPersonas.find((teacher) => teacher.id === teacherId) ?? teacherPersonas[0]);
    notifyTeacherSessionChange();
    router.push("/teacher/dashboard");
  };

  const enterStudent = (studentId: string) => {
    persistStudentSession(studentPersonas.find((student) => student.id === studentId) ?? studentPersonas[0]);
    notifyStudentSessionChange();
    router.push("/student/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">PineQuest LMS</h1>
          <p className="text-muted-foreground">
            Pick a demo persona and jump straight into the teacher or student experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {teacherPersonas.map((teacher) => (
            <Card key={teacher.id} className="h-full border-primary/20">
              <CardHeader>
                <CardTitle>{teacher.name}</CardTitle>
                <CardDescription>
                  Open the {teacher.subject.toLowerCase()} workspace to manage classes, exams, and resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => enterTeacher(teacher.id)}>
                  Enter Teacher View
                </Button>
              </CardContent>
            </Card>
          ))}
          {studentPersonas.map((student) => (
            <Card key={student.id} className="h-full">
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  Continue as a {student.classId} student to review practice sets, exams, and results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => enterStudent(student.id)}>
                  Enter Student View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Demo mode only. Authentication has been removed for faster switching between personas.
        </p>
      </div>
    </main>
  );
}
