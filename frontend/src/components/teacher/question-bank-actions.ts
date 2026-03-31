import type { Dispatch, SetStateAction } from "react";
import { toast } from "@/hooks/use-toast";
import {
  createQuestionBankCategory,
  createQuestionSet,
  getQuestionBank,
  type QuestionBankCategory,
  type QuestionBankDifficulty,
} from "@/lib/question-bank-api";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";

export async function createQuestionBankCategoryAction({
  name,
  onCreated,
  setBuilderCategoryId,
  setBuilderNewCategoryName,
  setIsCreatingCategory,
  setNewCategoryName,
  setQuestionBank,
}: {
  name: string;
  onCreated?: (categoryId: string) => void;
  setBuilderCategoryId: (value: string) => void;
  setBuilderNewCategoryName: (value: string) => void;
  setIsCreatingCategory: (value: boolean) => void;
  setNewCategoryName: (value: string) => void;
  setQuestionBank: Dispatch<SetStateAction<QuestionBankCategory[]>>;
}) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    toast({ title: "Алдаа", description: "Ангиллын нэр оруулна уу.", variant: "destructive" });
    return;
  }

  setIsCreatingCategory(true);
  try {
    const createdCategory = await createQuestionBankCategory(trimmedName);
    setQuestionBank((current) =>
      current.some((category) => category.id === createdCategory.id)
        ? current
        : [...current, createdCategory].sort((left, right) => left.name.localeCompare(right.name)),
    );
    setBuilderCategoryId(createdCategory.id);
    onCreated?.(createdCategory.id);
    setNewCategoryName("");
    setBuilderNewCategoryName("");
    toast({
      title: "Амжилттай",
      description: `"${createdCategory.name}" ангилал үүслээ.`,
    });
  } catch (error) {
    toast({
      title: "Алдаа",
      description: error instanceof Error ? error.message : "Ангилал үүсгэж чадсангүй.",
      variant: "destructive",
    });
  } finally {
    setIsCreatingCategory(false);
  }
}

export async function saveQuestionBankQuestionSet({
  builderCategoryId,
  builderDifficulty,
  builderQuestions,
  builderTopicName,
  onComplete,
  setIsSaving,
  setQuestionBank,
}: {
  builderCategoryId: string;
  builderDifficulty: QuestionBankDifficulty;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  onComplete: () => void;
  setIsSaving: (value: boolean) => void;
  setQuestionBank: Dispatch<SetStateAction<QuestionBankCategory[]>>;
}) {
  const hasEmptyQuestion = builderQuestions.some((question) => !question.question.trim());
  if (!builderCategoryId) {
    toast({ title: "Алдаа", description: "Ангилал сонгоно уу.", variant: "destructive" });
    return;
  }
  if (!builderTopicName.trim()) {
    toast({ title: "Алдаа", description: "Сэдвийн нэр оруулна уу.", variant: "destructive" });
    return;
  }
  if (builderQuestions.length === 0 || hasEmptyQuestion) {
    toast({
      title: "Алдаа",
      description: "Хамгийн багадаа нэг бүрэн асуулт оруулна уу.",
      variant: "destructive",
    });
    return;
  }

  setIsSaving(true);
  try {
    await createQuestionSet({
      categoryId: builderCategoryId,
      topicName: builderTopicName,
      difficulty: builderDifficulty,
      questions: builderQuestions,
    });
    setQuestionBank(await getQuestionBank());
    onComplete();
    toast({
      title: "Амжилттай",
      description: "Шинэ асуултууд асуултын санд хадгалагдлаа.",
    });
  } catch (error) {
    toast({
      title: "Алдаа",
      description:
        error instanceof Error ? error.message : "Асуултуудыг хадгалж чадсангүй.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
}
