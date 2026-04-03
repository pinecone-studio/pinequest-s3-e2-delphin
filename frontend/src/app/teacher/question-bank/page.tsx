"use client";

import Image from "next/image";
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
  TeacherSurfaceCard,
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
import { useCurrentTime } from "@/hooks/use-current-time";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { formatHeaderDate, getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";
import { BookOpenText, CalendarDays } from "lucide-react";

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const now = useCurrentTime();
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        className="h-[64px] w-full max-w-[1360px]"
        surface="plain"
        title="Асуултын сан"
        eyebrow={
          <>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.8} />
              {now ? formatHeaderDate(now) : "Огноо ачаалж байна"}
            </span>
            <span>/</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpenText className="h-[15px] w-[15px]" strokeWidth={1.8} />
              Хичээлийн {now ? getAcademicWeekLabel(now) : "..."}
            </span>
          </>
        }
        actions={
          <Button
            asChild
            className="h-[47px] w-[225px] rounded-[14px] border border-[#8cb2ff] bg-white/92 px-4 text-[14px] font-medium text-[#141a1f] shadow-[0_16px_34px_rgba(140,178,255,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#f7fbff] hover:shadow-[0_18px_38px_rgba(140,178,255,0.28)] dark:border-[#5b8cff] dark:bg-[rgba(14,22,52,0.9)] dark:text-[#d8e5ff] dark:hover:bg-[rgba(20,30,66,0.96)]"
          >
            <Link href="/teacher/question-bank/create">
              <Image
                src="/Books.svg"
                alt=""
                width={18}
                height={18}
                className="shrink-0"
              />
              Шинэ асуултууд үүсгэх
            </Link>
          </Button>
        }
      />

      <section className="grid w-full max-w-[1360px] gap-5 xl:min-h-[806px] xl:grid-cols-[900px_minmax(0,1fr)]">
        <TeacherSurfaceCard className="h-full min-h-[806px] space-y-4 p-4">
          <QuestionBankFiltersCard
            embedded
            onSearchQueryChange={builder.setSearchQuery}
            onSelectedCategoryFilterChange={(value) => {
              if (value === CREATE_CATEGORY_FILTER_VALUE) {
                setIsCategoryDialogOpen(true);
                return;
              }

              builder.setSelectedCategoryFilter(value);
            }}
            questionBank={data.questionBank}
            searchQuery={builder.searchQuery}
            selectedCategoryFilter={builder.selectedCategoryFilter}
          />

          <QuestionBankResults
            categories={data.filteredCategories}
            embedded
            isLoading={data.isLoading}
          />
        </TeacherSurfaceCard>

        <QuestionBankSourcePanel
          className="min-h-[806px]"
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
