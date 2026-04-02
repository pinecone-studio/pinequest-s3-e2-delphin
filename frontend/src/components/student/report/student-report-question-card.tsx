"use client";

import type { Exam, ExamResult } from "@/lib/mock-data";
import {
  AiExplanationCard,
  AnswerPanel,
  buildAiExplanation,
  getStatusPresentation,
} from "@/components/student/report/student-report-question-card-parts";
import {
  getAnswerReviewState,
  isManualReviewQuestionType,
  questionTypeLabels,
} from "@/lib/student-report-view";
import { cn } from "@/lib/utils";

type StudentReportQuestionCardProps = {
  index: number;
  question: Exam["questions"][number];
  result: ExamResult;
};

export function StudentReportQuestionCard(props: StudentReportQuestionCardProps) {
  const answer = props.result.answers.find(
    (entry) => entry.questionId === props.question.id,
  );
  const reviewState = getAnswerReviewState(props.question, answer);
  const status = getStatusPresentation(reviewState);
  const StatusIcon = status.icon;
  const isManualQuestion = isManualReviewQuestionType(props.question.type);
  const awardedPoints =
    typeof answer?.awardedPoints === "number" ? answer.awardedPoints : null;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[24px] border bg-white px-6 pb-6 pt-6 shadow-[0_10px_18px_rgba(185,207,228,0.06)]",
        "dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]",
        status.shellClassName,
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[10px] bg-current opacity-100" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="rounded-full bg-[#e6f2ff] px-[14px] py-[5px] text-[11px] font-semibold leading-[14px] text-[#56a7ff] dark:bg-[#1b2959] dark:text-[#89c8ff]">
              {`Асуулт ${props.index + 1}`}
            </span>
            <span className="pt-[1px] text-[11px] font-medium text-[#98a8ba] dark:text-[#94a8c5]">
              {`${questionTypeLabels[props.question.type]} · ${props.question.points} оноо`}
            </span>
          </div>
          <h3 className="mt-5 text-[16px] font-semibold leading-7 text-[#003366] dark:text-[#f3f8ff]">
            {props.question.question}
          </h3>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 text-[14px] font-semibold",
            status.textClassName,
          )}
        >
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </div>
      </div>

      <div className="relative z-10 mt-7 grid gap-4 md:grid-cols-2">
        <AnswerPanel label="Таны хариулт" tone="green">
          {answer?.answer || "Хариулт илгээгээгүй"}
        </AnswerPanel>

        <AnswerPanel
          label={isManualQuestion ? "Үнэлгээний төлөв" : "Зөв хариулт"}
          tone="blue"
        >
          {isManualQuestion
            ? reviewState === "graded"
              ? `Багш ${awardedPoints ?? 0}/${props.question.points} оноо өгсөн.`
              : reviewState === "pending"
                ? "Энэ хариултыг багш гараар шалгаж, оноо өгсний дараа эцсийн дүн шинэчлэгдэнэ."
                : "Хариулт илгээгээгүй."
            : props.question.correctAnswer ||
              "Багш тайлбарын хамт дараа нэмэж оруулна"}
        </AnswerPanel>
      </div>

      <AiExplanationCard
        explanation={buildAiExplanation({
          answerText: answer?.answer ?? "",
          awardedPoints,
          correctAnswer: props.question.correctAnswer ?? "",
          isManualQuestion,
          questionPoints: props.question.points,
          reviewState,
        })}
      />
    </article>
  );
}
