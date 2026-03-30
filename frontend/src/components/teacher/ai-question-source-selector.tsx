"use client";

import { BuilderSourceFileList, LocalSourceFileList } from "@/components/teacher/ai-question-file-lists";
import { AIQuestionUploadDropzone } from "@/components/teacher/ai-question-upload-dropzone";
import type { SourceFileWithPages } from "@/components/teacher/ai-question-generator-dialog-types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Ð­Ñ… ÑÑƒÑ€Ð²Ð°Ð»Ð¶ ÑÐ¾Ð½Ð³Ð¾Ñ…</Label>
        <div className="max-h-40 space-y-2 overflow-auto rounded border p-2">
          <p className="text-sm text-muted-foreground">
            ÐœÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½Ð³Ð¸Ð¹Ð½ Ñ„Ð°Ð¹Ð»ÑƒÑƒÐ´:
          </p>
          {availableSourceFiles.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              ÐœÐµÐ´Ð»ÑÐ³Ð¸Ð¹Ð½ ÑÐ°Ð½Ð´ Ñ…Ð°Ñ€Ð°Ð°Ñ…Ð°Ð½ Ñ„Ð°Ð¹Ð» Ð°Ð»Ð³Ð° Ð±Ð°Ð¹Ð½Ð°.
            </div>
          ) : (
            availableSourceFiles.map((source) => (
              <label
                key={source.id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <Checkbox
                  checked={selectedMockTests.includes(source.id)}
                  onCheckedChange={(checked) => onToggleTest(source.id, checked === true)}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{source.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(source.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </label>
            ))
          )}
        </div>
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
        <BuilderSourceFileList files={selectedBuilderFiles} onRemove={onRemoveBuilderFile} />
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
