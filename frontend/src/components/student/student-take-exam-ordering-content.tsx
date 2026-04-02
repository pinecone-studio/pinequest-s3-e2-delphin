"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ExamQuestion } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function parseOrderingAnswer(value: string, length: number) {
  const result = Array.from({ length }, () => "");
  value.split(",").map((item) => item.trim()).filter(Boolean).forEach((item, index) => {
    if (index < length) result[index] = item;
  });
  return result;
}

function buildOrderingAnswer(selection: string[]) {
  return selection.join(",");
}

export function OrderingQuestionContent(props: {
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { question, value, onAnswerChange } = props;
  const selectedOrder = parseOrderingAnswer(value, question.options?.length ?? 0);
  const availableItems = (question.options ?? []).map((option, index) => ({
    key: String(index + 1),
    label: option,
  })).filter((item) => !selectedOrder.includes(item.key));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-[#E6F2FF] bg-[#FCFCFF] p-4">
        <p className="text-sm font-semibold text-[#293138]">Сонгох мөрүүд</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableItems.map((item) => (
            <Button key={item.key} type="button" variant="outline" onClick={() => onAnswerChange(question.id, buildOrderingAnswer([...selectedOrder.filter(Boolean), item.key]))}>
              {item.key}. {item.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[#293138]">Таны дараалал</Label>
        <div className="grid gap-2">
          {(question.options ?? []).map((_, index) => {
            const selectedKey = selectedOrder[index];
            const selectedItem = (question.options ?? []).find((__, itemIndex) => String(itemIndex + 1) === selectedKey);
            return (
              <button
                key={`${question.id}-order-slot-${index}`}
                type="button"
                onClick={() => {
                  if (!selectedKey) return;
                  const next = selectedOrder.filter((_, orderIndex) => orderIndex !== index);
                  onAnswerChange(question.id, buildOrderingAnswer(next));
                }}
                className={cn("flex min-h-12 items-center rounded-xl border px-3 py-3 text-left", selectedKey ? "border-[#66B2FF] bg-[#F5FAFF]" : "border-[#E1E6EB] bg-white")}
              >
                {selectedKey ? `${index + 1}. ${selectedKey}. ${selectedItem}` : `${index + 1}. Хоосон`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

