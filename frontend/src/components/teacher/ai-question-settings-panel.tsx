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
          <Label>ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ Ñ‚Ó©Ñ€Ó©Ð»</Label>
          <div className="space-y-2">
            <QuestionTypeCounter
              label="Ð¡Ð¾Ð½Ð³Ð¾Ñ… Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‚Ð°Ð¹"
              value={aiMCCount}
              onChange={onAiMCCountChange}
            />
            <QuestionTypeCounter
              label="Ò®Ð½ÑÐ½/Ð¥ÑƒÐ´Ð°Ð»"
              value={aiTFCount}
              onChange={onAiTFCountChange}
            />
            <QuestionTypeCounter
              label="Ð‘Ð¾Ð³Ð¸Ð½Ð¾ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚"
              value={aiShortCount}
              onChange={onAiShortCountChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ Ñ‚Ð¾Ð¾</Label>
          <div className="flex h-9 items-center rounded-md border bg-muted px-3">
            {totalQuestions}
          </div>

          <Label>Ð¥ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€Ñ‹Ð½ Ñ‚Ð¾Ð¾</Label>
          <Select
            value={variants.toString()}
            onValueChange={(value) => onVariantsChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Ñ…ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€</SelectItem>
              <SelectItem value="2">2 Ñ…ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€</SelectItem>
              <SelectItem value="3">3 Ñ…ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€</SelectItem>
              <SelectItem value="4">4 Ñ…ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€</SelectItem>
            </SelectContent>
          </Select>

          <Label>Ð¢Ò¯Ð²ÑˆÐ¸Ð½</Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Ð¥Ó©Ð½Ð³Ó©Ð½</SelectItem>
              <SelectItem value="standard">Ð”ÑƒÐ½Ð´</SelectItem>
              <SelectItem value="hard">Ð¥ÑÑ†Ò¯Ò¯</SelectItem>
            </SelectContent>
          </Select>

          <Label>ÐÐ½Ð³Ð¸Ð»Ð°Ð»</Label>
          <Input
            placeholder="Ð–Ð¸ÑˆÑÑ: ÐœÐ°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸Ðº"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between text-sm">
          <span>ÐÐ¸Ð¹Ñ‚ Ð°ÑÑƒÑƒÐ»Ñ‚:</span>
          <span className="font-medium">
            {finalQuestionCount} ({totalQuestions} Ã— {variants} Ñ…ÑƒÐ²Ð¸Ð»Ð±Ð°Ñ€)
          </span>
        </div>
      </div>
    </>
  );
}
