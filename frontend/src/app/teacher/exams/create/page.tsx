"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { useExamBuilder } from "@/hooks/use-exam-builder"
import { toast } from "@/hooks/use-toast"
import { buildCreateExamPayload, createExam } from "@/lib/exams-api"

export default function CreateExamPage() {
  const router = useRouter()
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const [submitMode, setSubmitMode] = React.useState<"draft" | "scheduled" | null>(null)
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

  const isSubmitting = submitMode !== null
  const canSaveDraft = examTitle.trim().length > 0 && !isSubmitting
  const canScheduleExam =
    examTitle.trim().length > 0 &&
    questions.length > 0 &&
    scheduleEntries.length > 0 &&
    !isSubmitting

  const handleSubmit = async (status: "draft" | "scheduled") => {
    setSubmissionError(null)
    setSubmitMode(status)

    try {
      const payload = buildCreateExamPayload({
        duration,
        examTitle,
        questions,
        reportReleaseMode,
        scheduleEntries,
        status,
      })

      await createExam(payload)

      toast({
        title: status === "draft" ? "Draft saved" : "Exam created",
        description:
          status === "draft"
            ? "Your exam draft was saved to the backend."
            : "Your scheduled exam was created successfully.",
      })
      router.push("/teacher/exams")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong while saving the exam."
      setSubmissionError(message)
      toast({
        title: "Could not save exam",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitMode(null)
    }
  }

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
      {submissionError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Save failed</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      ) : null}
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
        <Button
          variant="outline"
          onClick={() => void handleSubmit("draft")}
          disabled={!canSaveDraft}
        >
          {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
          Save as Draft
        </Button>
        <Button 
          onClick={() => void handleSubmit("scheduled")}
          disabled={!canScheduleExam}
        >
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Create & Notify Students
        </Button>
      </div>
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
