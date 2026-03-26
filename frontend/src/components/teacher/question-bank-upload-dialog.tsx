'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function QuestionBankUploadDialog({
  isDialogOpen,
  isDragging,
  newTestName,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onOpenChange,
  onSubmit,
  selectedFile,
  setNewTestName,
  setSelectedFile,
}: {
  isDialogOpen: boolean
  isDragging: boolean
  newTestName: string
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  selectedFile: File | null
  setNewTestName: (value: string) => void
  setSelectedFile: (value: File | null) => void
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild><Button>Шинэ Шалгалт Оруулах</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demo Шалгалт Оруулах</DialogTitle>
          <DialogDescription>Сурагчдад дасгал болгох demo шалгалтын файл нэмнэ</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Шалгалтын Нэр</Label>
            <Input id="testName" placeholder="ж: HTML Суурь Ойлголтын Тест" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Шалгалтын Файл (PDF эсвэл Word)</Label>
            <div className={isDragging ? 'border-2 border-dashed rounded-lg p-8 text-center transition-colors border-primary bg-primary/5' : 'border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/25'} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelectedFile(null)}>Устгах</Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-2">Файлаа энд чирж оруулах эсвэл</p>
                  <label htmlFor="fileInput">
                    <Button variant="outline" asChild><span>Файл Сонгох</span></Button>
                  </label>
                  <input id="fileInput" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileSelect} />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Болих</Button>
          <Button onClick={onSubmit} disabled={!newTestName || !selectedFile}>Оруулах</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
