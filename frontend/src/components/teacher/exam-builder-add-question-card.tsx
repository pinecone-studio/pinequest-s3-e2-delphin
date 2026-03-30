"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuestionType } from "@/components/teacher/exam-builder-types";

export function ExamBuilderAddQuestionCard({
  onAddQuestion,
}: {
  onAddQuestion: (type: QuestionType) => void;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="mb-3 text-sm text-muted-foreground">ÐÑÑƒÑƒÐ»Ñ‚ Ð½ÑÐ¼ÑÑ…</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onAddQuestion("multiple-choice")}>
            Ð¡Ð¾Ð½Ð³Ð¾Ñ… Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‚Ð°Ð¹
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddQuestion("true-false")}>
            Ò®Ð½ÑÐ½/Ð¥ÑƒÐ´Ð°Ð»
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddQuestion("short-answer")}>
            Ð‘Ð¾Ð³Ð¸Ð½Ð¾ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddQuestion("essay")}>
            Ð­ÑÑÑ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
