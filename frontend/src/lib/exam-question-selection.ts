import type { NewQuestion } from "@/components/teacher/exam-builder-types";
import type { QuestionBankQuestion } from "@/lib/question-bank-api";

const EXAM_BUILDER_SELECTION_KEY = "teacher-exam-question-selection";

type SupportedQuestionType = NewQuestion["type"];

type StoredExamQuestionSelection = {
  questions: NewQuestion[];
};

function isSupportedQuestionType(
  type: QuestionBankQuestion["type"],
): type is SupportedQuestionType {
  return (
    type === "multiple-choice" ||
    type === "true-false" ||
    type === "matching" ||
    type === "ordering" ||
    type === "short-answer"
  );
}

export function toExamBuilderQuestion(
  question: QuestionBankQuestion,
  metadata?: {
    categoryName?: string;
    topicName?: string;
  },
): NewQuestion | null {
  if (!isSupportedQuestionType(question.type)) {
    return null;
  }

  return {
    id: `bank-${question.id}`,
    type: question.type,
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer ?? "",
    points: question.points,
    sourceQuestionId: question.id,
    categoryName: metadata?.categoryName,
    topicName: metadata?.topicName,
    difficulty: question.difficulty === "standard" ? "medium" : question.difficulty,
  };
}

export function saveSelectedExamQuestions(questions: NewQuestion[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredExamQuestionSelection = { questions };
  window.sessionStorage.setItem(
    EXAM_BUILDER_SELECTION_KEY,
    JSON.stringify(payload),
  );
}

export function loadSelectedExamQuestions(): NewQuestion[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawPayload = window.sessionStorage.getItem(EXAM_BUILDER_SELECTION_KEY);
  if (!rawPayload) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawPayload) as Partial<StoredExamQuestionSelection>;
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch {
    return [];
  }
}

export function clearSelectedExamQuestions() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(EXAM_BUILDER_SELECTION_KEY);
}
