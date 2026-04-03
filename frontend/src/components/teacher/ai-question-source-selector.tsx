"use client";

import { useEffect, useMemo, useState } from "react";
import { AIQuestionBuilderSourcePicker } from "@/components/teacher/ai-question-builder-source-picker";
import { AIQuestionCreateSourceFields } from "@/components/teacher/ai-question-create-source-fields";
import {
  BuilderSourceFileList,
  LocalSourceFileList,
} from "@/components/teacher/ai-question-file-lists";
import { AIQuestionUploadDropzone } from "@/components/teacher/ai-question-upload-dropzone";
import type { SourceFileWithPages } from "@/components/teacher/ai-question-generator-dialog-types";
import { getSourceDisplayMeta } from "@/lib/source-file-display";
import type { UploadRecord } from "@/lib/uploads-api";

type AIQuestionSourceSelectorProps = {
  availableSourceFiles: UploadRecord[];
  isBuilderDialog: boolean;
  isDragging: boolean;
  onDragEnter: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onFileSelect: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveBuilderFile: (fileName: string) => void;
  onRemoveLocalFile: (fileName: string) => void;
  onToggleTest: (testId: string, checked: boolean) => void;
  onUpdatePageRange: (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) => void;
  selectedBuilderFiles: File[];
  selectedMockTests: string[];
  sourceFilesWithPages: SourceFileWithPages[];
};

export function AIQuestionSourceSelector({
  availableSourceFiles,
  isBuilderDialog,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onRemoveBuilderFile,
  onRemoveLocalFile,
  onToggleTest,
  onUpdatePageRange,
  selectedBuilderFiles,
  selectedMockTests,
  sourceFilesWithPages,
}: AIQuestionSourceSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const selectedSourceId = selectedMockTests[0] ?? availableSourceFiles[0]?.id ?? "";
  const gradeOptions = ["6-р анги", "7-р анги", "8-р анги", "9-р анги", "10-р анги"];
  const unitOptions = useMemo(
    () =>
      [...new Set(availableSourceFiles.map((file) => getSourceDisplayMeta(file).rightPrimary))],
    [availableSourceFiles],
  );
  const selectedSource = availableSourceFiles.find((file) => file.id === selectedSourceId);
  const selectedSourceMeta = selectedSource ? getSourceDisplayMeta(selectedSource) : null;
  const defaultGrade = selectedSourceMeta?.leftSecondary ?? "";
  const defaultUnit = selectedSourceMeta?.rightPrimary ?? "";
  const effectiveSelectedUnit = selectedUnit || defaultUnit;
  const topicOptions = [
    ...new Set(
      availableSourceFiles
        .map((file) => getSourceDisplayMeta(file))
        .filter((meta) => !effectiveSelectedUnit || meta.rightPrimary === effectiveSelectedUnit)
        .map((meta) => meta.rightSecondary),
    ),
  ];
  const defaultTopic = selectedSourceMeta?.rightSecondary ?? "";
  const effectiveSelectedGrade = selectedGrade || defaultGrade;
  const effectiveSelectedTopic = selectedTopic || defaultTopic;

  useEffect(() => {
    if (!isBuilderDialog && !selectedMockTests.length && availableSourceFiles[0]) {
      onToggleTest(availableSourceFiles[0].id, true);
    }
  }, [availableSourceFiles, isBuilderDialog, onToggleTest, selectedMockTests]);

  const handleSourceChange = (nextId: string) => {
    selectedMockTests.forEach((id) => {
      if (id !== nextId) onToggleTest(id, false);
    });
    const nextSource = availableSourceFiles.find((file) => file.id === nextId);
    const nextMeta = nextSource ? getSourceDisplayMeta(nextSource) : null;
    setSelectedGrade(nextMeta?.leftSecondary ?? "");
    setSelectedUnit(nextMeta?.rightPrimary ?? "");
    setSelectedTopic(nextMeta?.rightSecondary ?? "");
    onToggleTest(nextId, true);
  };

  const handleUnitChange = (value: string) => {
    setSelectedUnit(value);
    setSelectedTopic("");
  };

  if (!isBuilderDialog) {
    return (
      <AIQuestionCreateSourceFields
        availableSourceFiles={availableSourceFiles}
        gradeOptions={gradeOptions}
        onGradeChange={setSelectedGrade}
        onSourceChange={handleSourceChange}
        onTopicChange={setSelectedTopic}
        onUnitChange={handleUnitChange}
        selectedGrade={effectiveSelectedGrade}
        selectedSourceId={selectedSourceId}
        selectedTopic={effectiveSelectedTopic}
        selectedUnit={effectiveSelectedUnit}
        topicOptions={topicOptions}
        unitOptions={unitOptions}
      />
    );
  }

  return (
    <div className="space-y-0">
      <div className="max-h-[164px] overflow-auto rounded-[16px] border border-[#dce7ff] bg-white p-3">
        <AIQuestionBuilderSourcePicker
          availableSourceFiles={availableSourceFiles}
          onToggleTest={onToggleTest}
          selectedMockTests={selectedMockTests}
        />
      </div>
      <AIQuestionUploadDropzone
        isDragging={isDragging}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onFileSelect={onFileSelect}
      />

      {isBuilderDialog ? (
        <BuilderSourceFileList
          files={selectedBuilderFiles}
          onRemove={onRemoveBuilderFile}
        />
      ) : (
        <LocalSourceFileList
          files={sourceFilesWithPages}
          onRemove={onRemoveLocalFile}
          onUpdatePageRange={onUpdatePageRange}
        />
      )}
    </div>
  );
}
