"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIQuestionGeneratorCard } from "@/components/teacher/ai-question-generator-card";
import { CreateQuestionBankCategoryDialog } from "@/components/teacher/create-question-bank-category-dialog";
import { QuestionBankCreateBuilderCard } from "@/components/teacher/question-bank-create-builder-card";
import { createQuestionBankCategoryAction, saveQuestionBankQuestionSet } from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
import { QuestionBankCreateSummary } from "@/components/teacher/question-bank-create-summary";
import { TeacherPageHeader, TeacherPageShell } from "@/components/teacher/teacher-page-primitives";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { formatHeaderDate, getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";
import { ArrowLeft, BookOpenText, CalendarDays } from "lucide-react";

export default function QuestionBankCreatePage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false),
    [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
      useState(false),
    [isGenerating, setIsGenerating] = useState(false),
    [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const now = useCurrentTime();
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({ searchQuery: "", selectedCategoryFilter: "all", selectedDifficulty: "all" });
  const {
    addQuestion,
    builderCategoryId,
    builderDifficulty,
    builderNewCategoryName,
    builderQuestions,
    builderTopicName,
    removeQuestion,
    resetBuilder,
    selectedSourceIds,
    setBuilderCategoryId,
    setBuilderDifficulty,
    setBuilderNewCategoryName,
    setBuilderQuestions,
    setBuilderTopicName,
    setNewCategoryName,
    setSelectedSourceIds,
    updateOption,
    updateQuestion,
  } = builder;

  useEffect(() => {
    if (!builderCategoryId && data.questionBank[0])
      setBuilderCategoryId(data.questionBank[0].id);
  }, [builderCategoryId, data.questionBank, setBuilderCategoryId]);

  const createCategory = () =>
    void createQuestionBankCategoryAction({
      name: builderNewCategoryName,
      onCreated: () => setIsCreateCategoryDialogOpen(false),
      setBuilderCategoryId,
      setBuilderNewCategoryName,
      setIsCreatingCategory,
      setNewCategoryName,
      setQuestionBank: data.setQuestionBank,
    });

  return (
    <TeacherPageShell>
      <div>
        <Link
          href="/teacher/question-bank"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Асуултын сан руу буцах
        </Link>
      </div>

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
      />

      <div className="mx-auto flex w-fit items-start gap-8">
        <AIQuestionGeneratorCard
          availableSourceFiles={data.sourceFiles}
          className="shrink-0"
          isGenerating={isGenerating}
          onGenerate={(payload) =>
            generateQuestionBankAIQuestions({
              builderCategoryId,
              onComplete: () => undefined,
              payload,
              questionBank: data.questionBank,
              setBuilderDifficulty,
              setBuilderQuestions,
              setIsGenerating,
              sourceFiles: data.sourceFiles,
            })
          }
          onToggleTest={(sourceId, checked) =>
            setSelectedSourceIds((current) =>
              checked
                ? [...new Set([...current, sourceId])]
                : current.filter((id) => id !== sourceId),
            )
          }
          selectedMockTests={selectedSourceIds}
        />

        <section className="h-[806px] w-[900px] shrink-0 overflow-y-auto rounded-[32px] border border-[#DDE7FF] bg-white p-5 shadow-[0_20px_48px_rgba(168,196,235,0.16)]">
          <div className="space-y-4">
            <QuestionBankCreateBuilderCard
              builderCategoryId={builderCategoryId}
              builderQuestions={builderQuestions}
              builderTopicName={builderTopicName}
              onAddQuestion={addQuestion}
              onCategoryChange={setBuilderCategoryId}
              onCreateCategory={() => setIsCreateCategoryDialogOpen(true)}
              onRemoveQuestion={removeQuestion}
              onTopicNameChange={setBuilderTopicName}
              onUpdateOption={updateOption}
              onUpdateQuestion={updateQuestion}
              questionBank={data.questionBank}
            />

            <QuestionBankCreateSummary
              builderDifficulty={builderDifficulty}
              builderQuestions={builderQuestions}
              builderTopicName={builderTopicName}
              isSaving={isSaving}
              onBuilderDifficultyChange={setBuilderDifficulty}
              onCancel={resetBuilder}
              onSave={() =>
                void saveQuestionBankQuestionSet({
                  builderCategoryId,
                  builderDifficulty,
                  builderQuestions,
                  builderTopicName,
                  onComplete: () => {
                    resetBuilder();
                    router.push("/teacher/question-bank");
                  },
                  setIsSaving,
                  setQuestionBank: data.setQuestionBank,
                })
              }
            />
          </div>
        </section>
      </div>

      <CreateQuestionBankCategoryDialog
        isCreating={isCreatingCategory}
        open={isCreateCategoryDialogOpen}
        value={builderNewCategoryName}
        onCreate={createCategory}
        onOpenChange={setIsCreateCategoryDialogOpen}
        onValueChange={setBuilderNewCategoryName}
      />
    </TeacherPageShell>
  );
}
