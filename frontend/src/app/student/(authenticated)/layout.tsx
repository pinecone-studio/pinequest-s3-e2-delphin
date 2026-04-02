"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StudentShellFrame } from "@/components/student/student-shell-frame";
import {
  notifyStudentSessionChange,
  useStudentSession,
} from "@/hooks/use-student-session";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { studentName } = useStudentSession();

  useEffect(() => {
    if (!studentName) {
      router.push("/student/login");
    }
  }, [router, studentName]);

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentClass");
    notifyStudentSessionChange();
    router.push("/");
  };

  if (!studentName) {
    return null;
  }

  return (
    <StudentShellFrame pathname={pathname} onLogout={handleLogout}>
      {children}
    </StudentShellFrame>
  );
}
