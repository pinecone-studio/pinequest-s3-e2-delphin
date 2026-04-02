"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import { parseDelimitedAnswer } from "@/components/student/student-exam-utils";

export function StudentExamMatchingEditor(props: {
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { question, value, onAnswerChange } = props;
  const options = question.options ?? [];
  const selected = parseDelimitedAnswer(value);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((option, index) => (
        <div key={`${question.id}-${option}`} className="rounded-[16px] border border-[#DCEBFA] bg-[#FBFDFF] p-4">
          <div className="mb-3 text-[15px] font-semibold text-[#293138]">{option}</div>
          <select
            value={selected[index] ?? ""}
            onChange={(event) => {
              const next = [...selected];
              next[index] = event.target.value;
              onAnswerChange(question.id, next.join(","));
            }}
            className="h-12 w-full rounded-[12px] border border-[#DCEBFA] bg-white px-4 text-[15px] text-[#3F4850] outline-none focus:border-[#007FFF]"
          >
            <option value="">Сонгох</option>
            {options.map((candidate) => (
              <option key={`${question.id}-candidate-${candidate}`} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function StudentExamOrderingEditor(props: {
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { question, value, onAnswerChange } = props;
  const options = question.options ?? [];
  const selected = parseDelimitedAnswer(value);

  return (
    <div className="grid gap-6">
      <div className="rounded-[16px] border border-dashed border-[#CFE3F8] bg-[#FBFDFF] p-5">
        <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#89939C]">
          Сонгох мөрүүд
        </div>
        <div className="flex flex-wrap gap-3">
          {options.map((option, index) => {
            const token = String(index + 1);
            const isUsed = selected.includes(token);
            return (
              <button
                key={`${question.id}-choice-${token}`}
                type="button"
                disabled={isUsed}
                onClick={() => onAnswerChange(question.id, [...selected, token].join(","))}
                className={isUsed
                  ? "cursor-not-allowed rounded-[10px] border border-[#DCEBFA] bg-[#EEF5FC] px-4 py-2 text-[14px] font-medium text-[#9AA7B6]"
                  : "rounded-[10px] border border-[#BFD9F8] bg-white px-4 py-2 text-[14px] font-medium text-[#293138]"}
              >
                {`${index + 1}. ${option}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3">
        {options.map((_, index) => {
          const token = selected[index];
          const label = token ? options[Number(token) - 1] : `${index + 1}. Хоосон`;
          return (
            <button
              key={`${question.id}-slot-${index}`}
              type="button"
              onClick={() => {
                if (!token) return;
                onAnswerChange(
                  question.id,
                  selected.filter((_, itemIndex) => itemIndex !== index).join(","),
                );
              }}
              className={token
                ? "flex min-h-[54px] items-center rounded-[14px] border border-[#66B2FF] bg-[#F5FAFF] px-4 text-left text-[15px] text-[#293138]"
                : "flex min-h-[54px] items-center rounded-[14px] border border-[#DCEBFA] bg-white px-4 text-left text-[15px] text-[#9AA7B6]"}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
