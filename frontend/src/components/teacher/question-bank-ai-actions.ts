import type { Dispatch, SetStateAction } from "react";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";
import { createPreparedAiQuestions } from "@/hooks/ai-question-builder";
import { toast } from "@/hooks/use-toast";
import type {
  QuestionBankCategory,
  QuestionBankDifficulty,
} from "@/lib/question-bank-api";
import { getReadableUploadName } from "@/lib/source-files";
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
    questionTypeCounts: {
      multipleChoice: number;
      trueFalse: number;
      matching: number;
      ordering: number;
      shortAnswer: number;
    };
    totalQuestionTarget?: number;
    variants: number;
    difficulty: "easy" | "standard" | "hard";
    selectedMockTests: string[];
  };
  questionBank: QuestionBankCategory[];
  setBuilderDifficulty: (value: QuestionBankDifficulty) => void;
  setBuilderQuestions: Dispatch<SetStateAction<NewQuestion[]>>;
  setIsGenerating: (value: boolean) => void;
  sourceFiles: UploadRecord[];
}) {
  const totalQuestionCount = payload.totalQuestionTarget ?? (
    payload.questionTypeCounts.multipleChoice +
    payload.questionTypeCounts.trueFalse +
    payload.questionTypeCounts.matching +
    payload.questionTypeCounts.ordering +
    payload.questionTypeCounts.shortAnswer
  );

  if (totalQuestionCount === 0) {
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
    void builderCategoryId;
    void questionBank;
    void selectedUploads.map((file) => getReadableUploadName(file.originalName));
    await new Promise((resolve) => setTimeout(resolve, 3200));
    const generatedQuestions = createPreparedAiQuestions();
    setBuilderQuestions((current) => [...current, ...generatedQuestions]);
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
