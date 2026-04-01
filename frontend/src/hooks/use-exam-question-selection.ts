"use client";

import * as React from "react";
import {
  loadSelectedExamQuestions,
  saveSelectedExamQuestions,
  toExamBuilderQuestion,
} from "@/lib/exam-question-selection";
import type { QuestionBankCategory, QuestionBankQuestion } from "@/lib/question-bank-api";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";

export type SelectedQuestionEntry = {
  categoryName: string;
  question: QuestionBankQuestion;
  topicName: string;
};

type UseExamQuestionSelectionProps = {
  questionBank: QuestionBankCategory[];
  setQuestions: React.Dispatch<React.SetStateAction<NewQuestion[]>>;
};

export function useExamQuestionSelection({
  questionBank,
  setQuestions,
}: UseExamQuestionSelectionProps) {
  const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const selectedQuestions = loadSelectedExamQuestions();
    setSelectedQuestionIds(
      selectedQuestions
        .map((question) =>
          question.id.startsWith("bank-") ? question.id.replace("bank-", "") : null,
        )
        .filter((questionId): questionId is string => Boolean(questionId)),
    );
  }, []);

  const questionLookup = React.useMemo(
    () =>
      new Map(
        questionBank.flatMap((category) =>
          category.topics.flatMap((topic) =>
            topic.questions.map((question) => [
              question.id,
              {
                categoryName: category.name,
                question,
                topicName: topic.name,
              } satisfies SelectedQuestionEntry,
            ]),
          ),
        ),
      ),
    [questionBank],
  );

  const selectedQuestions = React.useMemo(
    () =>
      selectedQuestionIds
        .map((questionId) => questionLookup.get(questionId))
        .filter((entry): entry is SelectedQuestionEntry => entry !== undefined),
    [questionLookup, selectedQuestionIds],
  );

  const supportedSelectedQuestions = React.useMemo(
    () =>
      selectedQuestions
        .map(({ question }) => toExamBuilderQuestion(question))
        .filter((question): question is NonNullable<typeof question> => Boolean(question)),
    [selectedQuestions],
  );

  React.useEffect(() => {
    setQuestions((current) => {
      const currentById = new Map(current.map((question) => [question.id, question]));
      const nextQuestions = supportedSelectedQuestions.map(
        (question) => currentById.get(question.id) ?? question,
      );
      const isSame =
        current.length === nextQuestions.length &&
        current.every((question, index) => question.id === nextQuestions[index]?.id);

      if (isSame) {
        return current;
      }

      saveSelectedExamQuestions(nextQuestions);
      return nextQuestions;
    });
  }, [setQuestions, supportedSelectedQuestions]);

  const toggleQuestion = React.useCallback((questionId: string, checked: boolean) => {
    setSelectedQuestionIds((current) =>
      checked
        ? [...new Set([...current, questionId])]
        : current.filter((id) => id !== questionId),
    );
  }, []);

  const moveQuestion = React.useCallback((questionId: string, direction: "up" | "down") => {
    setSelectedQuestionIds((current) => {
      const currentIndex = current.indexOf(questionId);
      if (currentIndex === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
      return next;
    });
  }, []);

  const removeQuestion = React.useCallback((questionId: string) => {
    setSelectedQuestionIds((current) => current.filter((entry) => entry !== questionId));
  }, []);

  return {
    moveQuestion,
    removeQuestion,
    selectedQuestionIds,
    selectedQuestions,
    toggleQuestion,
  };
}
