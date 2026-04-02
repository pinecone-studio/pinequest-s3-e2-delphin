"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import type { SelectedQuestionEntry } from "@/hooks/use-exam-question-selection";
import { QuestionBankFiltersCard } from "@/components/teacher/question-bank-filters-card";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import { CreateExamSelectedQuestionsPanel } from "@/components/teacher/create-exam-selected-questions-panel";
import type { filterQuestionBank } from "@/components/teacher/question-bank-filter";

export function TeacherExamPreparationSelection({
  examTitle,
  filteredQuestionBank,
  isLoading,
  onMoveQuestion,
  onRemoveQuestion,
  onSearchQueryChange,
  onSelectedCategoryFilterChange,
  onSelectedDifficultyChange,
  onSetExamTitle,
  onToggleQuestion,
  questionBank,
  searchQuery,
  selectedCategoryFilter,
  selectedDifficulty,
  selectedQuestionIds,
  selectedQuestions,
  totalPoints,
}: {
  examTitle: string;
  filteredQuestionBank: ReturnType<typeof filterQuestionBank>;
  isLoading: boolean;
  onMoveQuestion: (questionId: string, direction: "up" | "down") => void;
  onRemoveQuestion: (questionId: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSelectedCategoryFilterChange: (value: string) => void;
  onSelectedDifficultyChange: (value: string) => void;
  onSetExamTitle: (value: string) => void;
  onToggleQuestion: (questionId: string, checked: boolean) => void;
  questionBank: Parameters<typeof filterQuestionBank>[0];
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty: string;
  selectedQuestionIds: string[];
  selectedQuestions: SelectedQuestionEntry[];
  totalPoints: number;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#303959]">Шалгалтын асуулт</h2>
            <p className="text-sm text-[#6f7898]">Бүлэг, сэдэв, түвшнээрээ шүүгээд шалгалтандаа оруулах асуултуудаа сонгоно.</p>
          </div>
          <QuestionBankFiltersCard onSearchQueryChange={onSearchQueryChange} onSelectedCategoryFilterChange={onSelectedCategoryFilterChange} onSelectedDifficultyChange={onSelectedDifficultyChange} questionBank={questionBank} searchQuery={searchQuery} selectedCategoryFilter={selectedCategoryFilter} selectedDifficulty={selectedDifficulty} />
          <ScrollArea className="h-[640px] pr-2">
            <QuestionBankResults categories={filteredQuestionBank} isLoading={isLoading} selectedQuestionIds={selectedQuestionIds} onToggleQuestion={onToggleQuestion} isQuestionSelectable={(questionType) => questionType !== "essay"} />
          </ScrollArea>
        </div>
      </TeacherSurfaceCard>

      <TeacherSurfaceCard className="rounded-[32px] p-4 sm:p-5">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px]">
            <div className="space-y-2">
              <label htmlFor="exam-title" className="text-sm font-medium text-[#54617f]">Шалгалтын нэр</label>
              <Input id="exam-title" value={examTitle} onChange={(event) => onSetExamTitle(event.target.value)} placeholder="Шалгалтын нэр оруулах" className="h-11 rounded-2xl border-[#e2eafc] bg-white" />
            </div>
            <div className="flex items-end">
              <div className="flex w-full items-center justify-between rounded-2xl border border-[#e2eafc] bg-white px-4 py-3">
                <span className="text-sm text-[#6f7898]">Сонгосон</span>
                <span className="text-sm font-semibold text-[#303959]">{selectedQuestions.length}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2"><Badge variant="outline" className="rounded-full border-[#dce7ff] bg-[#f8fbff] text-[#52628d]">Нийт оноо {totalPoints}</Badge></div>
          <CreateExamSelectedQuestionsPanel onMoveQuestion={onMoveQuestion} onRemoveQuestion={onRemoveQuestion} selectedQuestions={selectedQuestions} />
        </div>
      </TeacherSurfaceCard>
    </section>
  );
}
