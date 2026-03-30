"use client";

import { useState } from "react";
import { createQuestion } from "@/components/teacher/question-bank-page-types";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import type { QuestionBankDifficulty } from "@/lib/question-bank-api";

export function useQuestionBankBuilder() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [builderCategoryId, setBuilderCategoryId] = useState("");
  const [builderTopicName, setBuilderTopicName] = useState("");
  const [builderDifficulty, setBuilderDifficulty] =
    useState<QuestionBankDifficulty>("standard");
  const [builderQuestions, setBuilderQuestions] = useState<NewQuestion[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [builderNewCategoryName, setBuilderNewCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const addQuestion = (type: QuestionType) => {
    setBuilderQuestions((current) => [
      ...current,
      createQuestion(type, `new-${Date.now()}-${current.length}`),
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<NewQuestion>) => {
    setBuilderQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, ...updates } : question)),
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setBuilderQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId || !question.options) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  };

  const removeQuestion = (id: string) => {
    setBuilderQuestions((current) => current.filter((question) => question.id !== id));
  };

  const resetBuilder = () => {
    setBuilderTopicName("");
    setBuilderDifficulty("standard");
    setBuilderQuestions([]);
    setSelectedSourceIds([]);
  };

  return {
    addQuestion,
    builderCategoryId,
    builderDifficulty,
    builderNewCategoryName,
    builderQuestions,
    builderTopicName,
    newCategoryName,
    removeQuestion,
    resetBuilder,
    searchQuery,
    selectedCategoryFilter,
    selectedDifficulty,
    selectedSourceIds,
    setBuilderCategoryId,
    setBuilderDifficulty,
    setBuilderNewCategoryName,
    setBuilderQuestions,
    setBuilderTopicName,
    setNewCategoryName,
    setSearchQuery,
    setSelectedCategoryFilter,
    setSelectedDifficulty,
    setSelectedSourceIds,
    setShowAIDialog,
    setShowBuilder,
    showAIDialog,
    showBuilder,
    updateOption,
    updateQuestion,
  };
}
