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
    toast({ title: "Алдаа", description: "Асуултын тоо оруулна уу.", variant: "destructive" });
    return;
  }

  const selectedUploads = payload.selectedMockTests
    .map((id) => sourceFiles.find((file) => file.id === id))
    .filter((file): file is UploadRecord => Boolean(file));
  if (selectedUploads.length === 0 && payload.sourceFilesWithPages.length === 0) {
    toast({ title: "Алдаа", description: "Эх сурвалж файл сонгоно уу.", variant: "destructive" });
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
          "Ерөнхий",
      },
      fallbackMessage: "AI асуулт үүсгэхэд алдаа гарлаа.",
    });
    setBuilderQuestions((current) => [...current, ...generatedQuestions.map(toBuilderQuestion)]);
    setBuilderDifficulty(payload.difficulty);
    onComplete();
    toast({
      title: "Амжилттай",
      description: `${generatedQuestions.length} асуулт ноорогт нэмэгдлээ.`,
    });
  } catch (error) {
    toast({
      title: "Алдаа",
      description:
        error instanceof Error ? error.message : "AI асуулт үүсгэхэд алдаа гарлаа.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
}
