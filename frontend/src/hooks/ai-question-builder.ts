import type {
  AIQuestionTypeCounts,
} from "@/components/teacher/ai-question-generator-dialog-types";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";

export const matchingSeparator = "|||";

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

export function createAiQuestions(counts: AIQuestionTypeCounts) {
  const seed = Date.now();
  return expandQuestionTypes(counts).map((type, index) => {
    const question = createQuestion(type, `ai-${type}-${seed}-${index}`);
    if (type === "multiple-choice") {
      return { ...question, question: `AI үүсгэсэн сонгох хариулттай асуулт ${index + 1}`, options: ["Сонголт A", "Сонголт B", "Сонголт C", "Сонголт D"], correctAnswer: "Сонголт A" };
    }
    if (type === "true-false") {
      return { ...question, question: `AI үүсгэсэн үнэн / худал асуулт ${index + 1}`, correctAnswer: "True" };
    }
    if (type === "matching") {
      return {
        ...question,
        question: `AI үүсгэсэн харгалзуулах асуулт ${index + 1}`,
        options: [
          `Нэр томьёо 1${matchingSeparator}Тайлбар A`,
          `Нэр томьёо 2${matchingSeparator}Тайлбар B`,
          `Нэр томьёо 3${matchingSeparator}Тайлбар C`,
          `Нэр томьёо 4${matchingSeparator}Тайлбар D`,
        ],
        correctAnswer: "1-A, 2-B, 3-C, 4-D",
      };
    }
    if (type === "ordering") {
      return { ...question, question: `AI үүсгэсэн дараалуулах асуулт ${index + 1}`, options: ["Алхам 1", "Алхам 2", "Алхам 3", "Алхам 4"], correctAnswer: "1,2,3,4" };
    }
    return { ...question, question: `AI үүсгэсэн богино хариултын асуулт ${index + 1}`, correctAnswer: "Хүлээгдэж буй хариулт" };
  });
}
