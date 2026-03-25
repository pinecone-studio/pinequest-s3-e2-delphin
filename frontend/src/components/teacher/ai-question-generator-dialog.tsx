"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { type MockTest } from "@/lib/mock-data";

type AiQuestionGeneratorDialogProps = {
  isGenerating: boolean;
  materialOptions: MockTest[];
  mcCount: number;
  onGenerate: () => void;
  onMcCountChange: (value: number) => void;
  onOpenChange: (open: boolean) => void;
  onSelectedMaterialIdsChange: (value: string[]) => void;
  onShortCountChange: (value: number) => void;
  onTfCountChange: (value: number) => void;
  open: boolean;
  selectedMaterialIds: string[];
  shortCount: number;
  tfCount: number;
};

export function AiQuestionGeneratorDialog({
  isGenerating,
  materialOptions,
  mcCount,
  onGenerate,
  onMcCountChange,
  onOpenChange,
  onSelectedMaterialIdsChange,
  onShortCountChange,
  onTfCountChange,
  open,
  selectedMaterialIds,
  shortCount,
  tfCount,
}: AiQuestionGeneratorDialogProps) {
  const totalQuestions = mcCount + tfCount + shortCount;

  const toggleMaterial = (materialId: string, checked: boolean) => {
    if (checked) {
      onSelectedMaterialIdsChange([...selectedMaterialIds, materialId]);
      return;
    }

    onSelectedMaterialIdsChange(
      selectedMaterialIds.filter((currentId) => currentId !== materialId),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>
            Configure how many questions of each type to generate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select content from Practice Materials</Label>
            <div className="max-h-32 space-y-2 overflow-auto rounded border p-2">
              {materialOptions.map((test) => (
                <div key={test.id} className="flex items-center gap-2">
                  <Checkbox
                    id={test.id}
                    checked={selectedMaterialIds.includes(test.id)}
                    onCheckedChange={(checked) => toggleMaterial(test.id, checked === true)}
                  />
                  <label htmlFor={test.id} className="text-sm">
                    {test.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Multiple Choice</Label>
              <Input
                type="number"
                value={mcCount}
                onChange={(event) => onMcCountChange(parseInt(event.target.value, 10) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>True/False</Label>
              <Input
                type="number"
                value={tfCount}
                onChange={(event) => onTfCountChange(parseInt(event.target.value, 10) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Short Answer</Label>
              <Input
                type="number"
                value={shortCount}
                onChange={(event) => onShortCountChange(parseInt(event.target.value, 10) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Questions</Label>
              <div className="flex h-9 items-center rounded-md border bg-muted px-3">
                {totalQuestions}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Questions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
