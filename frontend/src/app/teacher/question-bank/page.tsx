"use client";

import Link from "next/link";
import { useState } from "react";
import { createQuestionBankCategoryAction } from "@/components/teacher/question-bank-actions";
import {
  CREATE_CATEGORY_FILTER_VALUE,
  QuestionBankFiltersCard,
} from "@/components/teacher/question-bank-filters-card";
import {
  TeacherPageHeader,
  TeacherPageShell,
  TeacherPageStatCard,
  TeacherPageStatGrid,
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
import { BookOpen, FolderTree, Plus, Shapes } from "lucide-react";

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });
  const totalTopicCount = data.questionBank.reduce(
    (sum, category) => sum + category.topics.length,
    0,
  );
  const totalQuestionCount = data.questionBank.reduce(
    (sum, category) =>
      sum +
      category.topics.reduce((topicSum, topic) => topicSum + topic.questions.length, 0),
    0,
  );

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Асуултын сан"
        description="Эх сурвалж файлууд, ангиллууд, сэдвүүд, асуултуудаа нэг цэгээс удирдаж дараагийн дизайн шилжилтэд бэлэн болгоно."
        icon={BookOpen}
        eyebrow={<span>Сангийн бүтэц болон логик одоогийн байдлаараа хадгалагдана.</span>}
        actions={
          <>
          <Button variant="outline" asChild>
            <Link href="/teacher/sources">Мэдлэгийн сан</Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/question-bank/create">
              <Plus className="mr-2 h-4 w-4" />
              Шинэ асуултууд үүсгэх
            </Link>
          </Button>
          </>
        }
      />

      <TeacherPageStatGrid>
        <TeacherPageStatCard
          icon={FolderTree}
          label="Ангиллууд"
          value={`${data.questionBank.length} ангилал`}
        />
        <TeacherPageStatCard
          icon={Shapes}
          label="Сэдвүүд"
          tone="mint"
          value={`${totalTopicCount} сэдэв`}
        />
        <TeacherPageStatCard
          icon={BookOpen}
          label="Нийт асуулт"
          tone="violet"
          value={`${totalQuestionCount} асуулт`}
        />
      </TeacherPageStatGrid>

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

      <section className="space-y-4">
        <QuestionBankResults
          categories={data.filteredCategories}
          isLoading={data.isLoading}
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
