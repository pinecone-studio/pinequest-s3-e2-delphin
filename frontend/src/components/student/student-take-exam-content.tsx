"use client";

import Link from "next/link";
import { Clock3, FileQuestion, UserRound } from "lucide-react";
import { StudentTakeExamQuestionCard } from "@/components/student/student-take-exam-question-card";
import { StudentTakeExamSidebar } from "@/components/student/student-take-exam-sidebar";
import type { Exam } from "@/lib/mock-data";

export function StudentTakeExamContent(props: {
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
    studentClass,
    studentName,
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

  return (
    <div className="min-h-screen bg-[#F6FAFE]">
      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <Link
                href={`/student/exams/${exam.id}`}
                className="text-sm text-[#6F7982] hover:text-[#293138] hover:underline"
              >
                &larr; Шалгалтын дэлгэрэнгүй рүү буцах
              </Link>
              <div className="rounded-[20px] border border-[#E6F2FF] bg-white p-4 shadow-[0_10px_30px_rgba(41,49,56,0.08)] md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center rounded-full bg-[#E6F2FF] px-3 py-1 text-xs font-semibold text-[#007FFF]">
                      Оюутны шалгалт өгөх хэсэг
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#293138] md:text-3xl">
                      {exam.title}
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-[#6F7982]">
                      Асуулт бүрийг анхааралтай уншаад хариулна уу. Сонгох
                      асуултын мөр бүхэлдээ дарж сонгох боломжтой болгосон.
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-2xl border border-[#E6F2FF] bg-[#FCFCFF] p-3 text-sm text-[#293138] md:p-4">
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-[#007FFF]" />
                      <span className="text-xs md:text-sm">
                        {schedule.date} {schedule.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileQuestion className="size-4 text-[#007FFF]" />
                      <span className="text-xs md:text-sm">
                        {exam.duration} минут • {exam.questions.length} асуулт
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-[#007FFF]" />
                      <span className="text-xs md:text-sm">
                        {studentName} • {studentClass}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-5">
              {exam.questions.map((question, index) => (
                <StudentTakeExamQuestionCard
                  key={question.id}
                  index={index}
                  question={question}
                  value={answers[question.id] ?? ""}
                  onAnswerChange={onAnswerChange}
                />
              ))}
            </div>
          </div>

          <div className="lg:w-80">
            <StudentTakeExamSidebar
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
              completionPercent={completionPercent}
              unansweredCount={unansweredCount}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onBack={onBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

