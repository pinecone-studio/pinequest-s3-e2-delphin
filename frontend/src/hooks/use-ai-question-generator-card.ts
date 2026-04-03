"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import {
  defaultAIQuestionTypeCounts,
  type AIQuestionTypeCounts,
  type SourceFileWithPages,
} from "@/components/teacher/ai-question-generator-dialog-types";
import {
  getAIQuestionCount,
  getPreparedAIQuestionTypeCounts,
} from "@/hooks/ai-question-builder";

const createSourceFileEntry = (file: File): SourceFileWithPages => ({
  file,
  startPage: 1,
  endPage: 10,
});

export function useAiQuestionGeneratorCard(selectedMockTests: string[]) {
  const [sourceFilesWithPages, setSourceFilesWithPages] = useState<SourceFileWithPages[]>([]);
  const [questionTypeCounts, setQuestionTypeCounts] = useState<AIQuestionTypeCounts>(
    defaultAIQuestionTypeCounts,
  );
  const [variants, setVariants] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">("standard");
  const [isDragging, setIsDragging] = useState(false);

  const totalQuestionCount = getAIQuestionCount(questionTypeCounts);
  const hasSource = selectedMockTests.length > 0 || sourceFilesWithPages.length > 0;

  const updateQuestionTypeCount = (type: keyof AIQuestionTypeCounts, value: number) =>
    setQuestionTypeCounts((current) => ({ ...current, [type]: value }));

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setSourceFilesWithPages((current) => [...current, ...files.map(createSourceFileEntry)]);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setSourceFilesWithPages((current) => [...current, ...files.map(createSourceFileEntry)]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const updatePageRange = (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) =>
    setSourceFilesWithPages((current) =>
      current.map((item) => (item.file.name === fileName ? { ...item, [field]: value } : item)),
    );

  const removeSourceFile = (fileName: string) =>
    setSourceFilesWithPages((current) =>
      current.filter((item) => item.file.name !== fileName),
    );

  const applyDemoPreset = () => {
    const demoCounts = getPreparedAIQuestionTypeCounts();
    setQuestionTypeCounts(demoCounts);
    setTotalPoints(
      demoCounts.multipleChoice +
        demoCounts.trueFalse +
        demoCounts.matching +
        demoCounts.ordering +
        demoCounts.shortAnswer,
    );
    setVariants(1);
    setDifficulty("standard");
  };

  return {
    applyDemoPreset,
    difficulty,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    hasSource,
    isDragging,
    questionTypeCounts,
    removeSourceFile,
    setDifficulty,
    setTotalPoints,
    setVariants,
    sourceFilesWithPages,
    totalQuestionCount,
    totalPoints,
    updatePageRange,
    updateQuestionTypeCount,
    variants,
  };
}
