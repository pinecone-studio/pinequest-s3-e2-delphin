"use client";

import type { QuestionType } from "@/components/teacher/exam-builder-types";

export function getQuestionTypeLabel(type: QuestionType) {
  if (type === "multiple-choice") return "Сонгох хариулттай";
  if (type === "true-false") return "Үнэн / худал";
  if (type === "matching") return "Харгалзуулах";
  if (type === "fill") return "Нөхөх";
  return "Богино хариулт";
}

export function QuestionBankSummaryStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-muted/50 px-4 py-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
