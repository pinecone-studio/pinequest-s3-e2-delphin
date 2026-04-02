"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ExamQuestion } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const matchingSeparator = "|||";

function getMatchingPairs(question: ExamQuestion) {
  return (question.options ?? []).map((option, index) => {
    const [left = "", right = ""] = option.split(matchingSeparator);
    return { left, leftLabel: `${index + 1}`, right, rightLabel: String.fromCharCode(65 + index) };
  });
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
  return selection.map((item, index) => `${index + 1}-${item}`).join(",");
}

export function MatchingQuestionContent(props: {
  question: ExamQuestion;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { question, value, onAnswerChange } = props;
  const [selectedLetter, setSelectedLetter] = useState("");
  const matchingPairs = getMatchingPairs(question);
  const assignedLetters = parseMatchingAnswer(value, matchingPairs.length);
  const availableLetters = matchingPairs.map((pair) => pair.rightLabel).filter((letter) => !assignedLetters.includes(letter));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-[#E6F2FF] bg-[#FCFCFF] p-4">
          <p className="text-sm font-semibold text-[#293138]">Зүүн тал</p>
          <div className="mt-3 space-y-2 text-sm text-[#6F7982]">
            {matchingPairs.map((pair, index) => (
              <button
                key={`${question.id}-slot-${pair.leftLabel}`}
                type="button"
                onClick={() => {
                  if (selectedLetter) {
                    const next = [...assignedLetters];
                    const existingIndex = next.findIndex((item) => item === selectedLetter);
                    if (existingIndex >= 0) next[existingIndex] = "";
                    next[index] = selectedLetter;
                    setSelectedLetter("");
                    onAnswerChange(question.id, buildMatchingAnswer(next));
                    return;
                  }
                  if (!assignedLetters[index]) return;
                  const next = [...assignedLetters];
                  next[index] = "";
                  onAnswerChange(question.id, buildMatchingAnswer(next.filter(Boolean).length ? next : []));
                }}
                className={cn("flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left", assignedLetters[index] ? "border-[#66B2FF] bg-[#F5FAFF]" : "border-[#E1E6EB] bg-white")}
              >
                <span>{pair.leftLabel}. {pair.left}</span>
                <span className="rounded-md bg-[#E6F2FF] px-2 py-1 text-xs font-semibold text-[#007FFF]">{assignedLetters[index] || "Сонгоогүй"}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-[#E6F2FF] bg-[#FCFCFF] p-4">
          <p className="text-sm font-semibold text-[#293138]">Баруун тал</p>
          <div className="mt-3 space-y-2 text-sm text-[#6F7982]">
            {matchingPairs.map((pair) => (
              <div key={`${question.id}-right-${pair.rightLabel}`} className="rounded-xl border border-[#E1E6EB] bg-white px-3 py-3">
                {pair.rightLabel}. {pair.right}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[#293138]">Үсгээ сонгоод тохирох мөр дээр дарна уу</Label>
        <div className="flex flex-wrap gap-2">
          {availableLetters.map((letter) => (
            <Button key={letter} type="button" variant={selectedLetter === letter ? "default" : "outline"} onClick={() => setSelectedLetter((current) => current === letter ? "" : letter)}>
              {letter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

