"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import {
  cardShadow,
  StudentExamCardHeader,
  StudentExamOptionBadge,
} from "@/components/student/student-exam-question-shell";
import {
  QUESTION_HEADER_META_LABELS,
  getChoiceOptions,
} from "@/components/student/student-exam-utils";

export function StudentExamChoiceQuestion(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;
  const options = getChoiceOptions(question);

  return (
    <section
      className="overflow-hidden rounded-[16px] border border-[#E6F2FF] bg-white"
      style={{ boxShadow: cardShadow() }}
    >
      <div className="px-7 pb-5 pt-6">
        <StudentExamCardHeader
          index={index}
          meta={`${QUESTION_HEADER_META_LABELS[question.type]} · ${question.points} оноо`}
          title={question.question}
          answered={Boolean(value)}
        />
      </div>

      <div className="border-t border-[#EAF2FB] px-7 pb-4 pt-[22px]">
        <div className="grid gap-[20px_12px] md:grid-cols-2">
          {options.map((option, optionIndex) => {
            const selected = value === option;

            return (
              <button
                key={`${question.id}-${option}`}
                type="button"
                onClick={() => onAnswerChange(question.id, option)}
                className={[
                  "flex h-[66px] w-full items-center rounded-[12px] bg-[#F5FAFF] px-6 text-left",
                  selected ? "border-2 border-[#66B2FF]" : "border border-[#E6F2FF]",
                ].join(" ")}
              >
                <div className="flex items-center gap-[18px]">
                  <StudentExamOptionBadge value={String(optionIndex + 1)} active={selected} />
                  <span className="text-[18px] font-medium leading-[24px] text-[#001933]">
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
