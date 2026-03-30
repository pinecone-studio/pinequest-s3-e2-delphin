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
      <Label>Ð­ÑÐ²ÑÐ» ÑˆÐ¸Ð½Ñ Ñ„Ð°Ð¹Ð» Ð½ÑÐ¼ÑÑ…</Label>
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
          PDF Ñ„Ð°Ð¹Ð»Ñ‹Ð³ ÑÐ½Ð´ Ñ‡Ð¸Ñ€Ð¶ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ
        </p>
        <label htmlFor="ai-source-files">
          <Button variant="outline" asChild>
            <span>Ð¤Ð°Ð¹Ð» ÑÐ¾Ð½Ð³Ð¾Ñ…</span>
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
