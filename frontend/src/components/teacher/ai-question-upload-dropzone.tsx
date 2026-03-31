"use client";

import type { ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function AIQuestionUploadDropzone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
}: {
  isDragging: boolean;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Эсвэл шинэ файл нэмэх</Label>
      <div
        className={
          isDragging
            ? "rounded-lg border-2 border-dashed border-primary bg-primary/5 p-6 text-center transition-colors"
            : "rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors"
        }
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <p className="mb-2 text-sm text-muted-foreground">
          PDF файлыг энд чирж оруулна уу
        </p>
        <label htmlFor="ai-source-files">
          <Button variant="outline" asChild>
            <span>Файл сонгох</span>
          </Button>
        </label>
        <input
          id="ai-source-files"
          type="file"
          accept=".pdf"
          className="hidden"
          multiple
          onChange={onFileSelect}
        />
      </div>
    </div>
  );
}
