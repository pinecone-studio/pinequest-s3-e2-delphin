"use client";

import { useMemo, useState } from "react";
import type { ExamQuestion } from "@/lib/mock-data";
import { cardShadow } from "@/components/student/student-exam-question-shell";
import { PickQuestionHeader } from "@/components/student/student-exam-matching-question-header";
import { MatchingQuestionRow } from "@/components/student/student-exam-matching-question-row";
import {
  buildMatchingSelections,
  getMatchingConfig,
  parseMatchingSelections,
} from "@/components/student/student-exam-matching-question-utils";
import { QUESTION_HEADER_META_LABELS } from "@/components/student/student-exam-utils";

export function StudentExamMatchingQuestion(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { choices, rows } = useMemo(() => getMatchingConfig(question), [question]);
  const selections = parseMatchingSelections(value, rows.length);
  const choiceLabelMap = useMemo(
    () => new Map(choices.map((choice) => [choice.value, choice.label])),
    [choices],
  );
  const hasAnswer = selections.some((selection) => selection.length > 0);

  return (
    <section
      className="mx-auto w-full max-w-[983px] overflow-visible rounded-[16px] border border-[#E6F2FF] bg-white dark:border-white/10 student-dark-surface"
      style={{ boxShadow: cardShadow() }}
    >
      <div className="px-6 pb-5 pt-6">
        <PickQuestionHeader
          index={index}
          meta={`${QUESTION_HEADER_META_LABELS.matching} · ${question.points} оноо`}
          title={question.question}
          answered={hasAnswer}
        />
      </div>

      <div className="border-t border-[#E6F2FF] px-6 pb-6 pt-5 dark:border-white/10">
        <div className="space-y-[13px]">
          {rows.map((row, optionIndex) => {
            const rowKey = `${question.id}-${optionIndex}`;
            const selectedValue = selections[optionIndex] ?? "";
            const selectedLabel = choiceLabelMap.get(selectedValue) ?? "";

            return (
              <MatchingQuestionRow
                key={rowKey}
                choiceLabel={selectedLabel}
                choices={choices}
                isAnswered={selectedValue.length > 0}
                isOpen={openIndex === optionIndex}
                onSelect={(choiceValue) => {
                  const nextSelections = [...selections];
                  const duplicateIndex = nextSelections.findIndex(
                    (entry, entryIndex) =>
                      entryIndex !== optionIndex && entry === choiceValue,
                  );

                  if (duplicateIndex >= 0) {
                    nextSelections[duplicateIndex] = "";
                  }

                  nextSelections[optionIndex] = choiceValue;
                  onAnswerChange(
                    question.id,
                    buildMatchingSelections(nextSelections),
                  );
                  setOpenIndex(null);
                }}
                onToggle={() =>
                  setOpenIndex((current) =>
                    current === optionIndex ? null : optionIndex,
                  )
                }
                optionIndex={optionIndex}
                row={row}
                rowKey={rowKey}
                selectedValue={selectedValue}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
