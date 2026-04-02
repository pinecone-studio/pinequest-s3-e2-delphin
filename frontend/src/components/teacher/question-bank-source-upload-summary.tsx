"use client";

import { Button } from "@/components/ui/button";

type Props = {
  grade: string;
  isUploading: boolean;
  newSourceName: string;
  onCancel: () => void;
  onDemo: () => void;
  onUpload: () => void;
  selectedSourceFile: File | null;
  subject: string;
  topic: string;
  unit: string;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="font-semibold text-[#5a5f80]">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function QuestionBankSourceUploadSummary({
  grade,
  isUploading,
  newSourceName,
  onCancel,
  onDemo,
  onUpload,
  selectedSourceFile,
  subject,
  topic,
  unit,
}: Props) {
  return (
    <div className="flex w-full flex-col rounded-[22px] border border-[#dbe6ff] bg-white/90 p-4 shadow-[0_18px_42px_rgba(177,196,235,0.18)] backdrop-blur">
      <div className="border-b border-[#dbe6ff] pb-4">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#353b4e]">
          Мэдээлэл
        </h3>
      </div>

      <div className="space-y-3 py-4 text-[#4b4f72]">
        <SummaryRow label="Нэр:" value={newSourceName.trim() || "Оруулаагүй"} />
        <SummaryRow label="Хичээл:" value={subject || "Оруулаагүй"} />
        <SummaryRow label="Анги:" value={grade || "Оруулаагүй"} />
        <SummaryRow label="Бүлэг:" value={unit || "Оруулаагүй"} />
        <SummaryRow label="Сэдэв:" value={topic || "Оруулаагүй"} />
        <SummaryRow
          label="PDF:"
          value={selectedSourceFile ? selectedSourceFile.name : "Сонгогдоогүй"}
        />
      </div>

      <div className="mt-auto border-t border-[#dbe6ff] pt-4">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onDemo}
            className="h-11 rounded-[18px] border-[#d8e2f6] text-sm font-medium text-[#5c6787] hover:bg-[#f6f9ff]"
          >
            Demo
          </Button>
          <Button
            type="button"
            onClick={onUpload}
            disabled={!selectedSourceFile || !newSourceName.trim() || isUploading}
            className="h-11 rounded-[18px] bg-[#1864FB] text-sm font-medium text-white shadow-[0_14px_28px_rgba(24,100,251,0.24)] hover:bg-[#0f57e7] disabled:bg-[#9fbcfb]"
          >
            {isUploading ? "Бүртгэж байна..." : "Эх сурвалжийг бүртгэх"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-10 rounded-[16px] text-sm text-[#66708f] hover:bg-[#f3f7ff] hover:text-[#425173]"
          >
            Болих
          </Button>
        </div>
      </div>
    </div>
  );
}
