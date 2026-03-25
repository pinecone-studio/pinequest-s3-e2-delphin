"use client"

import * as React from "react"
import Link from "next/link"
import { CircleAlert } from "lucide-react"
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog"
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list"
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useExamCreation } from "@/hooks/use-exam-creation"
import { useExamBuilder } from "@/hooks/use-exam-builder"

export default function CreateExamPage() {
  const {
    addQuestion,
    addScheduleEntry,
    aiMCCount,
    aiShortCount,
    aiTFCount,
    addAiSourceFiles,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    isAiSourceDragging,
    questions,
    reportReleaseMode,
    removeQuestion,
    removeAiSourceFile,
    removeScheduleEntry,
    scheduleEntries,
    selectedAiSourceFiles,
    selectedMockTests,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
    setDuration,
    setExamTitle,
    setIsAiSourceDragging,
    setReportReleaseMode,
    setSelectedMockTests,
    setShowAIDialog,
    showAIDialog,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = useExamBuilder()

  const { canSaveDraft, canScheduleExam, submissionError, submitExam, submitMode } = useExamCreation({
    duration,
    examTitle,
    questions,
    reportReleaseMode,
    scheduleEntries,
  })

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
    if (!files) {
      return
    }
    addAiSourceFiles(files)
    e.target.value = ""
  }
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const questionCounts = {
    'multiple-choice': questions.filter(q => q.type === 'multiple-choice').length,
    'true-false': questions.filter(q => q.type === 'true-false').length,
    'short-answer': questions.filter(q => q.type === 'short-answer').length,
    'essay': questions.filter(q => q.type === 'essay').length,
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Exams
          </Link>
          <h1 className="text-2xl font-bold mt-2">Create New Exam</h1>
        </div>
        <Button onClick={() => setShowAIDialog(true)}>
          Prepare Questions with AI
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Untitled Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
          />
        </CardContent>
      </Card>
      {submissionError ? <Alert variant="destructive"><CircleAlert /><AlertTitle>Save failed</AlertTitle><AlertDescription>{submissionError}</AlertDescription></Alert> : null}
      <ExamBuilderQuestionList
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateOption={updateOption}
        onUpdateQuestion={updateQuestion}
        questions={questions}
      />
      <ExamBuilderSummaryCard
        duration={duration}
        onAddScheduleEntry={addScheduleEntry}
        onDurationChange={setDuration}
        onRemoveScheduleEntry={removeScheduleEntry}
        onReportReleaseModeChange={setReportReleaseMode}
        onScheduleEntryChange={updateScheduleEntry}
        questionCounts={questionCounts}
        questionTotal={questions.length}
        reportReleaseMode={reportReleaseMode}
        scheduleEntries={scheduleEntries}
        totalPoints={totalPoints}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => void submitExam("draft")} disabled={!canSaveDraft}>
          {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
          Save as Draft
        </Button>
        <Button onClick={() => void submitExam("scheduled")} disabled={!canScheduleExam}>
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Create & Notify Students
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Student notification is still a placeholder in this demo. This action saves the exam to
        the backend, but it does not send a real message yet.
      </p>
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
            checked
              ? [...current, testId]
              : current.filter((id) => id !== testId),
          )
        }
        open={showAIDialog}
        selectedSourceFiles={selectedAiSourceFiles}
        selectedMockTests={selectedMockTests}
        setAiMCCount={setAiMCCount}
        setAiShortCount={setAiShortCount}
        setAiTFCount={setAiTFCount}
      />
    </div>
  )
}
