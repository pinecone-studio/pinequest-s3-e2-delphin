"use client";

import { QuestionBankQuestionCard } from "@/components/teacher/question-bank-question-card";
import type { QuestionBankTopic } from "@/lib/question-bank-api";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionBankTopicCardProps = {
  categoryName: string;
  isExpanded: boolean;
  isQuestionSelectable?: (questionType: string) => boolean;
  onToggleQuestion?: (questionId: string, checked: boolean) => void;
  onToggleTopic: () => void;
  selectedQuestionIds: string[];
  topic: QuestionBankTopic;
};

export function QuestionBankTopicCard({
  categoryName,
  isExpanded,
  isQuestionSelectable,
  onToggleQuestion,
  onToggleTopic,
  selectedQuestionIds,
  topic,
}: QuestionBankTopicCardProps) {
  return (
    <div className="rounded-[24px] border border-[#e3ebfd] bg-[linear-gradient(180deg,#fdfefe_0%,#ffffff_100%)] shadow-[0_12px_30px_rgba(168,196,235,0.08)]">
      <button
        type="button"
        onClick={onToggleTopic}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#f8fbff]",
          isExpanded ? "rounded-t-[24px]" : "rounded-[24px]",
        )}
      >
        <div className="min-w-0 flex flex-1 flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[16px] font-semibold text-[#4c4c66]">
            Математик
          </span>
          <span className="truncate text-[16px] font-normal text-[#4c4c66]">
            | бүлэг: {categoryName}
          </span>
          <span className="truncate text-[16px] font-normal text-[#4c4c66]">
            {topic.name}
          </span>
          <span className="rounded-full bg-[#eef2f8] px-3 py-1 text-[14px] font-medium text-[#6f7898]">
            {topic.questions.length} асуулт
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#6f7898] transition-transform",
            isExpanded ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>

      {isExpanded ? (
        <div className="space-y-3 border-t border-[#e8eefb] px-6 py-5">
          {topic.questions.map((question, index) => (
            <QuestionBankQuestionCard
              key={question.id}
              index={index}
              isQuestionSelectable={isQuestionSelectable}
              onToggleQuestion={onToggleQuestion}
              question={question}
              selectedQuestionIds={selectedQuestionIds}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
