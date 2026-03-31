"use client";

import type { SourceFileWithPages } from "@/components/teacher/ai-question-generator-dialog-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, X } from "lucide-react";

export function LocalSourceFileList({
  files,
  onRemove,
  onUpdatePageRange,
}: {
  files: SourceFileWithPages[];
  onRemove: (fileName: string) => void;
  onUpdatePageRange: (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((item) => (
        <div key={item.file.name} className="rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{item.file.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemove(item.file.name)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Эхлэх хуудас</Label>
              <Input
                type="number"
                min="1"
                value={item.startPage}
                onChange={(event) =>
                  onUpdatePageRange(
                    item.file.name,
                    "startPage",
                    parseInt(event.target.value) || 1,
                  )
                }
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Дуусах хуудас</Label>
              <Input
                type="number"
                min="1"
                value={item.endPage}
                onChange={(event) =>
                  onUpdatePageRange(
                    item.file.name,
                    "endPage",
                    parseInt(event.target.value) || 1,
                  )
                }
                className="h-8"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuilderSourceFileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (fileName: string) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={`${file.name}-${file.size}`} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemove(file.name)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
