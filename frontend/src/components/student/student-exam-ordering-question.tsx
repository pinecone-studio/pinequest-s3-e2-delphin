"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import { StudentExamCard } from "@/components/student/student-exam-question-shell";
import {
  QUESTION_HEADER_META_LABELS,
  parseDelimitedAnswer,
} from "@/components/student/student-exam-utils";

function buildValue(current: string[], key: string) {
  return [...current.filter(Boolean), key].join(",");
}

export function StudentExamOrderingQuestion(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;
  const selected = parseDelimitedAnswer(value);
  const options = question.options ?? [];
  const available = options
    .map((label, itemIndex) => ({ key: String(itemIndex + 1), label }))
    .filter((item) => !selected.includes(item.key));

  return (
    <div className="space-y-4">
      <StudentExamCard
        index={index}
        meta={`${QUESTION_HEADER_META_LABELS[question.type]} · ${question.points} оноо`}
        title={question.question}
        answered={Boolean(selected.length)}
        iconKey={question.iconKey}
      >
        <p className="text-[15px] leading-[24px] text-[#6F7982] dark:text-[#9CADC7]">
          Алхмуудыг зөв дарааллаар байрлуулж, мөр дээр дарж буцаан засах боломжтой.
        </p>
      </StudentExamCard>

      <section className="rounded-[16px] border border-[#E6F2FF] bg-white px-6 py-6 shadow-[0_9px_4px_rgba(201,201,201,0.01),0_5px_3px_rgba(201,201,201,0.05),0_2px_2px_rgba(201,201,201,0.09),0_1px_1px_rgba(201,201,201,0.1)] dark:border-white/10 student-dark-surface">
        <div className="rounded-[14px] border border-dashed border-[#D8E9FB] bg-[#F9FCFF] p-4 dark:border-[#365F9D] dark:bg-[rgba(255,255,255,0.03)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#89939C] dark:text-[#8FA0BB]">
            Сонгох мөрүүд
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {available.map((item) => (
              <button
                key={`${question.id}-${item.key}`}
                type="button"
                onClick={() => onAnswerChange(question.id, buildValue(selected, item.key))}
                className="rounded-[10px] border border-[#E6F2FF] bg-[#F5FAFF] px-4 py-2 text-[13px] font-medium text-[#293138] dark:border-white/10 dark:bg-[rgba(255,255,255,0.04)] dark:text-[#EDF4FF]"
              >
                {item.key}. {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {options.map((_, slotIndex) => {
            const key = selected[slotIndex];
            const label = key ? options[Number(key) - 1] : `${slotIndex + 1}. Хоосон`;

            return (
              <button
                key={`${question.id}-slot-${slotIndex}`}
                type="button"
                onClick={() => onAnswerChange(question.id, selected.filter((_, item) => item !== slotIndex).join(","))}
                className={[
                  "flex min-h-[66px] w-full items-center rounded-[12px] border px-5 text-left",
                  key ? "border-[#B9DAFF] bg-[#F5FAFF] dark:border-[#4E7FC7] dark:bg-[rgba(79,156,249,0.12)] dark:text-[#EDF4FF]" : "border-[#E6F2FF] bg-white text-[#89939C] dark:border-white/10 dark:bg-[#05080C] dark:text-[#8FA0BB]",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
