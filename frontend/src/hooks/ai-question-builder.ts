import type {
  AIQuestionTypeCounts,
} from "@/components/teacher/ai-question-generator-dialog-types";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import {
  DEFAULT_EXAM_QUESTION_ICON_KEY,
  pickQuestionIconKey,
} from "@/lib/question-icons";

export const matchingSeparator = "|||";

function createDefaultOptions(type: QuestionType) {
  if (type === "multiple-choice" || type === "ordering") return ["", "", "", ""];
  if (type === "matching") return Array.from({ length: 4 }, () => `${matchingSeparator}`);
  return undefined;
}

function getGeneratedPrompt(type: QuestionType, index: number) {
  if (type === "multiple-choice") return `AI generated multiple choice question ${index + 1}`;
  if (type === "true-false") return `AI generated true false question ${index + 1}`;
  if (type === "matching") return `AI generated matching question ${index + 1}`;
  if (type === "ordering") return `AI generated ordering question ${index + 1}`;
  return `AI generated short answer question ${index + 1}`;
}

export function createQuestion(type: QuestionType, id: string): NewQuestion {
  return {
    id,
    type,
    question: "",
    points: 1,
    iconKey: DEFAULT_EXAM_QUESTION_ICON_KEY,
    options: createDefaultOptions(type),
    correctAnswer:
      type === "true-false"
        ? "True"
        : type === "matching"
          ? "1-A, 2-B, 3-C, 4-D"
          : "",
  };
}

function expandQuestionTypes(counts: AIQuestionTypeCounts): QuestionType[] {
  return [
    ...Array.from({ length: counts.multipleChoice }, () => "multiple-choice" as const),
    ...Array.from({ length: counts.trueFalse }, () => "true-false" as const),
    ...Array.from({ length: counts.matching }, () => "matching" as const),
    ...Array.from({ length: counts.ordering }, () => "ordering" as const),
    ...Array.from({ length: counts.shortAnswer }, () => "short-answer" as const),
  ];
}

export function getAIQuestionCount(counts: AIQuestionTypeCounts) {
  return (
    counts.multipleChoice +
    counts.trueFalse +
    counts.matching +
    counts.ordering +
    counts.shortAnswer
  );
}

export function createAiQuestions(counts: AIQuestionTypeCounts) {
  const seed = Date.now();
  return expandQuestionTypes(counts).map((type, index) => {
    const question = createQuestion(type, `ai-${type}-${seed}-${index}`);
    const prompt = getGeneratedPrompt(type, index);
    const iconKey = pickQuestionIconKey({ question: prompt, type });

    if (type === "multiple-choice") {
      return {
        ...question,
        question: prompt,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        iconKey,
      };
    }

    if (type === "true-false") {
      return {
        ...question,
        question: prompt,
        correctAnswer: "True",
        iconKey,
      };
    }

    if (type === "matching") {
      return {
        ...question,
        question: prompt,
        options: [
          `Term 1${matchingSeparator}Definition A`,
          `Term 2${matchingSeparator}Definition B`,
          `Term 3${matchingSeparator}Definition C`,
          `Term 4${matchingSeparator}Definition D`,
        ],
        correctAnswer: "1-A, 2-B, 3-C, 4-D",
        iconKey,
      };
    }

    if (type === "ordering") {
      return {
        ...question,
        question: prompt,
        options: ["Step 1", "Step 2", "Step 3", "Step 4"],
        correctAnswer: "1,2,3,4",
        iconKey,
      };
    }

    return {
      ...question,
      question: prompt,
      correctAnswer: "Expected answer",
      iconKey,
    };
  });
}
