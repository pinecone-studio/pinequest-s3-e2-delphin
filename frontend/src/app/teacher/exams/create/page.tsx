"use client"

import * as React from "react"
import Link from "next/link"
import { CircleAlert } from "lucide-react"
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog"
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list"
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useExamBuilder } from "@/hooks/use-exam-builder"
import { useExamCreation } from "@/hooks/use-exam-creation"

export default function CreateExamPage() {
  const titleSectionRef = React.useRef<HTMLDivElement | null>(null)
  const questionsSectionRef = React.useRef<HTMLDivElement | null>(null)
  const settingsSectionRef = React.useRef<HTMLDivElement | null>(null)
  const scheduleSectionRef = React.useRef<HTMLDivElement | null>(null)

  const scrollToSection = React.useCallback((section: "title" | "questions" | "settings" | "schedule") => {
    const sectionMap = {
      title: titleSectionRef,
      questions: questionsSectionRef,
      settings: settingsSectionRef,
      schedule: scheduleSectionRef,
    } as const

    const target = sectionMap[section].current
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" })
    const focusTarget = target.querySelector<HTMLElement>("input, textarea, button, [role='combobox']")
    focusTarget?.focus({ preventScroll: true })
  }, [])

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
    onValidationError: scrollToSection,
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

  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0)
  const questionCounts = {
    "multiple-choice": questions.filter((question) => question.type === "multiple-choice").length,
    "true-false": questions.filter((question) => question.type === "true-false").length,
    "short-answer": questions.filter((question) => question.type === "short-answer").length,
    essay: questions.filter((question) => question.type === "essay").length,
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Шалгалтууд руу буцах
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Шинэ шалгалт үүсгэх</h1>
        </div>
        <Button onClick={() => setShowAIDialog(true)}>
          AI ашиглан асуулт бэлтгэх
        </Button>
      </div>

      <div ref={titleSectionRef}>
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Шалгалтын нэр оруулна уу"
              value={examTitle}
              onChange={(event) => setExamTitle(event.target.value)}
              className="border-0 border-b px-0 text-xl font-semibold rounded-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>
      </div>

      {submissionError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Хадгалж чадсангүй</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      ) : null}

      <div ref={questionsSectionRef}>
        <ExamBuilderQuestionList
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
          onUpdateOption={updateOption}
          onUpdateQuestion={updateQuestion}
          questions={questions}
        />
      </div>

      <div ref={settingsSectionRef}>
        <div ref={scheduleSectionRef}>
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
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => void submitExam("draft")} disabled={!canSaveDraft}>
          {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
          Ноорог болгон хадгалах
        </Button>
        <Button onClick={() => void submitExam("scheduled")} disabled={!canScheduleExam}>
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Үүсгээд сурагчдад мэдэгдэх
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
            checked ? [...current, testId] : current.filter((id) => id !== testId),
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
