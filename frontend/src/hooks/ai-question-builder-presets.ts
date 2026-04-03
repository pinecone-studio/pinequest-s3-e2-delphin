import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import { pickQuestionIconKey } from "@/lib/question-icons";
import { createQuestion, matchingSeparator } from "@/hooks/ai-question-builder";

type PreparedQuestionSeed = {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
};

const PREPARED_AI_QUESTIONS: PreparedQuestionSeed[] = [
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
    question: "Бүхэл тоо (эерэг ба сөрөг тоо) ашигласан илэрхийлэл бодит жишээг бич.",
    correctAnswer:
      "Жишээ: Агаарын температур 3°C байснаа 8°C-аар өсөхөд 11°C болно.",
    points: 1,
  },
];

export function createPreparedAiQuestions(seed: number): NewQuestion[] {
  return PREPARED_AI_QUESTIONS.map((entry, index) => {
    const question = createQuestion(entry.type, `ai-prepared-${seed}-${index}`);

    return {
      ...question,
      question: entry.question,
      options: entry.options,
      correctAnswer: entry.correctAnswer,
      points: entry.points,
      iconKey: pickQuestionIconKey({ question: entry.question, type: entry.type }),
    };
  });
}

export function buildAiQuestion(type: QuestionType, seed: number, index: number): NewQuestion {
  const question = createQuestion(type, `ai-${type}-${seed}-${index}`);
  const prompt = getGeneratedPrompt(type, index);
  const iconKey = pickQuestionIconKey({ question: prompt, type });

  switch (type) {
    case "multiple-choice":
      return {
        ...question,
        question: prompt,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        iconKey,
      };
    case "true-false":
      return { ...question, question: prompt, correctAnswer: "True", iconKey };
    case "matching":
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
    case "ordering":
      return {
        ...question,
        question: prompt,
        options: ["Step 1", "Step 2", "Step 3", "Step 4"],
        correctAnswer: "1,2,3,4",
        iconKey,
      };
    case "short-answer":
      return {
        ...question,
        question: prompt,
        correctAnswer: "Expected answer",
        iconKey,
      };
    case "fill":
      return {
        ...question,
        question: prompt,
        correctAnswer: "Expected answer",
        iconKey,
      };
  }
}

function getGeneratedPrompt(type: QuestionType, index: number) {
  if (type === "multiple-choice") return `AI generated multiple choice question ${index + 1}`;
  if (type === "true-false") return `AI generated true false question ${index + 1}`;
  if (type === "matching") return `AI generated matching question ${index + 1}`;
  if (type === "ordering") return `AI generated ordering question ${index + 1}`;
  if (type === "fill") return `AI generated fill in the blank question ${index + 1}`;
  return `AI generated short answer question ${index + 1}`;
}
