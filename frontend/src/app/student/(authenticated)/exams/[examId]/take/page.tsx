"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StudentTakeExamContent } from "@/components/student/student-take-exam-content";
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
        if (isMounted)
          console.warn("Failed to load the exam-taking page.", error);
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
    if (!exam || !schedule || !isOpenNow || alreadySubmitted || !studentId)
      return;

    void upsertStudentExamAttempt({
      examId: exam.id,
      studentId,
      studentName: studentName || "Сурагч",
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

  // Tab switching detection
  useEffect(() => {
    if (!exam || !studentId) return;

    const logSuspiciousActivity = async (
      eventType: "tab_hidden" | "window_blurred" | "fullscreen_exited",
    ) => {
      try {
        // TODO: Replace with actual API call
        console.log(`Suspicious activity detected: ${eventType}`, {
          examId: exam.id,
          studentId,
          timestamp: new Date().toISOString(),
          eventType,
        });

        // Mock API call for now
        // await fetch(`/api/exams/${exam.id}/attempts/${studentId}/events`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     eventType,
        //     timestamp: new Date().toISOString()
        //   })
        // })
      } catch (error) {
        console.error("Failed to log suspicious activity:", error);
      }
    };

    // Detect tab/window visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        void logSuspiciousActivity("tab_hidden");
      }
    };

    // Detect window blur (user clicked outside window)
    const handleWindowBlur = () => {
      void logSuspiciousActivity("window_blurred");
    };

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        void logSuspiciousActivity("fullscreen_exited");
      }
    };

    // Request fullscreen on exam start
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen not available:", err);
        });
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Request fullscreen after a short delay
    const fullscreenTimer = setTimeout(requestFullscreen, 1000);

    return () => {
      // Cleanup
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(fullscreenTimer);
    };
  }, [exam, studentId]);

  const answeredCount = exam
    ? exam.questions.filter(
        (question) => (answers[question.id] ?? "").trim().length > 0,
      ).length
    : 0;
  const totalQuestions = exam?.questions.length ?? 0;
  const completionPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground">Шалгалтыг ачаалж байна...</p>
    );

  if (!exam || !schedule) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <Button className="mt-4" onClick={() => router.push("/student/exams")}>
          Шалгалтууд руу буцах
        </Button>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">
          Энэ шалгалтыг аль хэдийн илгээсэн байна
        </h1>
        <p className="text-muted-foreground">
          Таны хариулт хадгалагдсан. Тайлангийн хуудаснаас дүнгээ үзнэ үү.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/student/reports/${examId}`)}>
            Тайлан үзэх
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/student/exams")}
          >
            Шалгалтууд руу буцах
          </Button>
        </div>
      </div>
    );
  }

  if (!isOpenNow) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">
          Шалгалт одоогоор нээлттэй биш байна
        </h1>
        <p className="text-muted-foreground">
          Энэ шалгалтыг зөвхөн товлосон эхлэх хугацаанд өгөх боломжтой.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/student/exams/${examId}`)}
        >
          Шалгалтын дэлгэрэнгүй рүү буцах
        </Button>
      </div>
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
        studentName: studentName || "Сурагч",
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
      studentName={studentName || "Сурагч"}
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
