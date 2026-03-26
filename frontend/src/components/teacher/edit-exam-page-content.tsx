"use client";

import { EditExamAlerts } from "@/components/teacher/edit-exam-alerts";
import { EditExamAiDialog } from "@/components/teacher/edit-exam-ai-dialog";
import { EditExamDeleteDialog } from "@/components/teacher/edit-exam-delete-dialog";
import { EditExamHeader } from "@/components/teacher/edit-exam-header";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    removeQuestion,
    removeAiSourceFile,
    removeScheduleEntry,
    reportReleaseMode,
    scheduleEntries,
    selectedAiSourceFiles,
    selectedMockTests,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
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
    canSaveDraft,
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
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
    essay: questions.filter((q) => q.type === "essay").length,
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
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Untitled Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
            disabled={isLoading}
          />
        </CardContent>
      </Card>
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
          onClick={() => void submitExam("draft")}
          disabled={!canSaveDraft || isLoading}
        >
          {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
          Save as Draft
        </Button>
        <Button
          onClick={() => void submitExam("scheduled")}
          disabled={!canScheduleExam || isLoading}
        >
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Update Scheduled Exam
        </Button>
      </div>
      <EditExamAiDialog
        addAiSourceFiles={addAiSourceFiles}
        aiMCCount={aiMCCount}
        aiShortCount={aiShortCount}
        aiTFCount={aiTFCount}
        generateAIQuestions={generateAIQuestions}
        isAiSourceDragging={isAiSourceDragging}
        isGenerating={isGenerating}
        open={showAIDialog}
        removeAiSourceFile={removeAiSourceFile}
        selectedMockTests={selectedMockTests}
        selectedSourceFiles={selectedAiSourceFiles}
        setAiMCCount={setAiMCCount}
        setAiShortCount={setAiShortCount}
        setAiTFCount={setAiTFCount}
        setIsAiSourceDragging={setIsAiSourceDragging}
        setSelectedMockTests={setSelectedMockTests}
        setShowAIDialog={setShowAIDialog}
      />
    </div>
  );
}
