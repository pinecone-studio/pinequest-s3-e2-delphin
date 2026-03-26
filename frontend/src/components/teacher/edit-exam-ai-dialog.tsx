'use client'

import * as React from 'react'
import { AIQuestionGeneratorDialog } from '@/components/teacher/ai-question-generator-dialog'

export function EditExamAiDialog({
  addAiSourceFiles,
  aiMCCount,
  aiShortCount,
  aiTFCount,
  generateAIQuestions,
  isAiSourceDragging,
  isGenerating,
  open,
  removeAiSourceFile,
  selectedMockTests,
  selectedSourceFiles,
  setAiMCCount,
  setAiShortCount,
  setAiTFCount,
  setIsAiSourceDragging,
  setSelectedMockTests,
  setShowAIDialog,
}: {
  addAiSourceFiles: (files: FileList) => void
  aiMCCount: number
  aiShortCount: number
  aiTFCount: number
  generateAIQuestions: () => Promise<void>
  isAiSourceDragging: boolean
  isGenerating: boolean
  open: boolean
  removeAiSourceFile: (fileName: string) => void
  selectedMockTests: string[]
  selectedSourceFiles: File[]
  setAiMCCount: (value: number) => void
  setAiShortCount: (value: number) => void
  setAiTFCount: (value: number) => void
  setIsAiSourceDragging: (value: boolean) => void
  setSelectedMockTests: React.Dispatch<React.SetStateAction<string[]>>
  setShowAIDialog: (value: boolean) => void
}) {
  const handleAiSourceDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(true)
  }
  const handleAiSourceDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(false)
  }
  const handleAiSourceDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(false)
    addAiSourceFiles(e.dataTransfer.files)
  }
  const handleAiSourceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    addAiSourceFiles(files)
    e.target.value = ''
  }

  return (
    <AIQuestionGeneratorDialog
      aiMCCount={aiMCCount}
      aiShortCount={aiShortCount}
      aiTFCount={aiTFCount}
      isGenerating={isGenerating}
      onGenerate={generateAIQuestions}
      isDragging={isAiSourceDragging}
      onOpenChange={setShowAIDialog}
      onDragLeave={handleAiSourceDragLeave}
      onDragOver={handleAiSourceDragOver}
      onDrop={handleAiSourceDrop}
      onFileSelect={handleAiSourceSelect}
      onRemoveSourceFile={removeAiSourceFile}
      onToggleTest={(testId, checked) =>
        setSelectedMockTests((current) =>
          checked ? [...current, testId] : current.filter((id) => id !== testId),
        )
      }
      open={open}
      selectedSourceFiles={selectedSourceFiles}
      selectedMockTests={selectedMockTests}
      setAiMCCount={setAiMCCount}
      setAiShortCount={setAiShortCount}
      setAiTFCount={setAiTFCount}
    />
  )
}
