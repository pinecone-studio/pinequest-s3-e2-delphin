"use client";

import { useEffect } from "react";
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts";
import type { Exam } from "@/lib/mock-data";

type UseStudentLiveAttemptSyncProps = {
  answeredCount: number;
  alreadySubmitted: boolean;
  exam?: Exam;
  isOpenNow: boolean;
  studentClass: string;
  studentId?: string;
  studentName: string;
  hasSchedule: boolean;
};

export function useStudentLiveAttemptSync(
  props: UseStudentLiveAttemptSyncProps,
) {
  const {
    answeredCount,
    alreadySubmitted,
    exam,
    isOpenNow,
    studentClass,
    studentId,
    studentName,
    hasSchedule,
  } = props;

  useEffect(() => {
    if (!exam || !hasSchedule || !isOpenNow || alreadySubmitted || !studentId) return;

    void upsertStudentExamAttempt({
      examId: exam.id,
      studentId,
      studentName,
      classId: studentClass,
      status: "in_progress",
      answeredCount,
      startedAt: new Date().toISOString(),
      submittedAt: null,
    });
  }, [
    alreadySubmitted,
    answeredCount,
    exam,
    hasSchedule,
    isOpenNow,
    studentClass,
    studentId,
    studentName,
  ]);

  useEffect(() => {
    if (!exam || !hasSchedule || !isOpenNow || alreadySubmitted || !studentId) return;

    const timeout = window.setTimeout(() => {
      void upsertStudentExamAttempt({
        examId: exam.id,
        studentId,
        studentName,
        classId: studentClass,
        status: "in_progress",
        answeredCount,
        startedAt: new Date().toISOString(),
        submittedAt: null,
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [
    alreadySubmitted,
    answeredCount,
    exam,
    hasSchedule,
    isOpenNow,
    studentClass,
    studentId,
    studentName,
  ]);
}
