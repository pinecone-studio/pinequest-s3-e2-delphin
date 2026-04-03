"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AIQuestionTypeCounts } from "@/components/teacher/ai-question-generator-dialog-types";

type AIQuestionSettingsPanelProps = {
  difficulty: "easy" | "standard" | "hard";
  onDifficultyChange: (value: "easy" | "standard" | "hard") => void;
  onQuestionTypeCountChange: (
    type: keyof AIQuestionTypeCounts,
    value: number,
  ) => void;
  onTotalPointsChange: (value: number) => void;
  onVariantsChange: (value: number) => void;
  questionTypeCounts: AIQuestionTypeCounts;
  totalQuestionCount: number;
  totalPoints: number;
  variants: number;
};

const questionTypeOptions: Array<{
  key: keyof AIQuestionTypeCounts;
  label: string;
}> = [
  { key: "multipleChoice", label: "Сонгох хариулттай" },
  { key: "trueFalse", label: "Үнэн / худал" },
  { key: "matching", label: "Харгалзуулах" },
  { key: "shortAnswer", label: "Богино хариулт" },
];

export function AIQuestionSettingsPanel({
  difficulty,
  onDifficultyChange,
  onQuestionTypeCountChange,
  onTotalPointsChange,
  onVariantsChange,
  questionTypeCounts,
  totalQuestionCount,
  totalPoints,
  variants,
}: AIQuestionSettingsPanelProps) {
  const [totalPointsInput, setTotalPointsInput] = useState(
    totalPoints.toString(),
  );

  useEffect(() => {
    setTotalPointsInput(totalPoints.toString());
  }, [totalPoints]);

  const handleTypeCountInput = (
    key: keyof AIQuestionTypeCounts,
    nextValue: string,
  ) => {
    const parsedValue = Math.max(0, parseInt(nextValue) || 0);
    const currentValue = questionTypeCounts[key];
    const remainingAllowance = Math.max(
      0,
      totalPoints - (totalQuestionCount - currentValue),
    );
    onQuestionTypeCountChange(key, Math.min(parsedValue, remainingAllowance));
  };

  return (
    <div className="space-y-[5px]">
      <div className="grid w-[400px] max-w-full grid-cols-[190px_190px] gap-5">
        <div className="space-y-[5px]">
          <Label className="text-[14px] font-semibold text-[#4b4f72]">
            Нийт асуултын тоо
          </Label>
          <Input
            min="0"
            type="number"
            value={totalPointsInput}
            onChange={(event) => {
              const nextValue = event.target.value;
              setTotalPointsInput(nextValue);
              if (nextValue !== "")
                onTotalPointsChange(parseInt(nextValue) || 0);
            }}
            onBlur={() => {
              if (totalPointsInput === "") {
                setTotalPointsInput("0");
                onTotalPointsChange(0);
              }
            }}
            onFocus={(event) => {
              if (event.currentTarget.value === "0")
                event.currentTarget.select();
            }}
            className="h-[36px] rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]"
          />
        </div>

        <div className="space-y-[5px]">
          <Label className="text-[14px] font-semibold text-[#4b4f72]">
            Түвшин
          </Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="h-[36px] w-[190px] rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Хөнгөн</SelectItem>
              <SelectItem value="standard">Дунд</SelectItem>
              <SelectItem value="hard">Хүнд</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-[5px]">
        <Label className="text-[16px] pt-2 font-semibold text-[#4b4f72]">
          Асуултын төрөл
        </Label>
        <div className="grid gap-[5px] md:grid-cols-2">
          {questionTypeOptions.map((option) => (
            <div key={option.key} className="space-y-[5px]">
              <Label className="text-[14px] text-[#4b4f72]">
                {option.label}
              </Label>
              <Input
                type="number"
                min="0"
                value={questionTypeCounts[option.key]}
                onChange={(event) =>
                  handleTypeCountInput(option.key, event.target.value)
                }
                className="h-[36px] rounded-[12px] border-[#dce7ff] bg-white text-[14px]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-[5px]">
        <Label className="text-[16px] pt-2 font-semibold text-[#4b4f72]">
          Хувилбар
        </Label>
        <Select
          value={variants.toString()}
          onValueChange={(value) => onVariantsChange(parseInt(value))}
        >
          <SelectTrigger className="h-[36px] rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 хувилбар</SelectItem>
            <SelectItem value="2">2 хувилбар</SelectItem>
            <SelectItem value="3">3 хувилбар</SelectItem>
            <SelectItem value="4">4 хувилбар</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
