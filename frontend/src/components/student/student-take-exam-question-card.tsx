"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { ExamQuestion } from "@/lib/mock-data"
import { getQuestionTypeLabel } from "@/lib/student-exam-submission"
import { cn } from "@/lib/utils"

export function StudentTakeExamQuestionCard(props: {
  index: number
  question: ExamQuestion
  value: string
  onAnswerChange: (questionId: string, value: string) => void
}) {
  const { index, question, value, onAnswerChange } = props
  const isAnswered = value.trim().length > 0
  const options = question.options ?? ["Үнэн", "Худал"]

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[1.5rem] border-slate-200 bg-white/95 shadow-sm",
        isAnswered ? "ring-1 ring-emerald-200" : "",
      )}
    >
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Асуулт {index + 1}</span>
              <span>•</span>
              <span>{getQuestionTypeLabel(question)}</span>
            </div>
            <CardTitle className="text-xl leading-7 text-slate-900">
              {question.question}
            </CardTitle>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {question.points} оноо
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {question.type === "multiple-choice" || question.type === "true-false" ? (
          <RadioGroup
            value={value}
            onValueChange={(nextValue) => onAnswerChange(question.id, nextValue)}
            className="gap-3"
          >
            {options.map((option, optionIndex) => {
              const isSelected = value === option
              const controlId = `${question.id}-${optionIndex}-${option}`

              return (
                <Label
                  key={`${question.id}-${optionIndex}-${option}`}
                  htmlFor={controlId}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition-all",
                    "hover:border-sky-300 hover:bg-sky-50/80",
                    "focus-within:ring-2 focus-within:ring-sky-200",
                    isSelected
                      ? "border-sky-500 bg-sky-50 text-slate-900 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700",
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={controlId}
                    className={cn(
                      "size-5 border-2 border-slate-400 bg-white shadow-none",
                      isSelected ? "border-sky-600 text-sky-600" : "",
                    )}
                  />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="text-base font-medium leading-6">{option}</span>
                    {isSelected ? (
                      <CheckCircle2 className="size-5 shrink-0 text-sky-600" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-slate-300" />
                    )}
                  </div>
                </Label>
              )
            })}
          </RadioGroup>
        ) : question.type === "short-answer" ? (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-semibold text-slate-700">
              Хариулт
            </Label>
            <Input
              id={question.id}
              value={value}
              onChange={(event) => onAnswerChange(question.id, event.target.value)}
              className="h-12 rounded-xl border-slate-300 bg-white text-base"
              placeholder="Хариултаа энд бичнэ үү"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-semibold text-slate-700">
              Хариулт
            </Label>
            <Textarea
              id={question.id}
              value={value}
              onChange={(event) => onAnswerChange(question.id, event.target.value)}
              rows={7}
              className="rounded-xl border-slate-300 bg-white text-base leading-6"
              placeholder="Дэлгэрэнгүй хариултаа энд бичнэ үү"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
