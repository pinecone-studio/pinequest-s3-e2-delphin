"use client";

import { Button } from "@/components/ui/button";

type Props = {
  grade: string;
  isUploading: boolean;
  newSourceName: string;
  onUpload: () => void;
  selectedSourceFile: File | null;
  subject: string;
  topic: string;
  unit: string;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[14px] leading-5">
      <span className="shrink-0 font-semibold text-[#5a5f80]">{label}</span>
      <span className="max-w-[188px] text-right font-medium text-[#353b4e]">
        {value}
      </span>
    </div>
  );
}

export function QuestionBankSourceUploadSummary({
  grade,
  isUploading,
  newSourceName,
  onUpload,
  selectedSourceFile,
  subject,
  topic,
  unit,
}: Props) {
  return (
    <div className="flex h-[290px] w-[320px] flex-col rounded-[22px] border border-[#dbe6ff] bg-white px-[18px] py-4 shadow-[0_20px_48px_rgba(177,196,235,0.18)]">
      <div className="border-b border-[#dbe6ff] pb-2">
        <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#353b4e]">
          Мэдээлэл
        </h3>
      </div>

      <div className="flex flex-1 flex-col justify-evenly py-2 text-[#4b4f72]">
        <SummaryRow label="Нэр:" value={newSourceName.trim() || "Оруулаагүй"} />
        <SummaryRow label="Хичээл:" value={subject || "Оруулаагүй"} />
        <SummaryRow label="Анги:" value={grade || "Оруулаагүй"} />
        <SummaryRow label="Бүлэг:" value={unit || "Оруулаагүй"} />
        <SummaryRow label="Сэдэв:" value={topic || "Оруулаагүй"} />
      </div>

      <div className="mt-auto border-t border-[#dbe6ff] pt-2">
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={onUpload}
            disabled={!selectedSourceFile || !newSourceName.trim() || isUploading}
            className="h-[36px] w-[253px] rounded-[18px] bg-[#315df3] text-[14px] font-medium text-white shadow-[0_14px_28px_rgba(24,100,251,0.24)] hover:bg-[#254fe4] disabled:bg-[#9fbcfb]"
          >
            {isUploading ? "Бүртгэж байна..." : "Эх сурвалжийг бүртгэх"}
          </Button>
        </div>
      </div>
    </div>
  );
}
