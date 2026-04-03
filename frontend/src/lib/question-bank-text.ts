import type {
  QuestionBankCategory,
  QuestionBankQuestion,
  QuestionBankTopic,
} from "@/lib/question-bank-api";
import { repairMojibakeText } from "@/lib/repair-mojibake";

export function getReadableQuestionBankText(value: string) {
  return repairMojibakeText(value);
}

export function normalizeQuestionBank(categories: QuestionBankCategory[]) {
  return categories.map((category) => ({
    ...category,
    name: getReadableQuestionBankText(category.name),
    topics: category.topics.map(normalizeQuestionBankTopic),
  }));
}

function normalizeQuestionBankTopic(topic: QuestionBankTopic): QuestionBankTopic {
  return {
    ...topic,
    name: getReadableQuestionBankText(topic.name),
    questions: topic.questions.map(normalizeQuestionBankQuestion),
  };
}

function normalizeQuestionBankQuestion(
  question: QuestionBankQuestion,
): QuestionBankQuestion {
  return {
    ...question,
    question: getReadableQuestionBankText(question.question),
    options: question.options?.map(getReadableQuestionBankText),
    correctAnswer: question.correctAnswer
      ? getReadableQuestionBankText(question.correctAnswer)
      : question.correctAnswer,
  };
}
