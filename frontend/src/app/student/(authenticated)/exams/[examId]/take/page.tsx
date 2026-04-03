"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StudentExamHtmlCanvas } from "@/components/student/student-exam-html-canvas";
import {
  StudentTakeExamClosed,
  StudentTakeExamNotFound,
  StudentTakeExamSubmitted,
} from "@/components/student/student-take-exam-states";
import { Spinner } from "@/components/ui/spinner";
import { useExamIntegrityGuard } from "@/hooks/use-exam-integrity-guard";
import { useStudentExamDraft } from "@/hooks/use-student-exam-draft";
import { useStudentSession } from "@/hooks/use-student-session";
import { exams as legacyExams, type Exam } from "@/lib/mock-data";
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
  const resolvedStudentName = studentName || "Сурагч";
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams);
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
            (result) => result.examId === examId && result.studentId === studentId,
          ),
        );
      } catch (error) {
        if (isMounted) console.warn("Failed to load the exam-taking page.", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadPage();
    return () => {
      isMounted = false;
    };
  }, [examId, studentId]);

  const exam = useMemo(() => allExams.find((entry) => entry.id === examId), [allExams, examId]);
  const schedule = exam?.scheduledClasses.find((entry) => entry.classId === studentClass);
  const isOpenNow = schedule && exam
    ? isScheduleOpenNow(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely)
    : false;
  const { answers, currentQuestion, isDraftReady, setAnswer } = useStudentExamDraft({
    exam,
    studentId,
    studentName: resolvedStudentName,
    studentClass,
    isOpenNow,
    alreadySubmitted,
  });

  useExamIntegrityGuard({
    answers,
    currentQuestion,
    examId: exam?.id,
    studentClass,
    studentId,
    studentName: resolvedStudentName,
  });

  if (isLoading || !isDraftReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        <p>Шалгалтыг ачаалж байна...</p>
      </div>
    );
  }

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
    return <StudentTakeExamClosed onBack={() => router.push(`/student/exams/${examId}`)} />;
  }

  const answeredCount = Object.values(answers).filter((value) => value.trim().length > 0).length;
  const totalQuestions = exam.questions.length;
  const completionPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <StudentExamHtmlCanvas
      exam={exam}
      schedule={schedule}
      studentClass={studentClass}
      studentName={resolvedStudentName}
      answers={answers}
      answeredCount={answeredCount}
      totalQuestions={totalQuestions}
      completionPercent={completionPercent}
      unansweredCount={Math.max(totalQuestions - answeredCount, 0)}
      isSubmitting={isSubmitting}
      onAnswerChange={setAnswer}
      onSubmit={() => {
        if (!studentId || isSubmitting) return;

        setIsSubmitting(true);
        void submitStudentExam({
          exam,
          answers,
          currentQuestion,
          studentId,
          studentName: resolvedStudentName,
          studentClass,
        })
          .then(() => {
            setAlreadySubmitted(true);
            router.push(`/student/reports/${examId}`);
          })
          .finally(() => setIsSubmitting(false));
      }}
      onBack={() => router.push(`/student/exams/${examId}`)}
    />
  );
}
