"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ChoiceEditor,
  getQuestionTypeLabel,
} from "@/components/teacher/exam-builder-question-editors";
import {
  MatchingEditor,
  OrderingEditor,
} from "@/components/teacher/exam-builder-structured-question-editors";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";

export function ExamBuilderQuestionCard({
  index,
  onRemoveQuestion,
  onUpdateOption,
  onUpdateQuestion,
  question,
}: {
  index: number;
  onRemoveQuestion: (id: string) => void;
  onUpdateOption: (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  question: NewQuestion;
}) {
  return (
    <section className="space-y-4 border-t border-[#edf2ff] pt-6 first:border-t-0 first:pt-0">
      <div className="px-0 pb-3 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-lg font-semibold text-[#4b4f72]">
                Асуулт {index + 1}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {getQuestionTypeLabel(question.type)}
              </div>
            </div>
            <Badge
              className="border-0 bg-[#dbe7ff] text-[#7f97d9]"
              variant="outline"
            >
              {getQuestionTypeLabel(question.type)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={question.points}
              onChange={(event) =>
                onUpdateQuestion(question.id, {
                  points: parseInt(event.target.value) || 0,
                })
              }
              className="h-9 w-24 rounded-[12px] border-[#dce7ff] bg-white"
            />
            <span className="text-sm text-muted-foreground">оноо</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveQuestion(question.id)}
            >
              Устгах
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Textarea
          placeholder={`Асуулт ${index + 1}-ийн тайлбар эсвэл өгүүлбэрийг бичнэ үү`}
          value={question.question}
          onChange={(event) =>
            onUpdateQuestion(question.id, { question: event.target.value })
          }
          className="resize-none"
        />
        <ChoiceEditor
          question={question}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
        />
        <MatchingEditor
          question={question}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
        />
        <OrderingEditor
          question={question}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
        />
        {question.type === "true-false" ? (
          <div className="flex items-center gap-4">
            <Label className="text-sm text-muted-foreground">
              Зөв хариулт:
            </Label>
            <Select
              value={question.correctAnswer}
              onValueChange={(value) =>
                onUpdateQuestion(question.id, { correctAnswer: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="True">Үнэн</SelectItem>
                <SelectItem value="False">Худал</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
        {question.type === "short-answer" ? (
          <div className="border-b border-dashed" />
        ) : null}
      </div>
    </section>
  );
}
