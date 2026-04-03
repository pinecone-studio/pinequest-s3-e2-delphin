"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StudentShellFrame } from "@/components/student/student-shell-frame";
import { useStudentExamNotifications } from "@/hooks/use-student-exam-notifications";
import { findResumableExamPath } from "@/lib/student-exam-resume";
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
  const { studentClass, studentId, studentName } = useStudentSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    hasNotifications,
    markNotificationAsRead,
    notificationItems,
    notificationCount,
  } = useStudentExamNotifications(studentId, studentClass);

  useEffect(() => {
    if (!studentName) {
      router.push("/student/login");
    }
  }, [router, studentName]);

  useEffect(() => {
    if (!studentClass || !studentId) return;
    if (pathname.startsWith("/student/reports/")) return;
    if (pathname.startsWith("/student/exams/") && pathname.endsWith("/take")) return;

    let isMounted = true;
    void findResumableExamPath({ studentId, studentClass }).then((resumePath) => {
      if (isMounted && resumePath && pathname !== resumePath) router.replace(resumePath);
    });

    return () => {
      isMounted = false;
    };
  }, [pathname, router, studentClass, studentId]);

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
    <StudentShellFrame
      hasNotifications={hasNotifications}
      notificationItems={notificationItems}
      notificationCount={notificationCount}
      pathname={pathname}
      onLogout={handleLogout}
      onSelectNotification={(examId) => {
        markNotificationAsRead(examId);
        router.push(`/student/exams/${examId}`);
      }}
      onRefresh={() => setRefreshKey((current) => current + 1)}
    >
      <div key={`${pathname}-${refreshKey}`}>{children}</div>
    </StudentShellFrame>
  );
}
