"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import {
  getExamQuestionIconAlt,
  getExamQuestionIconSrc,
} from "@/lib/question-icons";

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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E6F2FF] bg-[#F7FBFF] dark:border-white/10 dark:bg-[rgba(255,255,255,0.04)]">
              <img
                src={getExamQuestionIconSrc(question.iconKey)}
                alt={getExamQuestionIconAlt(question.iconKey)}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Асуулт {index + 1}</div>
              <div className="text-xs text-muted-foreground capitalize">{getQuestionTypeLabel(question.type)}</div>
            </div>
            <Badge variant="outline">{getQuestionTypeLabel(question.type)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={question.points}
              onChange={(event) => onUpdateQuestion(question.id, { points: parseInt(event.target.value) || 0 })}
              className="h-8 w-20"
            />
            <span className="text-sm text-muted-foreground">оноо</span>
            <Button variant="ghost" size="sm" onClick={() => onRemoveQuestion(question.id)}>Устгах</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={`Асуулт ${index + 1}-ийн тайлбар эсвэл өгүүлбэрийг бичнэ үү`}
          value={question.question}
          onChange={(event) => onUpdateQuestion(question.id, { question: event.target.value })}
          className="resize-none"
        />
        <ChoiceEditor question={question} onUpdateOption={onUpdateOption} onUpdateQuestion={onUpdateQuestion} />
        <MatchingEditor question={question} onUpdateOption={onUpdateOption} onUpdateQuestion={onUpdateQuestion} />
        <OrderingEditor question={question} onUpdateOption={onUpdateOption} onUpdateQuestion={onUpdateQuestion} />
        {question.type === "true-false" ? (
          <div className="flex items-center gap-4">
            <Label className="text-sm text-muted-foreground">Зөв хариулт:</Label>
            <Select value={question.correctAnswer} onValueChange={(value) => onUpdateQuestion(question.id, { correctAnswer: value })}>
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
        {question.type === "short-answer" ? <div className="border-b border-dashed" /> : null}
      </CardContent>
    </Card>
  );
}
