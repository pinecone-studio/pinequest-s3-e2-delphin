"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuestionBankQuestion } from "@/lib/question-bank-api";
import { cn } from "@/lib/utils";

export function QuestionBankQuestionCard({
  index,
  isQuestionSelectable,
  onToggleQuestion,
  question,
  selectedQuestionIds,
}: {
  index: number;
  isQuestionSelectable?: (questionType: string) => boolean;
  onToggleQuestion?: (questionId: string, checked: boolean) => void;
  question: QuestionBankQuestion;
  selectedQuestionIds: string[];
}) {
  const isSelectable = isQuestionSelectable ? isQuestionSelectable(question.type) : true;
  const isSelected = selectedQuestionIds.includes(question.id);
  const isCardClickable = Boolean(onToggleQuestion) && isSelectable;

  const handleCardClick = () => {
    if (!isCardClickable || !onToggleQuestion) return;
    onToggleQuestion(question.id, !isSelected);
  };

  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#e7edfb] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(177,198,232,0.08)]",
        isCardClickable ? "cursor-pointer" : "",
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {onToggleQuestion ? (
          <div onClick={(event) => event.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              disabled={!isSelectable}
              onCheckedChange={(checked) => onToggleQuestion(question.id, checked === true)}
              className="mt-1"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#7080a0]">
            <span className="text-[16px] font-normal text-[#6f7898]">Асуулт {index + 1}</span>
            <Badge
              variant="outline"
              className="rounded-[12px] border-[#afc8ff] bg-[#afc8ff] px-3 py-1 text-[12px] font-medium text-white"
            >
              {getQuestionTypeLabel(question.type)}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "rounded-[12px] border px-3 py-1 text-[12px] font-medium",
                getDifficultyBadgeClass(question.difficulty),
              )}
            >
              {getDifficultyLabel(question.difficulty)}
            </Badge>
            {!isSelectable ? (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                Энэ төрлийг шалгалтад шууд ашиглахгүй
              </Badge>
            ) : null}
          </div>
          <p className="mt-4 text-[16px] font-semibold text-[#2f3d60]">{question.question}</p>
        </div>
      </div>
    </div>
  );
}

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "easy") return "Хөнгөн";
  if (difficulty === "standard") return "Дунд";
  return "Хүнд";
}

function getQuestionTypeLabel(type: string) {
  if (type === "multiple-choice") return "Сонгох даалгавар";
  if (type === "short-answer") return "Богино хариулт";
  if (type === "true-false") return "Үнэн худал";
  if (type === "matching") return "Харгалзуулах";
  if (type === "ordering") return "Дараалуулах";
  if (type === "fill") return "Нөхөх";
  return type;
}

function getDifficultyBadgeClass(difficulty: string) {
  if (difficulty === "easy") return "border-[#A4F4CF] bg-[#D0FAE5] text-[#006045]";
  if (difficulty === "standard") return "border-[#FEE685] bg-[#FEF3C6] text-[#973C00]";
  return "border-[#FFC9C9] bg-[#FFE2E2] text-[#9F0712]";
}
