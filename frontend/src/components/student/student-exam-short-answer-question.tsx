"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import {
  cardShadow,
  StudentExamCardHeader,
} from "@/components/student/student-exam-question-shell";
import { QUESTION_HEADER_META_LABELS } from "@/components/student/student-exam-utils";

export function StudentExamShortAnswerQuestion(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;

  return (
    <section
      className="overflow-hidden rounded-[16px] border border-[#E6F2FF] bg-white dark:border-white/10 student-dark-surface"
      style={{ boxShadow: cardShadow() }}
    >
      <div className="px-7 pb-6 pt-6">
        <StudentExamCardHeader
          index={index}
          meta={`${QUESTION_HEADER_META_LABELS[question.type]} · ${question.points} оноо`}
          title={question.question}
          answered={Boolean(value.trim())}
          iconKey={question.iconKey}
        />
      </div>

      <div className="px-6 pb-6 pt-6">
        <textarea
          value={value}
          onChange={(event) => onAnswerChange(question.id, event.target.value)}
          placeholder="Энд дэлгэрэнгүй тайлбар болон бодолтын алхмуудаа бичнэ үү..."
          className="min-h-[120px] w-full resize-none rounded-[14px] border border-[#E6F2FF] bg-[#F5FAFF] px-5 py-4 text-[18px] leading-[28px] text-[#001933] outline-none placeholder:text-[#89939C] focus:border-[#66B2FF] dark:border-white/10 dark:bg-[#05080C] dark:text-[#EDF4FF] dark:placeholder:text-[#87A2B8] dark:focus:border-[#60A5FA]"
        />
      </div>
    </section>
  );
}
