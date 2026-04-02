"use client";

import { useEffect, useState } from "react";
import type { Exam } from "@/lib/mock-data";
import { ForceLightTheme } from "@/components/student/force-light-theme";
import { StudentExamProgressSidebar } from "@/components/student/student-exam-progress-sidebar";
import { StudentExamQuestionList } from "@/components/student/student-exam-question-list";
import { StudentExamTopSection } from "@/components/student/student-exam-top-section";
import { getOrderedQuestions } from "@/components/student/student-exam-utils";

function formatTimer(totalSeconds: number) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function StudentExamHtmlCanvas(props: {
  exam: Exam;
  schedule: { date: string; time: string };
  studentClass: string;
  studentName: string;
  answers: Record<string, string>;
  answeredCount: number;
  totalQuestions: number;
  completionPercent: number;
  unansweredCount: number;
  isSubmitting: boolean;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const {
    exam,
    schedule,
    answers,
    answeredCount,
    totalQuestions,
    completionPercent,
    unansweredCount,
    isSubmitting,
    onAnswerChange,
    onSubmit,
    onBack,
  } = props;
  const [remainingSeconds, setRemainingSeconds] = useState(exam.duration * 60);

  useEffect(() => {
    setRemainingSeconds(exam.duration * 60);
  }, [exam.duration]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen px-10 pb-14 pt-6 text-[#293138]">
      <ForceLightTheme />
      <div className="mx-auto w-full max-w-[1356px]">
        <div className="mt-10 flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 space-y-10 xl:max-w-[1023px]">
            <StudentExamTopSection exam={exam} schedule={schedule} onBack={onBack} />
            <StudentExamQuestionList
              questions={getOrderedQuestions(exam)}
              answers={answers}
              onAnswerChange={onAnswerChange}
            />
          </div>
          <StudentExamProgressSidebar
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
            completionPercent={completionPercent}
            unansweredCount={unansweredCount}
            timerLabel={formatTimer(remainingSeconds)}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onBack={onBack}
            className="xl:mt-[113px]"
          />
        </div>
      </div>
    </div>
  );
}
