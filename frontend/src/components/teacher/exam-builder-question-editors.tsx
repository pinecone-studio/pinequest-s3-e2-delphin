"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";

export const matchingSeparator = "|||";

export function getQuestionTypeLabel(type: QuestionType) {
  if (type === "multiple-choice") return "Сонгох хариулттай";
  if (type === "true-false") return "Үнэн / худал";
  if (type === "matching") return "Харгалзуулах";
  if (type === "ordering") return "Дараалуулах";
  if (type === "fill") return "Нөхөх";
  return "Богино хариулт";
}

type EditorProps = {
  question: NewQuestion;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
};

export function ChoiceEditor(props: EditorProps) {
  const { question, onUpdateOption, onUpdateQuestion } = props;

  if (question.type !== "multiple-choice" || !question.options) return null;

  return (
    <div className="space-y-2">
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
            {String.fromCharCode(65 + optionIndex)}
          </div>
          <Input
            placeholder={`Сонголт ${String.fromCharCode(65 + optionIndex)}`}
            value={option}
            onChange={(event) => onUpdateOption(question.id, optionIndex, event.target.value)}
            className="flex-1"
          />
        </div>
      ))}

      <div className="mt-2 flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">Зөв хариулт:</Label>
        <Select value={question.correctAnswer} onValueChange={(value) => onUpdateQuestion(question.id, { correctAnswer: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Сонгох" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option, optionIndex) => (
              <SelectItem key={optionIndex} value={option || `Сонголт ${String.fromCharCode(65 + optionIndex)}`}>
                {String.fromCharCode(65 + optionIndex)}: {option || "(хоосон)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
