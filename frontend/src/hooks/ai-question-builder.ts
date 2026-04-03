import type {
  AIQuestionTypeCounts,
} from "@/components/teacher/ai-question-generator-dialog-types";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import {
  DEFAULT_EXAM_QUESTION_ICON_KEY,
  pickQuestionIconKey,
} from "@/lib/question-icons";

export const matchingSeparator = "|||";

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
  const seed = Date.now();
  const questions: Array<{
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
  }> = [
    {
      type: "multiple-choice",
      question: "−5 + 8 = ?",
      options: ["3", "-3", "13", "-13"],
      correctAnswer: "3",
      points: 1,
    },
    {
      type: "true-false",
      question: "Хоёр сөрөг бүхэл тоог үржүүлэхэд эерэг тоо гарна.",
      correctAnswer: "True",
      points: 1,
    },
    {
      type: "matching",
      question: "Match the expressions with their results",
      options: [
        `6 ÷ (-2)${matchingSeparator}-3`,
        `-3 × -2${matchingSeparator}6`,
        `-7 + 2${matchingSeparator}-5`,
      ],
      correctAnswer: "1-A,2-C,3-B",
      points: 1,
    },
    {
      type: "short-answer",
      question:
        "Бүхэл тоо (эерэг ба сөрөг тоо) ашигласан илэрхийлэл бодит жишээг бич.",
      correctAnswer:
        "Жишээ: Агаарын температур 3°C байснаа 8°C-аар өсөхөд 11°C болно.",
      points: 1,
    },
  ];

  return questions.map((entry, index) => {
    const question = createQuestion(entry.type, `ai-prepared-${seed}-${index}`);
    const iconKey = pickQuestionIconKey({
      question: entry.question,
      type: entry.type,
    });

    return {
      ...question,
      question: entry.question,
      options: entry.options,
      correctAnswer: entry.correctAnswer,
      points: entry.points,
      iconKey,
    };
  });
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
