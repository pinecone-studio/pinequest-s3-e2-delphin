"use client";

import { useMemo, useState } from "react";
import { QuestionBankTopicCard } from "@/components/teacher/question-bank-topic-card";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { FileQuestion, Loader2 } from "lucide-react";

type QuestionBankResultsProps = {
  categories: QuestionBankCategory[];
  embedded?: boolean;
  isLoading: boolean;
  selectedQuestionIds?: string[];
  onToggleQuestion?: (questionId: string, checked: boolean) => void;
  isQuestionSelectable?: (questionType: string) => boolean;
};

export function QuestionBankResults({
  categories,
  embedded = false,
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
      <div className={`${embedded ? "rounded-[24px] border border-[#e7eefc] bg-white px-6 py-12" : "rounded-[28px] border border-white/70 bg-white/86 px-6 py-12 shadow-[0_20px_60px_rgba(177,198,232,0.14)]"}`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Асуултын санг ачаалж байна...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`${embedded ? "rounded-[24px] border border-dashed border-[#d7e3ff] bg-white px-6 py-12 text-center" : "rounded-[28px] border border-dashed border-[#d7e3ff] bg-white/88 px-6 py-12 text-center text-muted-foreground shadow-[0_20px_60px_rgba(177,198,232,0.12)]"} text-muted-foreground`}>
        <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Асуулт олдсонгүй</p>
        <p className="text-sm">
          Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${embedded ? "rounded-[24px] border border-[#e7eefc] bg-white p-4" : ""}`}>
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          {category.topics.map((topic) => {
            const isExpanded = visibleExpandedTopicIds.includes(topic.id);

            return (
              <QuestionBankTopicCard
                key={topic.id}
                categoryName={category.name}
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
      ))}
    </div>
  );
}
