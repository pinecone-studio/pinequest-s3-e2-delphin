"use client";

import * as React from "react";
import { CreateExamSelectedQuestionsPanel } from "@/components/teacher/create-exam-selected-questions-panel";
import { CreateExamPageHeader } from "@/components/teacher/create-exam-page-header";
import { CreateExamSubmitActions } from "@/components/teacher/create-exam-submit-actions";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { filterQuestionBank } from "@/components/teacher/question-bank-filter";
import { QuestionBankFiltersCard } from "@/components/teacher/question-bank-filters-card";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import {
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { useExamCreation } from "@/hooks/use-exam-creation";
import { useExamQuestionSelection } from "@/hooks/use-exam-question-selection";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { clearSelectedExamQuestions } from "@/lib/exam-question-selection";

export default function CreateExamPage() {
  const builder = useExamBuilder();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    React.useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("all");

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
    setDuration,
    setExamTitle,
    setQuestions,
    setReportReleaseMode,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = builder;
  const questionBankData = useQuestionBankData({ searchQuery, selectedCategoryFilter, selectedDifficulty });

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
    "multiple-choice": questions.filter((q) => q.type === "multiple-choice").length,
    "true-false": questions.filter((q) => q.type === "true-false").length,
    matching: questions.filter((q) => q.type === "matching").length,
    ordering: questions.filter((q) => q.type === "ordering").length,
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
  };
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <TeacherPageShell>
      <CreateExamPageHeader />
      <TeacherSurfaceCard className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#303959]">
            Асуултын сангаас сонгох
          </h2>
          <p className="text-sm text-[#6f7898]">
            Сонгосон асуултууд доорх шалгалтын хэсэгт шууд орно.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-4">
            <QuestionBankFiltersCard
              onSearchQueryChange={setSearchQuery}
              onSelectedCategoryFilterChange={setSelectedCategoryFilter}
              onSelectedDifficultyChange={setSelectedDifficulty}
              questionBank={questionBankData.questionBank}
              searchQuery={searchQuery}
              selectedCategoryFilter={selectedCategoryFilter}
              selectedDifficulty={selectedDifficulty}
            />
            <ScrollArea className="h-[520px] pr-2">
              <QuestionBankResults
                categories={filteredQuestionBank}
                isLoading={questionBankData.isLoading}
                selectedQuestionIds={selectedQuestionIds}
                onToggleQuestion={toggleQuestion}
                isQuestionSelectable={(questionType) => questionType !== "essay"}
              />
            </ScrollArea>
          </div>
          <CreateExamSelectedQuestionsPanel
            onMoveQuestion={moveQuestion}
            onRemoveQuestion={removeSelectedQuestion}
            selectedQuestions={selectedQuestions}
          />
        </div>
      </TeacherSurfaceCard>
      <TeacherSurfaceCard className="space-y-5">
        <Input
          placeholder="Шалгалтын нэр"
          value={examTitle}
          onChange={(event) => setExamTitle(event.target.value)}
          className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
        />
        <ExamBuilderQuestionList
          allowAddQuestion={false}
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
        <CreateExamSubmitActions
          canMarkReady={creation.canMarkReady}
          canSaveDraft={creation.canSaveDraft}
          canScheduleExam={creation.canScheduleExam}
          submitMode={creation.submitMode}
          onSubmitDraft={() => void creation.submitExam("draft")}
          onSubmitReady={() => void creation.submitExam("ready")}
          onSubmitScheduled={() => void creation.submitExam("scheduled")}
        />
      </TeacherSurfaceCard>
    </TeacherPageShell>
  );
}
