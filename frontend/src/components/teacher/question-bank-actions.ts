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
    toast({ title: "ÐÐ»Ð´Ð°Ð°", description: "ÐÐ½Ð³Ð¸Ð»Ð»Ñ‹Ð½ Ð½ÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.", variant: "destructive" });
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
      title: "ÐÐ¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹",
      description: `"${createdCategory.name}" Ð°Ð½Ð³Ð¸Ð»Ð°Ð» Ò¯Ò¯ÑÐ»ÑÑ.`,
    });
  } catch (error) {
    toast({
      title: "ÐÐ»Ð´Ð°Ð°",
      description: error instanceof Error ? error.message : "ÐÐ½Ð³Ð¸Ð»Ð°Ð» Ò¯Ò¯ÑÐ³ÑÐ¶ Ñ‡Ð°Ð´ÑÐ°Ð½Ð³Ò¯Ð¹.",
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
    toast({ title: "ÐÐ»Ð´Ð°Ð°", description: "ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÐ¾Ð½Ð³Ð¾Ð½Ð¾ ÑƒÑƒ.", variant: "destructive" });
    return;
  }
  if (!builderTopicName.trim()) {
    toast({ title: "ÐÐ»Ð´Ð°Ð°", description: "Ð¡ÑÐ´Ð²Ð¸Ð¹Ð½ Ð½ÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.", variant: "destructive" });
    return;
  }
  if (builderQuestions.length === 0 || hasEmptyQuestion) {
    toast({
      title: "ÐÐ»Ð´Ð°Ð°",
      description: "Ð¥Ð°Ð¼Ð³Ð¸Ð¹Ð½ Ð±Ð°Ð³Ð°Ð´Ð°Ð° Ð½ÑÐ³ Ð±Ò¯Ñ€ÑÐ½ Ð°ÑÑƒÑƒÐ»Ñ‚ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.",
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
      title: "ÐÐ¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹",
      description: "Ð¨Ð¸Ð½Ñ Ð°ÑÑƒÑƒÐ»Ñ‚ÑƒÑƒÐ´ Ð°ÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ ÑÐ°Ð½Ð´ Ñ…Ð°Ð´Ð³Ð°Ð»Ð°Ð³Ð´Ð»Ð°Ð°.",
    });
  } catch (error) {
    toast({
      title: "ÐÐ»Ð´Ð°Ð°",
      description:
        error instanceof Error ? error.message : "ÐÑÑƒÑƒÐ»Ñ‚ÑƒÑƒÐ´Ñ‹Ð³ Ñ…Ð°Ð´Ð³Ð°Ð»Ð¶ Ñ‡Ð°Ð´ÑÐ°Ð½Ð³Ò¯Ð¹.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
}
