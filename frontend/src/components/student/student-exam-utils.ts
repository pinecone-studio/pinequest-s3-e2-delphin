import type { Exam, ExamQuestion } from "@/lib/mock-data";

export const INTRO_TEXT =
  "Асуулт бүрийг анхааралтай уншаад, хамгийн зөв хариултаа сонгоно уу.";

export const QUESTION_TYPE_LABELS: Record<ExamQuestion["type"], string> = {
  "multiple-choice": "Сонгох хариулттай",
  fill: "Нөхөх",
  "short-answer": "Богино хариулт",
  matching: "Хослуулах",
  ordering: "Дараалуулах",
  "true-false": "Үнэн / Худал",
};

export const QUESTION_HEADER_META_LABELS: Record<ExamQuestion["type"], string> = {
  "multiple-choice": "Сонгох даалгавар",
  fill: "Нөхөх даалгавар",
  "short-answer": "Богино хариулт",
  matching: "Хослуулах даалгавар",
  ordering: "Дараалуулах даалгавар",
  "true-false": "Үнэн эсвэл худал",
};

export function getOrderedQuestions(exam: Exam) {
  const order: ExamQuestion["type"][] = [
    "multiple-choice",
    "short-answer",
    "matching",
    "fill",
    "true-false",
    "ordering",
  ];

  return order.flatMap((type) =>
    exam.questions.filter((question) => question.type === type),
  );
}

export function getChoiceOptions(question: ExamQuestion) {
  if (question.type === "true-false") {
    return ["True", "False"];
  }

  return question.options ?? [];
}

export function parseDelimitedAnswer(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
