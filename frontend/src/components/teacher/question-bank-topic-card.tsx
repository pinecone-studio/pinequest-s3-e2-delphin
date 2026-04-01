"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuestionBankQuestion, QuestionBankTopic } from "@/lib/question-bank-api";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionBankTopicCardProps = {
  isExpanded: boolean;
  isQuestionSelectable?: (questionType: string) => boolean;
  onToggleQuestion?: (questionId: string, checked: boolean) => void;
  onToggleTopic: () => void;
  selectedQuestionIds: string[];
  topic: QuestionBankTopic;
};

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "easy") return "Хөнгөн";
  if (difficulty === "standard") return "Дунд";
  return "Хэцүү";
}

export function QuestionBankTopicCard({
  isExpanded,
  isQuestionSelectable,
  onToggleQuestion,
  onToggleTopic,
  selectedQuestionIds,
  topic,
}: QuestionBankTopicCardProps) {
  return (
    <div className="rounded-[20px] border border-[#e3ebfd] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
      <button
        type="button"
        onClick={onToggleTopic}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[#f8fbff]"
      >
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[#334265]">{topic.name}</h3>
          <p className="mt-1 text-sm text-[#6f7898]">{topic.questions.length} асуулт</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#7b8bb1] transition-transform",
            isExpanded ? "rotate-180" : "",
          )}
        />
      </button>

      {isExpanded ? (
        <div className="space-y-3 border-t border-[#e8eefb] px-4 py-4">
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

function QuestionBankQuestionCard({
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

  return (
    <div className="rounded-[22px] border border-[#e7edfb] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(177,198,232,0.08)]">
      <div className="flex items-start gap-3">
        {onToggleQuestion ? (
          <Checkbox
            checked={selectedQuestionIds.includes(question.id)}
            disabled={!isSelectable}
            onCheckedChange={(checked) => onToggleQuestion(question.id, checked === true)}
            className="mt-1"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7080a0]">
            <span>Асуулт {index + 1}</span>
            <Badge variant="outline" className="border-[#dce7ff] bg-[#f8fbff] text-[#526488]">
              {question.type}
            </Badge>
            <Badge variant="secondary" className="bg-[#eef4ff] text-[#4e6290]">
              {getDifficultyLabel(question.difficulty)}
            </Badge>
            <span>{question.points} оноо</span>
            {!isSelectable ? (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                Энэ төрлийг шалгалтад шууд ашиглахгүй
              </Badge>
            ) : null}
          </div>
          <p className="mt-3 font-medium text-[#2f3d60]">{question.question}</p>
        </div>
      </div>
    </div>
  );
}
