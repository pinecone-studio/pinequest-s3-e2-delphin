import type { Dispatch, SetStateAction } from "react";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";
import type { GeneratedQuestion } from "@/components/teacher/question-bank-page-types";
import { toBuilderQuestion } from "@/components/teacher/question-bank-page-types";
import { toast } from "@/hooks/use-toast";
import { requestBackendJson } from "@/lib/backend-fetch";
import type {
  QuestionBankCategory,
  QuestionBankDifficulty,
} from "@/lib/question-bank-api";
import type { UploadRecord } from "@/lib/uploads-api";

export async function generateQuestionBankAIQuestions({
  builderCategoryId,
  onComplete,
  payload,
  questionBank,
  setBuilderDifficulty,
  setBuilderQuestions,
  setIsGenerating,
  sourceFiles,
}: {
  builderCategoryId: string;
  onComplete: () => void;
  payload: {
    sourceFilesWithPages: { file: File; startPage: number; endPage: number }[];
    aiMCCount: number;
    aiTFCount: number;
    aiShortCount: number;
    variants: number;
    difficulty: "easy" | "standard" | "hard";
    category: string;
    selectedMockTests: string[];
  };
  questionBank: QuestionBankCategory[];
  setBuilderDifficulty: (value: QuestionBankDifficulty) => void;
  setBuilderQuestions: Dispatch<SetStateAction<NewQuestion[]>>;
  setIsGenerating: (value: boolean) => void;
  sourceFiles: UploadRecord[];
}) {
  const totalQuestions = payload.aiMCCount + payload.aiTFCount + payload.aiShortCount;
  if (totalQuestions === 0) {
    toast({ title: "ÐÐ»Ð´Ð°Ð°", description: "ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ Ñ‚Ð¾Ð¾ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.", variant: "destructive" });
    return;
  }

  const selectedUploads = payload.selectedMockTests
    .map((id) => sourceFiles.find((file) => file.id === id))
    .filter((file): file is UploadRecord => Boolean(file));
  if (selectedUploads.length === 0 && payload.sourceFilesWithPages.length === 0) {
    toast({ title: "ÐÐ»Ð´Ð°Ð°", description: "Ð­Ñ… ÑÑƒÑ€Ð²Ð°Ð»Ð¶ Ñ„Ð°Ð¹Ð» ÑÐ¾Ð½Ð³Ð¾Ð½Ð¾ ÑƒÑƒ.", variant: "destructive" });
    return;
  }

  setIsGenerating(true);
  try {
    const generatedQuestions = await requestBackendJson<GeneratedQuestion[]>("exams/ai/generate", {
      method: "POST",
      body: {
        sourceFiles: [
          ...selectedUploads.map((file) => ({ name: file.originalName, startPage: 1, endPage: 10 })),
          ...payload.sourceFilesWithPages.map((item) => ({
            name: item.file.name,
            startPage: item.startPage,
            endPage: item.endPage,
          })),
        ],
        mcCount: payload.aiMCCount,
        tfCount: payload.aiTFCount,
        shortAnswerCount: payload.aiShortCount,
        variants: payload.variants,
        difficulty: payload.difficulty,
        category:
          payload.category ||
          questionBank.find((item) => item.id === builderCategoryId)?.name ||
          "Ð•Ñ€Ó©Ð½Ñ…Ð¸Ð¹",
      },
      fallbackMessage: "AI Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°.",
    });
    setBuilderQuestions((current) => [...current, ...generatedQuestions.map(toBuilderQuestion)]);
    setBuilderDifficulty(payload.difficulty);
    onComplete();
    toast({
      title: "ÐÐ¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹",
      description: `${generatedQuestions.length} Ð°ÑÑƒÑƒÐ»Ñ‚ Ð½Ð¾Ð¾Ñ€Ð¾Ð³Ñ‚ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ.`,
    });
  } catch (error) {
    toast({
      title: "ÐÐ»Ð´Ð°Ð°",
      description:
        error instanceof Error ? error.message : "AI Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
}
