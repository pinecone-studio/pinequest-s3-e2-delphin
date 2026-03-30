"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { AIQuestionSettingsPanel } from "@/components/teacher/ai-question-settings-panel";
import { AIQuestionSourceSelector } from "@/components/teacher/ai-question-source-selector";
import type {
  AIQuestionGeneratorDialogProps,
  SourceFileWithPages,
} from "@/components/teacher/ai-question-generator-dialog-types";
import { isBuilderDialogProps } from "@/components/teacher/ai-question-generator-dialog-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function createSourceFileEntry(file: File): SourceFileWithPages {
  return { file, startPage: 1, endPage: 10 };
}

export function AIQuestionGeneratorDialog(props: AIQuestionGeneratorDialogProps) {
  const { isGenerating, onOpenChange, open, selectedMockTests } = props;
  const availableSourceFiles = props.availableSourceFiles ?? [];
  const [sourceFilesWithPages, setSourceFilesWithPages] = useState<
    SourceFileWithPages[]
  >([]);
  const [localAiMCCount, setLocalAiMCCount] = useState(0);
  const [localAiTFCount, setLocalAiTFCount] = useState(0);
  const [localAiShortCount, setLocalAiShortCount] = useState(0);
  const [variants, setVariants] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">(
    "standard",
  );
  const [category, setCategory] = useState("");
  const [localIsDragging, setLocalIsDragging] = useState(false);

  const isBuilderDialog = isBuilderDialogProps(props);
  const aiMCCount = isBuilderDialog ? props.aiMCCount : localAiMCCount;
  const aiTFCount = isBuilderDialog ? props.aiTFCount : localAiTFCount;
  const aiShortCount = isBuilderDialog ? props.aiShortCount : localAiShortCount;
  const selectedSourceFiles = isBuilderDialog ? props.selectedSourceFiles : [];
  const isDragging = isBuilderDialog ? props.isDragging : localIsDragging;
  const hasSource = isBuilderDialog
    ? selectedMockTests.length > 0 || selectedSourceFiles.length > 0
    : selectedMockTests.length > 0 || sourceFilesWithPages.length > 0;
  const totalQuestions = aiMCCount + aiTFCount + aiShortCount;
  const finalQuestionCount = totalQuestions * variants;

  const submit = () => {
    if (isBuilderDialog) {
      void props.onGenerate();
      return;
    }

    void props.onGenerate({
      sourceFilesWithPages,
      aiMCCount,
      aiTFCount,
      aiShortCount,
      variants,
      difficulty,
      category,
      selectedMockTests,
    });
  };

  const handleLocalFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).map(createSourceFileEntry);
      setSourceFilesWithPages((current) => [...current, ...files]);
    }
    event.target.value = "";
  };

  const handleLocalDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLocalIsDragging(false);
    const files = Array.from(event.dataTransfer.files).map(createSourceFileEntry);
    setSourceFilesWithPages((current) => [...current, ...files]);
  };

  const updatePageRange = (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) => {
    setSourceFilesWithPages((current) =>
      current.map((item) =>
        item.file.name === fileName ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeSourceFile = (fileName: string) => {
    setSourceFilesWithPages((current) =>
      current.filter((item) => item.file.name !== fileName),
    );
  };

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Ð°ÑˆÐ¸Ð³Ð»Ð°Ð½ Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…</DialogTitle>
          <DialogDescription>
            ÐœÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½Ð³Ð¸Ð¹Ð½ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´ ÑÑÐ²ÑÐ» ÑˆÐ¸Ð½Ñ Ñ„Ð°Ð¹Ð» Ð´ÑÑÑ€ Ñ‚ÑƒÐ»Ð³ÑƒÑƒÑ€Ð»Ð°Ð½ Ð°ÑÑƒÑƒÐ»Ñ‚
            Ò¯Ò¯ÑÐ³ÑÐ½Ñ.
          </DialogDescription>
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
            aiMCCount={aiMCCount}
            aiShortCount={aiShortCount}
            aiTFCount={aiTFCount}
            category={category}
            difficulty={difficulty}
            finalQuestionCount={finalQuestionCount}
            onAiMCCountChange={isBuilderDialog ? props.setAiMCCount : setLocalAiMCCount}
            onAiShortCountChange={
              isBuilderDialog ? props.setAiShortCount : setLocalAiShortCount
            }
            onAiTFCountChange={isBuilderDialog ? props.setAiTFCount : setLocalAiTFCount}
            onCategoryChange={setCategory}
            onDifficultyChange={setDifficulty}
            onVariantsChange={setVariants}
            totalQuestions={totalQuestions}
            variants={variants}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ð‘Ð¾Ð»Ð¸Ñ…
          </Button>
          <Button
            onClick={submit}
            disabled={isGenerating || !hasSource || totalQuestions === 0}
          >
            {isGenerating
              ? "Ò®Ò¯ÑÐ³ÑÐ¶ Ð±Ð°Ð¹Ð½Ð°..."
              : `${finalQuestionCount} Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
