"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StudentTakeExamClosed, StudentTakeExamNotFound, StudentTakeExamSubmitted } from "@/components/student/student-take-exam-states";
import { StudentTakeExamContent } from "@/components/student/student-take-exam-content";
import { useExamIntegrityGuard } from "@/hooks/use-exam-integrity-guard";
import { useStudentSession } from "@/hooks/use-student-session";
import { exams as legacyExams, type Exam } from "@/lib/mock-data";
import { upsertStudentExamAttempt } from "@/lib/student-exam-attempts";
import { loadStudentExamResults } from "@/lib/student-exam-results";
import { isScheduleOpenNow } from "@/lib/student-exam-time";
import { getStudentExams } from "@/lib/student-exams";
import { submitStudentExam } from "@/lib/submit-student-exam";

export default function StudentTakeExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const { studentClass, studentId, studentName } = useStudentSession();
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        const [nextExams, nextResults] = await Promise.all([
          getStudentExams(),
          loadStudentExamResults({ examId, studentId }),
        ]);
        if (!isMounted) return;
        setAllExams(nextExams);
        setAlreadySubmitted(
          nextResults.some(
            (result) =>
              result.examId === examId && result.studentId === studentId,
          ),
        );
      } catch (error) {
        if (isMounted) {
          console.warn("Failed to load the exam-taking page.", error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadPage();
    return () => {
      isMounted = false;
    };
  }, [examId, studentId]);

  const exam = useMemo(
    () => allExams.find((entry) => entry.id === examId),
    [allExams, examId],
  );
  const schedule = exam?.scheduledClasses.find(
    (entry) => entry.classId === studentClass,
  );
  const isOpenNow =
    schedule && exam
      ? isScheduleOpenNow(schedule.date, schedule.time, exam.duration)
      : false;

  useEffect(() => {
    if (!exam || !schedule || !isOpenNow || alreadySubmitted || !studentId) {
      return;
    }

    void upsertStudentExamAttempt({
      examId: exam.id,
      studentId,
      studentName: studentName || "Ð¡ÑƒÑ€Ð°Ð³Ñ‡",
      classId: studentClass,
      status: "in_progress",
      startedAt: new Date().toISOString(),
      submittedAt: null,
    });
  }, [
    alreadySubmitted,
    exam,
    isOpenNow,
    schedule,
    studentClass,
    studentId,
    studentName,
  ]);

  useExamIntegrityGuard({ examId: exam?.id, studentId });

  const answeredCount = exam
    ? exam.questions.filter(
        (question) => (answers[question.id] ?? "").trim().length > 0,
      ).length
    : 0;
  const totalQuestions = exam?.questions.length ?? 0;
  const completionPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);

  if (isLoading) return <p className="text-sm text-muted-foreground">Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚Ñ‹Ð³ Ð°Ñ‡Ð°Ð°Ð»Ð¶ Ð±Ð°Ð¹Ð½Ð°...</p>;

  if (!exam || !schedule) {
    return <StudentTakeExamNotFound onBack={() => router.push("/student/exams")} />;
  }

  if (alreadySubmitted) {
    return (
      <StudentTakeExamSubmitted
        onBack={() => router.push("/student/exams")}
        onViewReport={() => router.push(`/student/reports/${examId}`)}
      />
    );
  }

  if (!isOpenNow) {
    return (
      <StudentTakeExamClosed
        onBack={() => router.push(`/student/exams/${examId}`)}
      />
    );
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await submitStudentExam({
        exam,
        answers,
        studentId,
        studentName: studentName || "Ð¡ÑƒÑ€Ð°Ð³Ñ‡",
        studentClass,
      });
      router.push(`/student/reports/${exam.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentTakeExamContent
      exam={exam}
      schedule={schedule}
      studentClass={studentClass}
      studentName={studentName || "Ð¡ÑƒÑ€Ð°Ð³Ñ‡"}
      answers={answers}
      answeredCount={answeredCount}
      totalQuestions={totalQuestions}
      completionPercent={completionPercent}
      unansweredCount={unansweredCount}
      isSubmitting={isSubmitting}
      onAnswerChange={handleAnswerChange}
      onSubmit={() => void handleSubmit()}
      onBack={() => router.push(`/student/exams/${exam.id}`)}
    />
  );
}
