"use client";

import { FileText, Upload } from "lucide-react";
import { formatFileSize } from "@/components/teacher/question-bank-source-shared";

type Props = {
  fileInputId: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSourceFile: File | null;
};

export function QuestionBankSourceUploadFileField({
  fileInputId,
  onFileSelect,
  selectedSourceFile,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-[14px] font-semibold text-[#4b4f72]" htmlFor={fileInputId}>
        PDF файл
      </label>
      <input
        id={fileInputId}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={onFileSelect}
      />
      <label
        htmlFor={fileInputId}
        className="flex h-[50px] cursor-pointer items-center justify-between gap-4 rounded-[20px] border border-dashed border-[#cfe0ff] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-3 transition hover:border-[#1864FB] hover:bg-[#f7faff]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#eaf2ff] text-[#1864FB]">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-[14px] font-semibold text-[#4b4f72]">
              {selectedSourceFile ? selectedSourceFile.name : "PDF файл сонгох"}
            </p>
            <p className="truncate text-[12px] text-[#8b92ac]">
              {selectedSourceFile
                ? `${formatFileSize(selectedSourceFile.size)} хэмжээтэй файл`
                : "Нэг PDF файл оруулна уу"}
            </p>
          </div>
        </div>
        <div className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#1864FB] px-3 text-[12px] font-medium text-white shadow-[0_12px_24px_rgba(24,100,251,0.22)]">
          <Upload className="mr-1.5 h-3 w-3" />
          Файл сонгох
        </div>
      </label>
    </div>
  );
}
