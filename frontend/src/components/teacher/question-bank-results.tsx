"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { QuestionBankTopicCard } from "@/components/teacher/question-bank-topic-card";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { FileQuestion, Loader2 } from "lucide-react";

type QuestionBankResultsProps = {
  categories: QuestionBankCategory[];
  isLoading: boolean;
  selectedQuestionIds?: string[];
  onToggleQuestion?: (questionId: string, checked: boolean) => void;
  isQuestionSelectable?: (questionType: string) => boolean;
};

export function QuestionBankResults({
  categories,
  isLoading,
  selectedQuestionIds = [],
  onToggleQuestion,
  isQuestionSelectable,
}: QuestionBankResultsProps) {
  const [expandedTopicIds, setExpandedTopicIds] = useState<string[]>([]);

  const topicIds = useMemo(
    () => categories.flatMap((category) => category.topics.map((topic) => topic.id)),
    [categories],
  );

  const visibleExpandedTopicIds = expandedTopicIds.filter((topicId) =>
    topicIds.includes(topicId),
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/70 bg-white/86 px-6 py-12 shadow-[0_20px_60px_rgba(177,198,232,0.14)]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Асуултын санг ачаалж байна...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#d7e3ff] bg-white/88 px-6 py-12 text-center text-muted-foreground shadow-[0_20px_60px_rgba(177,198,232,0.12)]">
        <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Асуулт олдсонгүй</p>
        <p className="text-sm">
          Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <section
          key={category.id}
          className="overflow-hidden rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,250,255,0.92)_100%)] shadow-[0_16px_42px_rgba(177,198,232,0.12)]"
        >
          <div className="border-b border-[#e8eefb] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#303959]">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-[#6f7898]">
                  {category.topics.length} сэдэв
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-[#dce7ff] bg-[#f8fbff] px-3 py-1 text-[#4b5d86]"
              >
                {category.topics.reduce((sum, topic) => sum + topic.questions.length, 0)} асуулт
              </Badge>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 sm:px-5">
            {category.topics.map((topic) => {
              const isExpanded = visibleExpandedTopicIds.includes(topic.id);

              return (
                <QuestionBankTopicCard
                  key={topic.id}
                  isExpanded={isExpanded}
                  isQuestionSelectable={isQuestionSelectable}
                  onToggleQuestion={onToggleQuestion}
                  onToggleTopic={() => toggleTopic(topic.id)}
                  selectedQuestionIds={selectedQuestionIds}
                  topic={topic}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
