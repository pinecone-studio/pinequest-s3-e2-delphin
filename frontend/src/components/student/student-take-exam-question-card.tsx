"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExamQuestion } from "@/lib/mock-data";
import { getQuestionTypeLabel } from "@/lib/student-exam-submission";
import { cn } from "@/lib/utils";
import {
  MatchingQuestionContent,
  OrderingQuestionContent,
} from "@/components/student/student-take-exam-structured-content";

function getChoiceOptions(question: ExamQuestion) {
  if (question.type === "true-false") {
    return [
      { value: "True", label: "Үнэн" },
      { value: "False", label: "Худал" },
    ];
  }
  return (question.options ?? []).map((option) => ({ value: option, label: option }));
}

export function StudentTakeExamQuestionCard(props: {
  index: number;
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { index, question, value, onAnswerChange } = props;
  const isAnswered = value.trim().length > 0;
  const options = getChoiceOptions(question);

  return (
    <Card className={cn("overflow-hidden rounded-[18px] border-[#E6F2FF] bg-white shadow-[0_8px_24px_rgba(41,49,56,0.08)]", isAnswered ? "ring-1 ring-[#CCE5FF]" : "")}>
      <CardHeader className="border-b border-[#E6F2FF] pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#89939C]">
              <span>Асуулт {index + 1}</span>
              <span>•</span>
              <span>{getQuestionTypeLabel(question)}</span>
            </div>
            <CardTitle className="text-xl leading-7 text-[#293138]">{question.question}</CardTitle>
          </div>
          <div className="rounded-full bg-[#E6F2FF] px-3 py-1 text-sm font-semibold text-[#007FFF]">{question.points} оноо</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {question.type === "multiple-choice" || question.type === "true-false" ? (
          <RadioGroup value={value} onValueChange={(nextValue) => onAnswerChange(question.id, nextValue)} className="gap-3">
            {options.map((option, optionIndex) => {
              const isSelected = value === option.value;
              const controlId = `${question.id}-${optionIndex}-${option.value}`;
              return (
                <Label
                  key={controlId}
                  htmlFor={controlId}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition-all",
                    "hover:border-[#66B2FF] hover:bg-[#F5FAFF] focus-within:ring-2 focus-within:ring-[#CCE5FF]",
                    isSelected ? "border-[#007FFF] bg-[#F5FAFF] text-[#293138] shadow-[0_6px_16px_rgba(0,127,255,0.12)]" : "border-[#E1E6EB] bg-white text-[#3F4850]",
                  )}
                >
                  <RadioGroupItem value={option.value} id={controlId} className={cn("size-5 border-2 border-[#89939C] bg-white shadow-none", isSelected ? "border-[#007FFF] text-[#007FFF]" : "")} />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="text-base font-medium leading-6">{option.label}</span>
                    {isSelected ? <CheckCircle2 className="size-5 shrink-0 text-[#007FFF]" /> : <Circle className="size-4 shrink-0 text-[#E1E6EB]" />}
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        ) : question.type === "short-answer" ? (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-semibold text-[#293138]">Хариулт</Label>
            <Input
              id={question.id}
              value={value}
              onChange={(event) => onAnswerChange(question.id, event.target.value)}
              className="h-12 rounded-xl border-[#E1E6EB] bg-white text-base"
              placeholder="Хариултаа энд бичнэ үү"
            />
          </div>
        ) : question.type === "matching" ? (
          <MatchingQuestionContent question={question} value={value} onAnswerChange={onAnswerChange} />
        ) : (
          <OrderingQuestionContent question={question} value={value} onAnswerChange={onAnswerChange} />
        )}
      </CardContent>
    </Card>
  );
}

