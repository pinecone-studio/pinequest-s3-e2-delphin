"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  persistStudentSession,
  persistTeacherSession,
  studentPersonas,
  teacherPersonas,
} from "@/lib/demo-personas";
import { notifyStudentSessionChange } from "@/hooks/use-student-session";
import { notifyTeacherSessionChange } from "@/hooks/use-teacher-session";

type RoleSwitchProps = {
  activePersonaId: string;
};

export function RoleSwitch({ activePersonaId }: RoleSwitchProps) {
  const router = useRouter();

  const switchToTeacher = (teacherId: string) => {
    persistTeacherSession(teacherPersonas.find((teacher) => teacher.id === teacherId) ?? teacherPersonas[0]);
    notifyTeacherSessionChange();
    router.push("/teacher/dashboard");
  };

  const switchToStudent = (studentId: string) => {
    persistStudentSession(studentPersonas.find((student) => student.id === studentId) ?? studentPersonas[0]);
    notifyStudentSessionChange();
    router.push("/student/dashboard");
  };

  return (
    <div className="mt-auto rounded-xl border bg-background/80 p-3 shadow-xs">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Role switch
      </p>
      <div className="mt-3 space-y-3">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Teachers</p>
          <div className="grid gap-2">
            {teacherPersonas.map((teacher) => (
              <Button
                key={teacher.id}
                size="sm"
                variant={activePersonaId === teacher.id ? "default" : "outline"}
                className="h-auto justify-start py-2 text-left"
                onClick={() => switchToTeacher(teacher.id)}
              >
                {teacher.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Students</p>
          <div className="grid gap-2">
            {studentPersonas.map((student) => (
              <Button
                key={student.id}
                size="sm"
                variant={activePersonaId === student.id ? "default" : "outline"}
                className="h-auto justify-start py-2 text-left"
                onClick={() => switchToStudent(student.id)}
              >
                {student.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
