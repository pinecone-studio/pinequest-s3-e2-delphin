"use client";

import { Button } from "@/components/ui/button";
import type { QuestionType } from "@/components/teacher/exam-builder-types";

export function ExamBuilderAddQuestionCard({
  onAddQuestion,
}: {
  onAddQuestion: (type: QuestionType) => void;
}) {
  return (
    <section className="border-t border-[#edf2ff] py-4">
      <p className="mb-3 text-sm text-muted-foreground">
        Эсвэл өөр асуулт бэлдүүлэх
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddQuestion("multiple-choice")}
        >
          Сонгох хариулттай
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddQuestion("true-false")}
        >
          Үнэн / худал
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddQuestion("matching")}
        >
          Харгалзуулах
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddQuestion("short-answer")}
        >
          Богино хариулт
        </Button>
      </div>
    </section>
  );
}
