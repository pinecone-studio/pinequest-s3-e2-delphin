import type {
  AIQuestionTypeCounts,
} from "@/components/teacher/ai-question-generator-dialog-types";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import {
  DEFAULT_EXAM_QUESTION_ICON_KEY,
} from "@/lib/question-icons";
import {
  buildAiQuestion,
  createPreparedAiQuestions as createPreparedAiQuestionPresets,
} from "@/hooks/ai-question-builder-presets";
import { matchingSeparator } from "@/lib/matching-separator";

const PREPARED_AI_QUESTION_TYPES = {
  multipleChoice: 1,
  trueFalse: 1,
  matching: 1,
  ordering: 0,
  shortAnswer: 1,
} satisfies AIQuestionTypeCounts;

function createDefaultOptions(type: QuestionType) {
  if (type === "multiple-choice" || type === "ordering") return ["", "", "", ""];
  if (type === "matching") return Array.from({ length: 4 }, () => `${matchingSeparator}`);
  return undefined;
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

export function alignAIQuestionCounts(
  counts: AIQuestionTypeCounts,
  targetCount: number,
): AIQuestionTypeCounts {
  const safeTarget = Math.max(0, targetCount);
  const currentTotal = getAIQuestionCount(counts);
  if (currentTotal >= safeTarget) return counts;
  return {
    ...counts,
    multipleChoice: counts.multipleChoice + (safeTarget - currentTotal),
  };
}

export function getPreparedAIQuestionTypeCounts(): AIQuestionTypeCounts {
  return { ...PREPARED_AI_QUESTION_TYPES };
}

export function createPreparedAiQuestions() {
  return createPreparedAiQuestionPresets(Date.now());
}

export function createAiQuestions(counts: AIQuestionTypeCounts) {
  const seed = Date.now();
  return expandQuestionTypes(counts).map((type, index) => buildAiQuestion(type, seed, index));
}
