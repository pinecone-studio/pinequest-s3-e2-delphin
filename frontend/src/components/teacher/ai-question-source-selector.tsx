"use client";

import { useEffect, useMemo, useState } from "react";
import { AIQuestionCreateSourceFields } from "@/components/teacher/ai-question-create-source-fields";
import {
  BuilderSourceFileList,
  LocalSourceFileList,
} from "@/components/teacher/ai-question-file-lists";
import { AIQuestionUploadDropzone } from "@/components/teacher/ai-question-upload-dropzone";
import type { SourceFileWithPages } from "@/components/teacher/ai-question-generator-dialog-types";
import { Checkbox } from "@/components/ui/checkbox";
import { getSourceDisplayMeta } from "@/lib/source-file-display";
import { getReadableUploadName } from "@/lib/source-files";
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
  const defaultUnit = selectedSource ? getSourceDisplayMeta(selectedSource).rightPrimary : "";
  const topicOptions = useMemo(
    () =>
      [
        ...new Set(
          availableSourceFiles
            .map((file) => getSourceDisplayMeta(file))
            .filter((meta) => !selectedUnit || meta.rightPrimary === selectedUnit)
            .map((meta) => meta.rightSecondary),
        ),
      ],
    [availableSourceFiles, selectedUnit],
  );
  const defaultTopic = selectedSource ? getSourceDisplayMeta(selectedSource).rightSecondary : "";

  useEffect(() => {
    if (!isBuilderDialog && !selectedMockTests.length && availableSourceFiles[0]) {
      onToggleTest(availableSourceFiles[0].id, true);
    }
  }, [availableSourceFiles, isBuilderDialog, onToggleTest, selectedMockTests]);

  useEffect(() => {
    if (!selectedUnit && defaultUnit) setSelectedUnit(defaultUnit);
  }, [defaultUnit, selectedUnit]);

  useEffect(() => {
    if (!selectedTopic && defaultTopic) setSelectedTopic(defaultTopic);
  }, [defaultTopic, selectedTopic]);

  const handleSourceChange = (nextId: string) => {
    selectedMockTests.forEach((id) => {
      if (id !== nextId) onToggleTest(id, false);
    });
    onToggleTest(nextId, true);
  };

  if (!isBuilderDialog) {
    return (
      <AIQuestionCreateSourceFields
        availableSourceFiles={availableSourceFiles}
        gradeOptions={gradeOptions}
        onGradeChange={setSelectedGrade}
        onSourceChange={handleSourceChange}
        onTopicChange={setSelectedTopic}
        onUnitChange={setSelectedUnit}
        selectedGrade={selectedGrade}
        selectedSourceId={selectedSourceId}
        selectedTopic={selectedTopic || defaultTopic}
        selectedUnit={selectedUnit || defaultUnit}
        topicOptions={topicOptions}
        unitOptions={unitOptions}
      />
    );
  }

  return (
    <div className="space-y-0">
      <div className="max-h-[164px] overflow-auto rounded-[16px] border border-[#dce7ff] bg-white p-3">
        {availableSourceFiles.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Мэдлэгийн санд хараахан файл алга байна.
          </div>
        ) : (
          availableSourceFiles.map((source) => (
            <label
              key={source.id}
              className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#eef3ff] px-3 py-2 hover:bg-[#f8fbff]"
            >
              <Checkbox
                checked={selectedMockTests.includes(source.id)}
                onCheckedChange={(checked) => onToggleTest(source.id, checked === true)}
              />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-[#4b4f72]">
                  {getReadableUploadName(source.originalName)}
                </p>
                <p className="text-[12px] text-[#8b92ac]">
                  {new Date(source.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </label>
          ))
        )}
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
