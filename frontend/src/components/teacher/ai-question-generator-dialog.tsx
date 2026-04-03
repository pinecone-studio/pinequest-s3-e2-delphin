"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { AIQuestionSettingsPanel } from "@/components/teacher/ai-question-settings-panel";
import { AIQuestionSourceSelector } from "@/components/teacher/ai-question-source-selector";
import {
  defaultAIQuestionTypeCounts,
  isBuilderDialogProps,
  type AIQuestionGeneratorDialogProps,
  type AIQuestionTypeCounts,
  type SourceFileWithPages,
} from "@/components/teacher/ai-question-generator-dialog-types";
import { getAIQuestionCount } from "@/hooks/ai-question-builder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

const createSourceFileEntry = (file: File): SourceFileWithPages => ({ file, startPage: 1, endPage: 10 });

export function AIQuestionGeneratorDialog(props: AIQuestionGeneratorDialogProps) {
  const { isGenerating, onOpenChange, open, selectedMockTests } = props;
  const isBuilderDialog = isBuilderDialogProps(props);
  const [sourceFilesWithPages, setSourceFilesWithPages] = useState<SourceFileWithPages[]>([]);
  const [localQuestionTypeCounts, setLocalQuestionTypeCounts] = useState<AIQuestionTypeCounts>(defaultAIQuestionTypeCounts);
  const [variants, setVariants] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">("standard");
  const [localIsDragging, setLocalIsDragging] = useState(false);
  const questionTypeCounts = isBuilderDialog ? props.aiQuestionTypeCounts : localQuestionTypeCounts;
  const totalQuestionCount = getAIQuestionCount(questionTypeCounts);
  const selectedSourceFiles = isBuilderDialog ? props.selectedSourceFiles : [];
  const isDragging = isBuilderDialog ? props.isDragging : localIsDragging;
  const availableSourceFiles = props.availableSourceFiles ?? [];
  const hasSource = isBuilderDialog ? selectedMockTests.length > 0 || selectedSourceFiles.length > 0 : selectedMockTests.length > 0 || sourceFilesWithPages.length > 0;

  const setQuestionTypeCounts = (value: AIQuestionTypeCounts) =>
    isBuilderDialog ? props.setAiQuestionTypeCounts(value) : setLocalQuestionTypeCounts(value);
  const updateQuestionTypeCount = (type: keyof AIQuestionTypeCounts, value: number) =>
    setQuestionTypeCounts({ ...questionTypeCounts, [type]: value });
  const submit = () =>
    isBuilderDialog
      ? void props.onGenerate()
      : void props.onGenerate({ sourceFilesWithPages, questionTypeCounts, variants, difficulty, selectedMockTests });
  const handleLocalFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) setSourceFilesWithPages((current) => [...current, ...files.map(createSourceFileEntry)]);
    event.target.value = "";
  };
  const handleLocalDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLocalIsDragging(false);
    setSourceFilesWithPages((current) => [...current, ...Array.from(event.dataTransfer.files).map(createSourceFileEntry)]);
  };
  const updatePageRange = (fileName: string, field: "startPage" | "endPage", value: number) =>
    setSourceFilesWithPages((current) => current.map((item) => item.file.name === fileName ? { ...item, [field]: value } : item));
  const removeSourceFile = (fileName: string) =>
    setSourceFilesWithPages((current) => current.filter((item) => item.file.name !== fileName));
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLocalIsDragging(true);
  };
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLocalIsDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI ашиглан асуулт бэлдүүлэх</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <AIQuestionSourceSelector
            availableSourceFiles={availableSourceFiles}
            isBuilderDialog={isBuilderDialog}
            isDragging={isDragging}
            onDragEnter={isBuilderDialog ? props.onDragOver : handleDragOver}
            onDragLeave={isBuilderDialog ? props.onDragLeave : handleDragLeave}
            onDragOver={isBuilderDialog ? props.onDragOver : handleDragOver}
            onDrop={isBuilderDialog ? props.onDrop : handleLocalDrop}
            onFileSelect={isBuilderDialog ? props.onFileSelect : handleLocalFileSelect}
            onRemoveBuilderFile={isBuilderDialog ? props.onRemoveSourceFile : () => {}}
            onRemoveLocalFile={removeSourceFile}
            onToggleTest={props.onToggleTest}
            onUpdatePageRange={updatePageRange}
            selectedBuilderFiles={selectedSourceFiles}
            selectedMockTests={selectedMockTests}
            sourceFilesWithPages={sourceFilesWithPages}
          />
          <AIQuestionSettingsPanel
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onQuestionTypeCountChange={updateQuestionTypeCount}
            onTotalPointsChange={setTotalPoints}
            onVariantsChange={setVariants}
            questionTypeCounts={questionTypeCounts}
            totalQuestionCount={totalQuestionCount}
            totalPoints={totalPoints}
            variants={variants}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Болих</Button>
          <Button onClick={submit} disabled={isGenerating || !hasSource || totalQuestionCount === 0}>
            {isGenerating ? <Spinner className="mr-2" /> : null}
            {isGenerating ? "Бэлдэж байна..." : `${totalQuestionCount * variants} асуулт бэлдүүлэх`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
