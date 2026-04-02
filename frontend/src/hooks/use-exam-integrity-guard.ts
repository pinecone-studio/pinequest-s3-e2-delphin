"use client";

import { useEffect, useRef } from "react";
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts";

export function useExamIntegrityGuard({
  examId,
  studentClass,
  studentId,
  studentName,
}: {
  examId?: string;
  studentClass?: string;
  studentId?: string;
  studentName?: string;
}) {
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (!examId || !studentClass || !studentId || !studentName) return;

    const handleVisibilityChange = () => {
      if (!document.hidden || hasReportedRef.current) return;

      hasReportedRef.current = true;
      void upsertStudentExamAttempt({
        examId,
        studentId,
        studentName,
        classId: studentClass,
        status: isLikelyMobileDevice() ? "app_switched" : "tab_switched",
        startedAt: new Date().toISOString(),
        submittedAt: null,
      }).catch((error) => {
        console.error("Failed to report tab switch.", error);
        hasReportedRef.current = false;
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examId, studentClass, studentId, studentName]);
}

function isLikelyMobileDevice() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }

  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
