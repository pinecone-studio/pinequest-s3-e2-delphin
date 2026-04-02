"use client";

import { EditExamAlerts } from "@/components/teacher/edit-exam-alerts";
import { EditExamAiDialog } from "@/components/teacher/edit-exam-ai-dialog";
import { EditExamDeleteDialog } from "@/components/teacher/edit-exam-delete-dialog";
import { EditExamHeader } from "@/components/teacher/edit-exam-header";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { useExamBuilder } from "@/hooks/use-exam-builder";
import type { useExamCreation } from "@/hooks/use-exam-creation";

type ExamBuilderState = ReturnType<typeof useExamBuilder>;
type ExamCreationState = ReturnType<typeof useExamCreation>;

export function EditExamPageContent({
  builder,
  creation,
  isDeleteDialogOpen,
  isDeleting,
  isLoading,
  loadError,
  onDeleteDialogOpenChange,
  onDelete,
}: {
  builder: ExamBuilderState;
  creation: ExamCreationState;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  loadError: string | null;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) {
  const {
    addQuestion,
    addScheduleEntry,
    aiQuestionTypeCounts,
    addAiSourceFiles,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    isAiSourceDragging,
    questions,
    removeQuestion,
    removeAiSourceFile,
    removeScheduleEntry,
    reportReleaseMode,
    scheduleEntries,
    selectedAiSourceFiles,
    selectedMockTests,
    setAiQuestionTypeCounts,
    setDuration,
    setExamTitle,
    setIsAiSourceDragging,
    setSelectedMockTests,
    setShowAIDialog,
    setReportReleaseMode,
    showAIDialog,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = builder;
  const {
    canMarkReady,
    canScheduleExam,
    submissionError,
    submitExam,
    submitMode,
  } = creation;

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const questionCounts = {
    "multiple-choice": questions.filter((q) => q.type === "multiple-choice")
      .length,
    "true-false": questions.filter((q) => q.type === "true-false").length,
    matching: questions.filter((q) => q.type === "matching").length,
    ordering: questions.filter((q) => q.type === "ordering").length,
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <EditExamHeader
        isDeleting={isDeleting}
        isLoading={isLoading}
        onDeleteClick={() => onDeleteDialogOpenChange(true)}
        onOpenAIDialog={() => setShowAIDialog(true)}
      />
      <EditExamDeleteDialog
        isDeleting={isDeleting}
        onConfirm={onDelete}
        onOpenChange={onDeleteDialogOpenChange}
        open={isDeleteDialogOpen}
      />
      <EditExamAlerts loadError={loadError} submissionError={submissionError} />
      <ExamBuilderQuestionList
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateOption={updateOption}
        onUpdateQuestion={updateQuestion}
        questions={questions}
      />
      <ExamBuilderSummaryCard
        duration={duration}
        examTitle={examTitle}
        onAddScheduleEntry={addScheduleEntry}
        onDurationChange={setDuration}
        onExamTitleChange={setExamTitle}
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
          variant="secondary"
          onClick={() => void submitExam("ready")}
          disabled={!canMarkReady || isLoading}
        >
          {submitMode === "ready" ? <Spinner className="mr-2" /> : null}
          Бэлэн төлөвт хадгалах
        </Button>
        <Button
          onClick={() => void submitExam("scheduled")}
          disabled={!canScheduleExam || isLoading}
        >
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Товлогдсон шалгалтыг шинэчлэх
        </Button>
      </div>
      <EditExamAiDialog
        addAiSourceFiles={addAiSourceFiles}
        aiQuestionTypeCounts={aiQuestionTypeCounts}
        generateAIQuestions={generateAIQuestions}
        isAiSourceDragging={isAiSourceDragging}
        isGenerating={isGenerating}
        open={showAIDialog}
        removeAiSourceFile={removeAiSourceFile}
        selectedMockTests={selectedMockTests}
        selectedSourceFiles={selectedAiSourceFiles}
        setAiQuestionTypeCounts={setAiQuestionTypeCounts}
        setIsAiSourceDragging={setIsAiSourceDragging}
        setSelectedMockTests={setSelectedMockTests}
        setShowAIDialog={setShowAIDialog}
      />
    </div>
  );
}
