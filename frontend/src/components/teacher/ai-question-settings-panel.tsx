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

type AIQuestionSettingsPanelProps = {
  aiMCCount: number;
  aiShortCount: number;
  aiTFCount: number;
  category: string;
  difficulty: "easy" | "standard" | "hard";
  finalQuestionCount: number;
  onAiMCCountChange: (value: number) => void;
  onAiShortCountChange: (value: number) => void;
  onAiTFCountChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: "easy" | "standard" | "hard") => void;
  onVariantsChange: (value: number) => void;
  totalQuestions: number;
  variants: number;
};

function QuestionTypeCounter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(parseInt(event.target.value) || 0)}
        className="h-8 w-20"
      />
    </div>
  );
}

export function AIQuestionSettingsPanel({
  aiMCCount,
  aiShortCount,
  aiTFCount,
  category,
  difficulty,
  finalQuestionCount,
  onAiMCCountChange,
  onAiShortCountChange,
  onAiTFCountChange,
  onCategoryChange,
  onDifficultyChange,
  onVariantsChange,
  totalQuestions,
  variants,
}: AIQuestionSettingsPanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Асуултын төрөл</Label>
          <div className="space-y-2">
            <QuestionTypeCounter
              label="Сонгох хариулттай"
              value={aiMCCount}
              onChange={onAiMCCountChange}
            />
            <QuestionTypeCounter
              label="Үнэн/Худал"
              value={aiTFCount}
              onChange={onAiTFCountChange}
            />
            <QuestionTypeCounter
              label="Богино хариулт"
              value={aiShortCount}
              onChange={onAiShortCountChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Асуултын тоо</Label>
          <div className="flex h-9 items-center rounded-md border bg-muted px-3">
            {totalQuestions}
          </div>

          <Label>Хувилбарын тоо</Label>
          <Select
            value={variants.toString()}
            onValueChange={(value) => onVariantsChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 хувилбар</SelectItem>
              <SelectItem value="2">2 хувилбар</SelectItem>
              <SelectItem value="3">3 хувилбар</SelectItem>
              <SelectItem value="4">4 хувилбар</SelectItem>
            </SelectContent>
          </Select>

          <Label>Түвшин</Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Хөнгөн</SelectItem>
              <SelectItem value="standard">Дунд</SelectItem>
              <SelectItem value="hard">Хэцүү</SelectItem>
            </SelectContent>
          </Select>

          <Label>Ангилал</Label>
          <Input
            placeholder="Жишээ: Математик"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between text-sm">
          <span>Нийт асуулт:</span>
          <span className="font-medium">
            {finalQuestionCount} ({totalQuestions} × {variants} хувилбар)
          </span>
        </div>
      </div>
    </>
  );
}
