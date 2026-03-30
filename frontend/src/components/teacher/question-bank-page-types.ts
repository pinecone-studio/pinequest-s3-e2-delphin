import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";

export type GeneratedQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
};

export function createQuestion(type: QuestionType, id: string): NewQuestion {
  return {
    id,
    type,
    question: "",
    points:
      type === "essay"
        ? 15
        : type === "short-answer"
          ? 10
          : type === "true-false"
            ? 5
            : 10,
    options: type === "multiple-choice" ? ["", "", "", ""] : undefined,
    correctAnswer: type === "true-false" ? "True" : "",
  };
}

export function toBuilderQuestion(question: GeneratedQuestion): NewQuestion {
  return {
    id: question.id,
    type: question.type,
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    points: question.points,
  };
}
