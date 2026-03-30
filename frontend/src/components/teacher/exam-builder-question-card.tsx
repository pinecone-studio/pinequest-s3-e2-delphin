"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import type {
  NewQuestion,
  QuestionType,
} from "@/components/teacher/exam-builder-types";

export function getQuestionTypeLabel(type: QuestionType) {
  if (type === "multiple-choice") return "Ð¡Ð¾Ð½Ð³Ð¾Ñ… Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‚Ð°Ð¹";
  if (type === "true-false") return "Ò®Ð½ÑÐ½/Ð¥ÑƒÐ´Ð°Ð»";
  if (type === "short-answer") return "Ð‘Ð¾Ð³Ð¸Ð½Ð¾ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚";
  return "Ð­ÑÑÑ";
}

function MultipleChoiceEditor({
  question,
  onUpdateOption,
  onUpdateQuestion,
}: {
  question: NewQuestion;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
}) {
  if (question.type !== "multiple-choice" || !question.options) return null;

  return (
    <div className="space-y-2">
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
            {String.fromCharCode(65 + optionIndex)}
          </div>
          <Input
            placeholder={`Ð¡Ð¾Ð½Ð³Ð¾Ð»Ñ‚ ${String.fromCharCode(65 + optionIndex)}`}
            value={option}
            onChange={(event) =>
              onUpdateOption(question.id, optionIndex, event.target.value)
            }
            className="flex-1"
          />
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">Ð—Ó©Ð² Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚:</Label>
        <Select
          value={question.correctAnswer}
          onValueChange={(value) =>
            onUpdateQuestion(question.id, { correctAnswer: value })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ð¡Ð¾Ð½Ð³Ð¾Ñ…" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option, optionIndex) => (
              <SelectItem
                key={optionIndex}
                value={option || `Ð¡Ð¾Ð½Ð³Ð¾Ð»Ñ‚ ${String.fromCharCode(65 + optionIndex)}`}
              >
                {String.fromCharCode(65 + optionIndex)}: {option || "(Ñ…Ð¾Ð¾ÑÐ¾Ð½)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ExamBuilderQuestionCard({
  index,
  onRemoveQuestion,
  onUpdateOption,
  onUpdateQuestion,
  question,
}: {
  index: number;
  onRemoveQuestion: (id: string) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  question: NewQuestion;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-semibold">ÐÑÑƒÑƒÐ»Ñ‚ {index + 1}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {getQuestionTypeLabel(question.type)}
              </div>
            </div>
            <Badge variant="outline">{getQuestionTypeLabel(question.type)}</Badge>
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
              className="h-8 w-20"
            />
            <span className="text-sm text-muted-foreground">Ð¾Ð½Ð¾Ð¾</span>
            <Button variant="ghost" size="sm" onClick={() => onRemoveQuestion(question.id)}>
              Ð£ÑÑ‚Ð³Ð°Ñ…
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={`ÐÑÑƒÑƒÐ»Ñ‚ ${index + 1}-Ð¸Ð¹Ð³ Ð±Ð¸Ñ‡Ð½Ñ Ò¯Ò¯`}
          value={question.question}
          onChange={(event) =>
            onUpdateQuestion(question.id, { question: event.target.value })
          }
          className="resize-none"
        />
        <MultipleChoiceEditor
          question={question}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
        />
        {question.type === "true-false" ? (
          <div className="flex items-center gap-4">
            <Label className="text-sm text-muted-foreground">Ð—Ó©Ð² Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚:</Label>
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
                <SelectItem value="True">Ò®Ð½ÑÐ½</SelectItem>
                <SelectItem value="False">Ð¥ÑƒÐ´Ð°Ð»</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
        {question.type === "short-answer" || question.type === "essay" ? (
          <div className="border-b border-dashed" />
        ) : null}
      </CardContent>
    </Card>
  );
}
