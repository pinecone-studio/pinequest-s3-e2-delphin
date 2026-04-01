"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewQuestion } from "@/components/teacher/exam-builder-types";
import { matchingSeparator } from "@/components/teacher/exam-builder-question-editors";

type EditorProps = {
  question: NewQuestion;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
};

function getMatchingPair(value: string) {
  const [left = "", right = ""] = value.split(matchingSeparator);
  return { left, right };
}

function parseMatchingAnswer(value: string, length: number) {
  const result = Array.from({ length }, () => "");
  value.split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => {
    const [left, right] = item.split("-");
    const index = Number(left) - 1;
    if (index >= 0 && index < length) result[index] = (right ?? "").trim();
  });
  return result;
}

function buildMatchingAnswer(selection: string[]) {
  return selection.map((value, index) => `${index + 1}-${value}`).join(",");
}

function parseOrderingAnswer(value: string, length: number) {
  const result = Array.from({ length }, () => "");
  value.split(",").map((item) => item.trim()).filter(Boolean).forEach((item, index) => {
    if (index < length) result[index] = item;
  });
  return result;
}

function buildOrderingAnswer(selection: string[]) {
  return selection.join(",");
}

function updateMatchingOptions(
  question: NewQuestion,
  index: number,
  field: "left" | "right",
  value: string,
  onUpdateQuestion: EditorProps["onUpdateQuestion"],
) {
  const options = [...(question.options ?? [])];
  const pair = getMatchingPair(options[index] ?? "");
  options[index] = field === "left" ? `${value}${matchingSeparator}${pair.right}` : `${pair.left}${matchingSeparator}${value}`;
  onUpdateQuestion(question.id, { options });
}

export function MatchingEditor({ question, onUpdateQuestion }: EditorProps) {
  if (question.type !== "matching" || !question.options) return null;
  const options = question.options;
  const answerSelection = parseMatchingAnswer(question.correctAnswer ?? "", options.length);

  return (
    <div className="space-y-3 rounded-xl border border-dashed p-4">
      <p className="text-sm text-muted-foreground">Зүүн ба баруун талын өгөгдлөө оруулна. Зөв хариултыг мөр бүр дээр үсгээр сонгоно.</p>
      {options.map((option, optionIndex) => {
        const pair = getMatchingPair(option);
        const currentValue = answerSelection[optionIndex];
        const usedValues = answerSelection.filter((value, index) => value && index !== optionIndex);
        return (
          <div key={optionIndex} className="grid gap-3 md:grid-cols-[1fr_1fr_220px]">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{optionIndex + 1}. Зүүн тал</Label>
              <Input placeholder={`Зүүн тал ${optionIndex + 1}`} value={pair.left} onChange={(event) => updateMatchingOptions(question, optionIndex, "left", event.target.value, onUpdateQuestion)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{String.fromCharCode(65 + optionIndex)}. Баруун тал</Label>
              <Input placeholder={`Баруун тал ${String.fromCharCode(65 + optionIndex)}`} value={pair.right} onChange={(event) => updateMatchingOptions(question, optionIndex, "right", event.target.value, onUpdateQuestion)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Зөв хослол</Label>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted text-sm font-semibold">
                  {optionIndex + 1}.
                </div>
                <Select value={currentValue} onValueChange={(value) => {
                  const next = [...answerSelection];
                  next[optionIndex] = value;
                  onUpdateQuestion(question.id, { correctAnswer: buildMatchingAnswer(next) });
                }}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Үсэг сонгох" /></SelectTrigger>
                  <SelectContent>
                    {options.map((_, rightIndex) => {
                      const letter = String.fromCharCode(65 + rightIndex);
                      if (usedValues.includes(letter) && currentValue !== letter) return null;
                      return <SelectItem key={letter} value={letter}>{letter}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderingEditor({ question, onUpdateOption, onUpdateQuestion }: EditorProps) {
  if (question.type !== "ordering" || !question.options) return null;
  const options = question.options;
  const answerSelection = parseOrderingAnswer(question.correctAnswer ?? "", options.length);

  return (
    <div className="space-y-3 rounded-xl border border-dashed p-4">
      <p className="text-sm text-muted-foreground">Доорх мөрүүдэд өгөгдлөө оруулна. Зөв дарааллыг байрлал бүрээр нь мөр сонгож тохируулна.</p>
      {options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">{optionIndex + 1}</div>
          <Input placeholder={`Мөр ${optionIndex + 1}`} value={option} onChange={(event) => onUpdateOption(question.id, optionIndex, event.target.value)} className="flex-1" />
        </div>
      ))}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Зөв дараалал</Label>
        <div className="space-y-3">
          {options.map((_, positionIndex) => {
            const currentValue = answerSelection[positionIndex];
            const usedValues = answerSelection.filter((value, index) => value && index !== positionIndex);
            return (
              <div key={positionIndex} className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted text-sm font-semibold">
                  {positionIndex + 1}.
                </div>
                <Select
                  value={currentValue}
                  onValueChange={(value) => {
                    const next = [...answerSelection];
                    next[positionIndex] = value;
                    onUpdateQuestion(question.id, { correctAnswer: buildOrderingAnswer(next) });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Мөр сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((__, optionIndex) => {
                      const rowValue = String(optionIndex + 1);
                      if (usedValues.includes(rowValue) && currentValue !== rowValue) return null;
                      return <SelectItem key={rowValue} value={rowValue}>{`Мөр ${rowValue}`}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
