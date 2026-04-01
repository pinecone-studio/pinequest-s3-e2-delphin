"use client";

import Link from "next/link";
import { useState } from "react";
import { createQuestionBankCategoryAction } from "@/components/teacher/question-bank-actions";
import {
  CREATE_CATEGORY_FILTER_VALUE,
  QuestionBankFiltersCard,
} from "@/components/teacher/question-bank-filters-card";
import { QuestionBankSourcePanel } from "@/components/teacher/question-bank-source-panel";
import {
  TeacherPageHeader,
  TeacherPageShell,
} from "@/components/teacher/teacher-page-primitives";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { BookOpen, Plus } from "lucide-react";

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Асуултын сан"
        icon={BookOpen}
        actions={
          <>
            <Button asChild>
              <Link href="/teacher/question-bank/create">
                <Plus className="mr-2 h-4 w-4" />
                Шинэ асуултууд үүсгэх
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.72fr)]">
        <div className="space-y-4">
          <QuestionBankFiltersCard
            onSearchQueryChange={builder.setSearchQuery}
            onSelectedCategoryFilterChange={(value) => {
              if (value === CREATE_CATEGORY_FILTER_VALUE) {
                setIsCategoryDialogOpen(true);
                return;
              }

              builder.setSelectedCategoryFilter(value);
            }}
            onSelectedDifficultyChange={builder.setSelectedDifficulty}
            questionBank={data.questionBank}
            searchQuery={builder.searchQuery}
            selectedCategoryFilter={builder.selectedCategoryFilter}
            selectedDifficulty={builder.selectedDifficulty}
          />

          <QuestionBankResults
            categories={data.filteredCategories}
            isLoading={data.isLoading}
          />
        </div>

        <QuestionBankSourcePanel
          files={data.sourceFiles}
          setSourceFiles={data.setSourceFiles}
        />
      </section>

      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Шинэ ангилал нэмэх</DialogTitle>
            <DialogDescription>
              Ангиллын нэр оруулаад асуултын сандаа нэмнэ.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Жишээ: Математик"
            value={builder.newCategoryName}
            onChange={(event) => builder.setNewCategoryName(event.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Болих
            </Button>
            <Button
              onClick={() =>
                void createQuestionBankCategoryAction({
                  name: builder.newCategoryName,
                  onCreated: (categoryId) => {
                    builder.setSelectedCategoryFilter(categoryId);
                    setIsCategoryDialogOpen(false);
                  },
                  setBuilderCategoryId: builder.setBuilderCategoryId,
                  setBuilderNewCategoryName: builder.setBuilderNewCategoryName,
                  setIsCreatingCategory,
                  setNewCategoryName: builder.setNewCategoryName,
                  setQuestionBank: data.setQuestionBank,
                })
              }
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? "Нэмж байна..." : "Нэмэх"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherPageShell>
  );
}
