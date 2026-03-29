"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, X } from "lucide-react";

interface SourceFileWithPages {
  file: File;
  startPage: number;
  endPage: number;
}

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
  const [sourceFilesWithPages, setSourceFilesWithPages] = useState<
    SourceFileWithPages[]
  >([]);
  const [variants, setVariants] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">(
    "standard",
  );
  const [category, setCategory] = useState("");

  const hasSource =
    selectedMockTests.length > 0 || sourceFilesWithPages.length > 0;

  const handleFileSelectWithPages = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFilesWithPages = files.map((file) => ({
        file,
        startPage: 1,
        endPage: 10, // Default range
      }));
      setSourceFilesWithPages((prev) => [...prev, ...newFilesWithPages]);
    }
    e.target.value = "";
  };

  const updatePageRange = (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) => {
    setSourceFilesWithPages((prev) =>
      prev.map((item) =>
        item.file.name === fileName ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeSourceFile = (fileName: string) => {
    setSourceFilesWithPages((prev) =>
      prev.filter((item) => item.file.name !== fileName),
    );
  };

  const totalQuestions = aiMCCount + aiTFCount + aiShortCount;
  const finalQuestionCount = totalQuestions * variants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI ашиглан асуулт үүсгэх</DialogTitle>
          <DialogDescription>
            Медлегийн сангаас файл сонгоод асуулт үүсгэх хуудсыг зааж өгнө үү.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Source Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Эх сурвалж сонгох</Label>
              <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
                {/* Mock tests selection - keeping for compatibility */}
                <p className="text-sm text-muted-foreground">
                  Медлегийн сангийн файлууд:
                </p>
                {/* TODO: Load actual source files from backend */}
                <div className="text-sm text-muted-foreground">
                  Медлегийн сангийн файлууд энд гарч ирнэ
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Эсвэл шинэ файл нэмэх</Label>
              <div
                className={
                  isDragging
                    ? "border-2 border-dashed rounded-lg p-6 text-center transition-colors border-primary bg-primary/5"
                    : "border-2 border-dashed rounded-lg p-6 text-center transition-colors border-muted-foreground/25"
                }
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={(e) => {
                  onDrop(e);
                  const files = Array.from(e.dataTransfer.files);
                  const newFilesWithPages = files.map((file) => ({
                    file,
                    startPage: 1,
                    endPage: 10,
                  }));
                  setSourceFilesWithPages((prev) => [
                    ...prev,
                    ...newFilesWithPages,
                  ]);
                }}
              >
                <p className="text-sm text-muted-foreground mb-2">
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
                  onChange={handleFileSelectWithPages}
                />
              </div>

              {/* Selected files with page ranges */}
              {sourceFilesWithPages.length > 0 && (
                <div className="space-y-2">
                  {sourceFilesWithPages.map((item) => (
                    <div key={item.file.name} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {item.file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSourceFile(item.file.name)}
                        >
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
                            onChange={(e) =>
                              updatePageRange(
                                item.file.name,
                                "startPage",
                                parseInt(e.target.value) || 1,
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
                            onChange={(e) =>
                              updatePageRange(
                                item.file.name,
                                "endPage",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Асуултын төрөл</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Сонгох хариулттай</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiMCCount}
                    onChange={(e) =>
                      setAiMCCount(parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Үнэн/Худал</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiTFCount}
                    onChange={(e) =>
                      setAiTFCount(parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Богино хариулт</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiShortCount}
                    onChange={(e) =>
                      setAiShortCount(parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Асуултын тоо</Label>
              <div className="h-9 flex items-center px-3 border rounded-md bg-muted">
                {totalQuestions}
              </div>

              <Label>Хувилбарын тоо</Label>
              <Select
                value={variants.toString()}
                onValueChange={(value) => setVariants(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 хувилбар</SelectItem>
                  <SelectItem value="2">2 хувилбар</SelectItem>
                  <SelectItem value="3">3 хувилбар</SelectItem>
                  <SelectItem value="4">4 хувилбар</SelectItem>
                </SelectContent>
              </Select>

              <Label>Түвшин</Label>
              <Select
                value={difficulty}
                onValueChange={(value: "easy" | "standard" | "hard") =>
                  setDifficulty(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Хөнгөн</SelectItem>
                  <SelectItem value="standard">Дунд</SelectItem>
                  <SelectItem value="hard">Хэцүү</SelectItem>
                </SelectContent>
              </Select>

              <Label>Ангилал</Label>
              <Input
                placeholder="Жишээ: Математик"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Нийт асуулт:</span>
              <span className="font-medium">
                {finalQuestionCount} ({totalQuestions} × {variants} хувилбар)
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !hasSource || totalQuestions === 0}
          >
            {isGenerating
              ? "Үүсгэж байна..."
              : `${finalQuestionCount} асуулт үүсгэх`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
