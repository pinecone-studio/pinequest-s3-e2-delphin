"use client";

import Link from "next/link";
import { getQuestionTypeLabel, QuestionBankSummaryStat } from "@/components/teacher/question-bank-summary-stat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Хураангуй</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
          <QuestionBankSummaryStat label="Нийт асуулт" value={builderQuestions.length} />
          <QuestionBankSummaryStat label="Нийт оноо" value={totalPoints} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("multiple-choice")} value={questionCounts["multiple-choice"]} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("true-false")} value={questionCounts["true-false"]} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("fill")} value={questionCounts.fill} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("matching")} value={questionCounts.matching} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("ordering")} value={questionCounts.ordering} />
          <QuestionBankSummaryStat label={getQuestionTypeLabel("short-answer")} value={questionCounts["short-answer"]} />
        </div>

        <div className="space-y-2">
          <Label>Түвшин</Label>
          <Select value={builderDifficulty} onValueChange={(value) => onBuilderDifficultyChange(value as QuestionBankDifficulty)}>
            <SelectTrigger>
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
      </CardContent>
    </Card>
  );
}
