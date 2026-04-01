"use client";

import { ExamBuilderAddQuestionCard } from "@/components/teacher/exam-builder-add-question-card";
import { ExamBuilderQuestionCard } from "@/components/teacher/exam-builder-question-card";
import type {
  NewQuestion,
  QuestionType,
} from "@/components/teacher/exam-builder-types";

type ExamBuilderQuestionListProps = {
  allowAddQuestion?: boolean;
  onAddQuestion: (type: QuestionType) => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  questions: NewQuestion[];
};

export function ExamBuilderQuestionList({
  allowAddQuestion = true,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateOption,
  onUpdateQuestion,
  questions,
}: ExamBuilderQuestionListProps) {
  return (
    <>
      {questions.map((question, index) => (
        <ExamBuilderQuestionCard
          key={question.id}
          index={index}
          question={question}
          onRemoveQuestion={onRemoveQuestion}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
        />
      ))}
      {allowAddQuestion ? (
        <ExamBuilderAddQuestionCard onAddQuestion={onAddQuestion} />
      ) : null}
    </>
  );
}
