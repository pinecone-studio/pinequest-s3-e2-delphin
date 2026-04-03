"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStudentExamAttempts, upsertStudentExamAttempt } from "@/lib/student-exam-attempts";
import type { Exam } from "@/lib/mock-data";

export function useStudentExamDraft(props: {
  alreadySubmitted: boolean;
  exam?: Exam;
  isOpenNow: boolean;
  studentClass: string;
  studentId: string;
  studentName: string;
}) {
  const { alreadySubmitted, exam, isOpenNow, studentClass, studentId, studentName } = props;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isDraftReady, setIsDraftReady] = useState(false);
  const examId = exam?.id;
  const shouldLoadDraft = Boolean(exam?.id && studentId);
  const currentQuestion = useMemo(() => deriveCurrentQuestion(exam, answers), [answers, exam]);

  useEffect(() => {
    if (!shouldLoadDraft) return;

    let isMounted = true;
    void loadStudentExamAttempts({ examId: examId!, studentId })
      .then(([attempt]) => {
        if (isMounted && attempt?.answers) setAnswers(attempt.answers);
      })
      .finally(() => {
        if (isMounted) setIsDraftReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, [examId, shouldLoadDraft, studentId]);

  useEffect(() => {
    if (!exam?.id || !studentId || !studentClass || !studentName) return;
    if (!isDraftReady || alreadySubmitted || !isOpenNow) return;

    const timeoutId = window.setTimeout(() => {
      void upsertStudentExamAttempt({
        examId: exam.id,
        studentId,
        studentName,
        classId: studentClass,
        status: "in_progress",
        answers,
        currentQuestion,
        startedAt: new Date().toISOString(),
        submittedAt: null,
      });
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [
    alreadySubmitted,
    answers,
    currentQuestion,
    exam?.id,
    isDraftReady,
    isOpenNow,
    studentClass,
    studentId,
    studentName,
  ]);

  return {
    answers,
    currentQuestion,
    isDraftReady: !shouldLoadDraft || isDraftReady,
    setAnswer(questionId: string, value: string) {
      setAnswers((current) => ({ ...current, [questionId]: value }));
    },
  };
}

function deriveCurrentQuestion(exam: Exam | undefined, answers: Record<string, string>) {
  if (!exam?.questions.length) return 0;
  const firstUnanswered = exam.questions.findIndex((question) => !(answers[question.id] ?? "").trim());
  return firstUnanswered >= 0 ? firstUnanswered + 1 : exam.questions.length;
}
