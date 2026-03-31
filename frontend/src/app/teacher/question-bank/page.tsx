"use client";

import { useEffect, useState } from "react";
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import {
  createQuestionBankCategoryAction,
  saveQuestionBankQuestionSet,
} from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
import { QuestionBankBuilderCard } from "@/components/teacher/question-bank-builder-card";
import { QuestionBankFiltersCard } from "@/components/teacher/question-bank-filters-card";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import { Button } from "@/components/ui/button";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { Plus } from "lucide-react";

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });
  const { builderCategoryId, setBuilderCategoryId } = builder;

  useEffect(() => {
    if (!builderCategoryId && data.questionBank[0]) {
      setBuilderCategoryId(data.questionBank[0].id);
    }
  }, [builderCategoryId, data.questionBank, setBuilderCategoryId]);

  const builderCategoryName =
    data.questionBank.find((category) => category.id === builderCategoryId)?.name ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Асуултын сан</h1>
          <p className="text-muted-foreground">
            Ангилал, сэдвээр зохион байгуулсан асуултууд.
          </p>
        </div>
        <Button onClick={() => builder.setShowBuilder(!builder.showBuilder)}>
          <Plus className="mr-2 h-4 w-4" />
          Шинэ асуултууд үүсгэх
        </Button>
      </div>

      {builder.showBuilder ? (
        <QuestionBankBuilderCard
          builderCategoryId={builder.builderCategoryId}
          builderCategoryName={builderCategoryName}
          builderDifficulty={builder.builderDifficulty}
          builderNewCategoryName={builder.builderNewCategoryName}
          builderQuestions={builder.builderQuestions}
          builderTopicName={builder.builderTopicName}
          isCreatingCategory={isCreatingCategory}
          isSaving={isSaving}
          onAddQuestion={builder.addQuestion}
          onBuilderCategoryNameChange={builder.setBuilderNewCategoryName}
          onBuilderDifficultyChange={builder.setBuilderDifficulty}
          onBuilderTopicNameChange={builder.setBuilderTopicName}
          onCancel={() => {
            builder.resetBuilder();
            builder.setShowBuilder(false);
          }}
          onCategorySelect={(value) =>
            builder.setBuilderCategoryId(value === "__create_new_category__" ? "" : value)
          }
          onCreateCategory={() =>
            void createQuestionBankCategoryAction({
              name: builder.builderNewCategoryName,
              onCreated: builder.setBuilderCategoryId,
              setBuilderCategoryId: builder.setBuilderCategoryId,
              setBuilderNewCategoryName: builder.setBuilderNewCategoryName,
              setIsCreatingCategory,
              setNewCategoryName: builder.setNewCategoryName,
              setQuestionBank: data.setQuestionBank,
            })
          }
          onOpenAIDialog={() => builder.setShowAIDialog(true)}
          onRemoveQuestion={builder.removeQuestion}
          onSave={() =>
            void saveQuestionBankQuestionSet({
              builderCategoryId: builder.builderCategoryId,
              builderDifficulty: builder.builderDifficulty,
              builderQuestions: builder.builderQuestions,
              builderTopicName: builder.builderTopicName,
              onComplete: () => {
                builder.resetBuilder();
                builder.setShowBuilder(false);
              },
              setIsSaving,
              setQuestionBank: data.setQuestionBank,
            })
          }
          onUpdateOption={builder.updateOption}
          onUpdateQuestion={builder.updateQuestion}
          questionBank={data.questionBank}
        />
      ) : null}

      <QuestionBankFiltersCard
        isCreatingCategory={isCreatingCategory}
        newCategoryName={builder.newCategoryName}
        onCreateCategory={() =>
          void createQuestionBankCategoryAction({
            name: builder.newCategoryName,
            setBuilderCategoryId: builder.setBuilderCategoryId,
            setBuilderNewCategoryName: builder.setBuilderNewCategoryName,
            setIsCreatingCategory,
            setNewCategoryName: builder.setNewCategoryName,
            setQuestionBank: data.setQuestionBank,
          })
        }
        onNewCategoryNameChange={builder.setNewCategoryName}
        onSearchQueryChange={builder.setSearchQuery}
        onSelectedCategoryFilterChange={builder.setSelectedCategoryFilter}
        onSelectedDifficultyChange={builder.setSelectedDifficulty}
        questionBank={data.questionBank}
        searchQuery={builder.searchQuery}
        selectedCategoryFilter={builder.selectedCategoryFilter}
        selectedDifficulty={builder.selectedDifficulty}
      />

      <QuestionBankResults categories={data.filteredCategories} isLoading={data.isLoading} />

      <AIQuestionGeneratorDialog
        availableSourceFiles={data.sourceFiles}
        isGenerating={isGenerating}
        onGenerate={(payload) =>
          generateQuestionBankAIQuestions({
            builderCategoryId: builder.builderCategoryId,
            onComplete: () => builder.setShowAIDialog(false),
            payload,
            questionBank: data.questionBank,
            setBuilderDifficulty: builder.setBuilderDifficulty,
            setBuilderQuestions: builder.setBuilderQuestions,
            setIsGenerating,
            sourceFiles: data.sourceFiles,
          })
        }
        onOpenChange={builder.setShowAIDialog}
        onToggleTest={(sourceId, checked) =>
          builder.setSelectedSourceIds((current) =>
            checked ? [...new Set([...current, sourceId])] : current.filter((id) => id !== sourceId),
          )
        }
        open={builder.showAIDialog}
        selectedMockTests={builder.selectedSourceIds}
      />
    </div>
  );
}
