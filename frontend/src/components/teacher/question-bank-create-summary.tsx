"use client";

import Link from "next/link";
import { getQuestionTypeLabel } from "@/components/teacher/question-bank-summary-stat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import type { QuestionBankDifficulty } from "@/lib/question-bank-api";

type Props = {
  builderDifficulty: QuestionBankDifficulty;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  isSaving: boolean;
  onBuilderDifficultyChange: (value: QuestionBankDifficulty) => void;
  onCancel: () => void;
  onSave: () => void;
};

const emptyCounts = {
  "multiple-choice": 0,
  "true-false": 0,
  fill: 0,
  matching: 0,
  ordering: 0,
  "short-answer": 0,
} satisfies Record<QuestionType, number>;

export function QuestionBankCreateSummary({
  builderDifficulty,
  builderQuestions,
  builderTopicName,
  isSaving,
  onBuilderDifficultyChange,
  onCancel,
  onSave,
}: Props) {
  const questionCounts = builderQuestions.reduce(
    (counts, question) => ({ ...counts, [question.type]: counts[question.type] + 1 }),
    emptyCounts,
  );
  const totalPoints = builderQuestions.reduce((sum, question) => sum + question.points, 0);

  return (
    <section className="space-y-6 border-t border-[#edf2ff] pt-6">
      <div className="text-[24px] text-[#4b4f72]">Хураангуй</div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        <SummaryTextStat label="Нийт асуулт" value={builderQuestions.length} />
        <SummaryTextStat label="Нийт оноо" value={totalPoints} />
        <SummaryTextStat label={getQuestionTypeLabel("multiple-choice")} value={questionCounts["multiple-choice"]} />
        <SummaryTextStat label={getQuestionTypeLabel("true-false")} value={questionCounts["true-false"]} />
        <SummaryTextStat label={getQuestionTypeLabel("fill")} value={questionCounts.fill} />
        <SummaryTextStat label={getQuestionTypeLabel("matching")} value={questionCounts.matching} />
        <SummaryTextStat label={getQuestionTypeLabel("short-answer")} value={questionCounts["short-answer"]} />
      </div>
      <div className="space-y-2">
        <Label>Түвшин</Label>
        <Select value={builderDifficulty} onValueChange={(value) => onBuilderDifficultyChange(value as QuestionBankDifficulty)}>
          <SelectTrigger className="rounded-[14px] border-[#dce7ff] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Хөнгөн</SelectItem>
            <SelectItem value="standard">Дунд</SelectItem>
            <SelectItem value="hard">Хэцүү</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/teacher/question-bank" onClick={onCancel}>Болих</Link>
        </Button>
        <Button onClick={onSave} disabled={isSaving || !builderTopicName.trim()}>
          {isSaving ? "Хадгалж байна..." : "Асуултуудыг хадгалах"}
        </Button>
      </div>
    </section>
  );
}

function SummaryTextStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold text-[#23345d]">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
