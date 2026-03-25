'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockTests } from '@/lib/mock-data'

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
  aiMCCount: number
  aiShortCount: number
  aiTFCount: number
  isGenerating: boolean
  isDragging: boolean
  onGenerate: () => void
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onOpenChange: (open: boolean) => void
  onRemoveSourceFile: (fileName: string) => void
  onToggleTest: (testId: string, checked: boolean) => void
  open: boolean
  selectedMockTests: string[]
  selectedSourceFiles: File[]
  setAiMCCount: (value: number) => void
  setAiShortCount: (value: number) => void
  setAiTFCount: (value: number) => void
}) {
  const hasSource =
    selectedMockTests.length > 0 || selectedSourceFiles.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>
            Use question bank items, freshly uploaded files, or both as source material.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select content from Question Bank</Label>
            <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
              {mockTests.map((test) => (
                <div key={test.id} className="flex items-center gap-2">
                  <Checkbox id={test.id} checked={selectedMockTests.includes(test.id)} onCheckedChange={(checked) => onToggleTest(test.id, Boolean(checked))} />
                  <label htmlFor={test.id} className="text-sm">{test.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add another file as AI source</Label>
            <div
              className={
                isDragging
                  ? 'border-2 border-dashed rounded-lg p-6 text-center transition-colors border-primary bg-primary/5'
                  : 'border-2 border-dashed rounded-lg p-6 text-center transition-colors border-muted-foreground/25'
              }
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop PDF or Word files here, or choose files manually
              </p>
              <label htmlFor="ai-source-files">
                <Button variant="outline" asChild>
                  <span>Add Source Files</span>
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
                  <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3">
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
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CountField label="Multiple Choice" value={aiMCCount} onChange={setAiMCCount} />
            <CountField label="True/False" value={aiTFCount} onChange={setAiTFCount} />
            <CountField label="Short Answer" value={aiShortCount} onChange={setAiShortCount} />
            <div className="space-y-2">
              <Label>Total Questions</Label>
              <div className="h-9 flex items-center px-3 border rounded-md bg-muted">
                {aiMCCount + aiTFCount + aiShortCount}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onGenerate} disabled={isGenerating || !hasSource}>
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CountField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: number) => void
  value: number
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} />
    </div>
  )
}
