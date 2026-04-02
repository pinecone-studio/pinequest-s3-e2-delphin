"use client";

import * as React from "react";
import Link from "next/link";
import { CreateExamSelectedQuestionsPanel } from "@/components/teacher/create-exam-selected-questions-panel";
import { CreateExamSubmitActions } from "@/components/teacher/create-exam-submit-actions";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { filterQuestionBank } from "@/components/teacher/question-bank-filter";
import { QuestionBankFiltersCard } from "@/components/teacher/question-bank-filters-card";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { useExamCreation } from "@/hooks/use-exam-creation";
import { useExamQuestionSelection } from "@/hooks/use-exam-question-selection";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { clearSelectedExamQuestions } from "@/lib/exam-question-selection";
import { ArrowLeft, ClipboardList } from "lucide-react";

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
    ordering: questions.filter((q) => q.type === "ordering").length,
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
  };
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-5">
      {showStandaloneHeader ? (
        <section className="space-y-3">
          <Link
            href="/teacher/exams"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6f96] transition hover:text-[#314672]"
          >
            <ArrowLeft className="h-4 w-4" />
            Шалгалтууд руу буцах
          </Link>
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,#fff7d6_0%,#ffe9a7_42%,#ffd8f5_100%)] text-[#7c5d00] shadow-[0_14px_28px_rgba(253,224,71,0.22)]">
              <ClipboardList className="h-6 w-6" strokeWidth={1.9} />
            </div>
            <div>
              <h1 className="text-[2.05rem] font-semibold tracking-[-0.04em] text-[#303959]">
                Шалгалтын бэлтгэх
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#6f7898]">
                Асуултын сангаас сонгоод шалгалтын бүтэц, асуултуудаа бэлдэнэ.
                Хугацаа болон хуваарийг шалгалт эхлүүлэх шатанд оруулна.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#303959]">
                Шалгалтын асуулт
              </h2>
              <p className="text-sm text-[#6f7898]">
                Бүлэг, сэдэв, түвшнээрээ шүүгээд шалгалтандаа оруулах
                асуултуудаа сонгоно.
              </p>
            </div>

            <QuestionBankFiltersCard
              onSearchQueryChange={setSearchQuery}
              onSelectedCategoryFilterChange={setSelectedCategoryFilter}
              onSelectedDifficultyChange={setSelectedDifficulty}
              questionBank={questionBankData.questionBank}
              searchQuery={searchQuery}
              selectedCategoryFilter={selectedCategoryFilter}
              selectedDifficulty={selectedDifficulty}
            />

            <ScrollArea className="h-[640px] pr-2">
              <QuestionBankResults
                categories={filteredQuestionBank}
                isLoading={questionBankData.isLoading}
                selectedQuestionIds={selectedQuestionIds}
                onToggleQuestion={toggleQuestion}
                isQuestionSelectable={(questionType) => questionType !== "essay"}
              />
            </ScrollArea>
          </div>
        </TeacherSurfaceCard>

        <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px]">
              <div className="space-y-2">
                <label
                  htmlFor="exam-title"
                  className="text-sm font-medium text-[#54617f]"
                >
                  Шалгалтын нэр
                </label>
                <Input
                  id="exam-title"
                  value={examTitle}
                  onChange={(event) => setExamTitle(event.target.value)}
                  placeholder="Шалгалтын нэр оруулах"
                  className="h-11 rounded-2xl border-[#e2eafc] bg-white"
                />
              </div>
              <div className="flex items-end">
                <div className="flex w-full items-center justify-between rounded-2xl border border-[#e2eafc] bg-white px-4 py-3">
                  <span className="text-sm text-[#6f7898]">Сонгосон</span>
                  <span className="text-sm font-semibold text-[#303959]">
                    {selectedQuestions.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-[#dce7ff] bg-[#f8fbff] text-[#52628d]"
              >
                Нийт оноо {totalPoints}
              </Badge>
            </div>

            <CreateExamSelectedQuestionsPanel
              onMoveQuestion={moveQuestion}
              onRemoveQuestion={removeSelectedQuestion}
              selectedQuestions={selectedQuestions}
            />
          </div>
        </TeacherSurfaceCard>
      </section>

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

      <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
        <div className="space-y-4">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-[#303959]">
            Шалгалтын асуултуудыг нягтлах
          </h2>
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
                Асуулт сонгоход энд автоматаар нэмэгдэнэ.
              </div>
            ) : (
              <div className="space-y-4">
                <ExamBuilderQuestionList
                  allowAddQuestion={false}
                  onAddQuestion={addQuestion}
                  onRemoveQuestion={removeQuestion}
                  onUpdateOption={updateOption}
                  onUpdateQuestion={updateQuestion}
                  questions={questions}
                />
              </div>
            )}
          </div>
        </div>
      </TeacherSurfaceCard>
    </div>
  );
}
