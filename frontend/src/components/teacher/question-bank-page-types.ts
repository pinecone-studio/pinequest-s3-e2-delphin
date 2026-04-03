import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";

const matchingSeparator = "|||";

export type GeneratedQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
  iconKey?: NewQuestion["iconKey"];
};

function createDefaultOptions(type: QuestionType) {
  if (type === "multiple-choice" || type === "ordering") {
    return ["", "", "", ""];
  }

  if (type === "matching") {
    return Array.from({ length: 4 }, () => `${matchingSeparator}`);
  }

  return undefined;
}

export function createQuestion(type: QuestionType, id: string): NewQuestion {
  return {
    id,
    type,
    question: "",
    points: 1,
    options: createDefaultOptions(type),
    correctAnswer:
      type === "true-false"
        ? "True"
        : type === "matching"
          ? "1-A, 2-B, 3-C, 4-D"
          : "",
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
    iconKey: question.iconKey,
  };
}
