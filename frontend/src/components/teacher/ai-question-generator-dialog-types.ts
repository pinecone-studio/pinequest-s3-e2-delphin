import type { ChangeEvent, DragEvent } from "react";
import type { UploadRecord } from "@/lib/uploads-api";

export interface SourceFileWithPages {
  file: File;
  startPage: number;
  endPage: number;
}

export type QuestionGeneratorPayload = {
  sourceFilesWithPages: SourceFileWithPages[];
  aiMCCount: number;
  aiTFCount: number;
  aiShortCount: number;
  variants: number;
  difficulty: "easy" | "standard" | "hard";
  category: string;
  selectedMockTests: string[];
};

type SharedProps = {
  availableSourceFiles?: UploadRecord[];
  isGenerating: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTest: (testId: string, checked: boolean) => void;
  open: boolean;
  selectedMockTests: string[];
};

export type BuilderDialogProps = SharedProps & {
  aiMCCount: number;
  aiTFCount: number;
  aiShortCount: number;
  isDragging: boolean;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void | Promise<void>;
  onRemoveSourceFile: (fileName: string) => void;
  selectedSourceFiles: File[];
  setAiMCCount: (value: number) => void;
  setAiTFCount: (value: number) => void;
  setAiShortCount: (value: number) => void;
};

export type QuestionBankDialogProps = SharedProps & {
  onGenerate: (payload: QuestionGeneratorPayload) => void | Promise<void>;
};

export type AIQuestionGeneratorDialogProps =
  | BuilderDialogProps
  | QuestionBankDialogProps;

export function isBuilderDialogProps(
  props: AIQuestionGeneratorDialogProps,
): props is BuilderDialogProps {
  return "selectedSourceFiles" in props;
}
