"use client";

import * as React from "react";
import { CreateExamSubmitActions } from "@/components/teacher/create-exam-submit-actions";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { filterQuestionBank } from "@/components/teacher/question-bank-filter";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { useExamCreation } from "@/hooks/use-exam-creation";
import { useExamQuestionSelection } from "@/hooks/use-exam-question-selection";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { clearSelectedExamQuestions } from "@/lib/exam-question-selection";
import { TeacherExamPreparationHeader } from "@/components/teacher/teacher-exam-preparation-header";
import { TeacherExamPreparationReview } from "@/components/teacher/teacher-exam-preparation-review";
import { TeacherExamPreparationSelection } from "@/components/teacher/teacher-exam-preparation-selection";

export function TeacherExamPreparationFlow({
  showStandaloneHeader = false,
}: {
  showStandaloneHeader?: boolean;
}) {
  const builder = useExamBuilder();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    React.useState("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState("all");

  const {
    addQuestion,
    addScheduleEntry,
    duration,
    examTitle,
    questions,
    removeQuestion,
    removeScheduleEntry,
    reportReleaseMode,
    scheduleEntries,
    setExamTitle,
    setQuestions,
    setReportReleaseMode,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = builder;

  const questionBankData = useQuestionBankData({
    searchQuery,
    selectedCategoryFilter,
    selectedDifficulty,
  });

  const filteredQuestionBank = React.useMemo(
    () =>
      filterQuestionBank(
        questionBankData.questionBank,
        searchQuery,
        selectedCategoryFilter,
        selectedDifficulty,
      ),
    [
      questionBankData.questionBank,
      searchQuery,
      selectedCategoryFilter,
      selectedDifficulty,
    ],
  );

  const {
    moveQuestion,
    removeQuestion: removeSelectedQuestion,
    selectedQuestionIds,
    selectedQuestions,
    toggleQuestion,
  } = useExamQuestionSelection({
    questionBank: questionBankData.questionBank,
    setQuestions,
  });

  const creation = useExamCreation({
    duration,
    examTitle,
    mode: "create",
    onSuccess: clearSelectedExamQuestions,
    questions,
    reportReleaseMode,
    scheduleEntries,
  });

  const questionCounts = {
    "multiple-choice": questions.filter((q) => q.type === "multiple-choice")
      .length,
    "true-false": questions.filter((q) => q.type === "true-false").length,
    matching: questions.filter((q) => q.type === "matching").length,
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
  };
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-5">
      {showStandaloneHeader ? (
        <TeacherExamPreparationHeader />
      ) : null}

      <TeacherExamPreparationSelection
        examTitle={examTitle}
        filteredQuestionBank={filteredQuestionBank}
        isLoading={questionBankData.isLoading}
        onMoveQuestion={moveQuestion}
        onRemoveQuestion={removeSelectedQuestion}
        onSearchQueryChange={setSearchQuery}
        onSelectedCategoryFilterChange={setSelectedCategoryFilter}
        onSelectedDifficultyChange={setSelectedDifficulty}
        onSetExamTitle={setExamTitle}
        onToggleQuestion={toggleQuestion}
        questionBank={questionBankData.questionBank}
        searchQuery={searchQuery}
        selectedCategoryFilter={selectedCategoryFilter}
        selectedDifficulty={selectedDifficulty}
        selectedQuestionIds={selectedQuestionIds}
        selectedQuestions={selectedQuestions}
        totalPoints={totalPoints}
      />

      <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
        <div className="space-y-5">
          <ExamBuilderSummaryCard
            duration={duration}
            examTitle={examTitle}
            hideExamTitleField
            hideScheduleEditor
            hideSettingsControls
            onAddScheduleEntry={addScheduleEntry}
            onDurationChange={() => undefined}
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

          <CreateExamSubmitActions
            canSubmit={creation.canMarkReady}
            submitMode={creation.submitMode}
            onSubmit={() => void creation.submitExam("ready")}
          />
        </div>
      </TeacherSurfaceCard>

      <TeacherExamPreparationReview
        addQuestion={addQuestion}
        questions={questions}
        removeQuestion={removeQuestion}
        updateOption={updateOption}
        updateQuestion={updateQuestion}
      />
    </div>
  );
}
