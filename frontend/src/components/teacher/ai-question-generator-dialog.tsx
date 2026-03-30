"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockTests } from "@/lib/mock-data";

export function AIQuestionGeneratorDialog({
  aiMCCount,
  aiShortCount,
  aiTFCount,
  isGenerating,
  isDragging,
  onGenerate,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onOpenChange,
  onRemoveSourceFile,
  onToggleTest,
  open,
  selectedMockTests,
  selectedSourceFiles,
  setAiMCCount,
  setAiShortCount,
  setAiTFCount,
}: {
  aiMCCount: number;
  aiShortCount: number;
  aiTFCount: number;
  isGenerating: boolean;
  isDragging: boolean;
  onGenerate: () => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenChange: (open: boolean) => void;
  onRemoveSourceFile: (fileName: string) => void;
  onToggleTest: (testId: string, checked: boolean) => void;
  open: boolean;
  selectedMockTests: string[];
  selectedSourceFiles: File[];
  setAiMCCount: (value: number) => void;
  setAiShortCount: (value: number) => void;
  setAiTFCount: (value: number) => void;
}) {
  const hasSource =
    selectedMockTests.length > 0 || selectedSourceFiles.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI ашиглан асуулт үүсгэх</DialogTitle>
          <DialogDescription>
            Асуултын сангийн материал, шинээр оруулсан файл, эсвэл хоёуланг нь
            эх сурвалж болгон ашиглах боломжтой.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Асуултын сангаас агуулга сонгох</Label>
            <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
              {mockTests.map((test) => (
                <div key={test.id} className="flex items-center gap-2">
                  <Checkbox
                    id={test.id}
                    checked={selectedMockTests.includes(test.id)}
                    onCheckedChange={(checked) =>
                      onToggleTest(test.id, Boolean(checked))
                    }
                  />
                  <label htmlFor={test.id} className="text-sm">
                    {test.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>AI-д ашиглах өөр файл нэмэх</Label>
            <div
              className={
                isDragging
                  ? "border-2 border-dashed rounded-lg p-6 text-center transition-colors border-primary bg-primary/5"
                  : "border-2 border-dashed rounded-lg p-6 text-center transition-colors border-muted-foreground/25"
              }
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <p className="text-sm text-muted-foreground mb-2">
                PDF эсвэл Word файлаа энд оруулна уу.
              </p>
              <label htmlFor="ai-source-files">
                <Button variant="outline" asChild>
                  <span>Эх файл нэмэх</span>
                </Button>
              </label>
              <input
                id="ai-source-files"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                multiple
                onChange={onFileSelect}
              />
            </div>
            {selectedSourceFiles.length > 0 ? (
              <div className="space-y-2 rounded-lg border p-3">
                {selectedSourceFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSourceFile(file.name)}
                    >
                      Устгах
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CountField
              label="Сонгох хариулттай"
              value={aiMCCount}
              onChange={setAiMCCount}
            />
            <CountField
              label="Үнэн/Худал"
              value={aiTFCount}
              onChange={setAiTFCount}
            />
            <CountField
              label="Богино хариулт"
              value={aiShortCount}
              onChange={setAiShortCount}
            />
            <div className="space-y-2">
              <Label>Нийт асуулт</Label>
              <div className="h-9 flex items-center px-3 border rounded-md bg-muted">
                {aiMCCount + aiTFCount + aiShortCount}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button onClick={onGenerate} disabled={isGenerating || !hasSource}>
            {isGenerating ? "Үүсгэж байна..." : "Асуулт үүсгэх"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CountField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        min={0}
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Math.max(0, parseInt(e.target.value, 10) || 0))
        }
      />
    </div>
  );
}
