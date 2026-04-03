"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import {
  cardShadow,
} from "@/components/student/student-exam-question-shell";
import { QUESTION_HEADER_META_LABELS } from "@/components/student/student-exam-utils";
import {
  getExamQuestionIconAlt,
  getExamQuestionIconSrc,
} from "@/lib/question-icons";

function StatusIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.5331 6.66666C14.8376 8.16086 14.6206 9.71428 13.9183 11.0679C13.2161 12.4214 12.071 13.4934 10.6741 14.1049C9.27718 14.7164 7.71284 14.8305 6.24196 14.4282C4.77107 14.026 3.48255 13.1316 2.59127 11.8943C1.7 10.657 1.25984 9.15148 1.3442 7.62892C1.42856 6.10635 2.03234 4.65872 3.05486 3.52744C4.07737 2.39616 5.45681 1.64961 6.96313 1.4123C8.46946 1.17498 10.0116 1.46123 11.3324 2.22333" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7.33341L8 9.33341L14.6667 2.66675" stroke="#00C853" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function splitFillPrompt(prompt: string) {
  const marker = "___";

  if (!prompt.includes(marker)) {
    return { before: prompt, after: "" };
  }

  const [before, after] = prompt.split(marker);
  return { before: before.trimEnd(), after: after.trimStart() };
}

export function StudentExamFillQuestion(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;
  const { before, after } = splitFillPrompt(question.question);

  return (
    <section
      className="rounded-[16px] border border-[#E6F2FF] bg-white px-6 pb-[21px] pt-6 dark:border-white/10 student-dark-surface"
      style={{ boxShadow: cardShadow() }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="inline-flex h-[31px] items-center rounded-full bg-[#E6F2FF] px-4 text-[14px] font-semibold leading-[18px] text-[#007FFF] dark:bg-[#1B2959] dark:text-[#89C8FF]">
            Асуулт {index + 1}
          </div>
          <p className="truncate text-[16px] font-medium leading-[20px] text-[#6F7982] dark:text-[#9CADC7]">
            {`${QUESTION_HEADER_META_LABELS.fill} · ${question.points} оноо`}
          </p>
        </div>
        <div className={`mt-1 inline-flex min-h-[31px] items-center gap-1.5 text-[14px] font-semibold ${value.trim() ? "text-[#00C853] dark:text-[#62E28A]" : "text-[#89939C] dark:text-[#8FA0BB]"}`}>
          {value.trim() ? <StatusIcon /> : null}
          <span>{value.trim() ? "Хариулсан" : "Хариулаагүй"}</span>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E6F2FF] bg-[#F7FBFF] dark:border-white/10 dark:bg-[rgba(255,255,255,0.04)]">
          <img
            src={getExamQuestionIconSrc(question.iconKey)}
            alt={getExamQuestionIconAlt(question.iconKey)}
            className="h-9 w-9 object-contain"
          />
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-3 text-[20px] font-semibold leading-[28px] text-[#293138] dark:text-[#F3F8FF]">
          <span>{before}</span>
          <input
            value={value}
            onChange={(event) => onAnswerChange(question.id, event.target.value)}
            className="h-[35px] w-[199px] rounded-[10px] border border-[#E6F2FF] bg-white px-4 text-[16px] font-medium leading-[20px] text-[#293138] outline-none focus:border-[#66B2FF] dark:border-white/10 dark:bg-[#05080C] dark:text-[#EDF4FF] dark:focus:border-[#60A5FA]"
          />
          {after ? <span>{after}</span> : null}
        </div>
      </div>
    </section>
  );
}
