"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import { StudentExamChoiceQuestion } from "@/components/student/student-exam-choice-question";
import { StudentExamFillQuestion } from "@/components/student/student-exam-fill-question";
import { StudentExamMatchingQuestion } from "@/components/student/student-exam-matching-question";
import { StudentExamOrderingQuestion } from "@/components/student/student-exam-ordering-question";
import { StudentExamShortAnswerQuestion } from "@/components/student/student-exam-short-answer-question";

export function StudentExamQuestionContent(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;

  if (question.type === "multiple-choice" || question.type === "true-false") {
    return (
      <StudentExamChoiceQuestion
        index={index}
        question={question}
        value={value}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  if (question.type === "short-answer") {
    return (
      <StudentExamShortAnswerQuestion
        index={index}
        question={question}
        value={value}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  if (question.type === "matching") {
    return (
      <StudentExamMatchingQuestion
        index={index}
        question={question}
        value={value}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  if (question.type === "fill") {
    return (
      <StudentExamFillQuestion
        index={index}
        question={question}
        value={value}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  return (
    <StudentExamOrderingQuestion
      index={index}
      question={question}
      value={value}
      onAnswerChange={onAnswerChange}
    />
  );
}
