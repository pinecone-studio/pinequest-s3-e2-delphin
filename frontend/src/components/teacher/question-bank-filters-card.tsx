"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { Search } from "lucide-react";

type QuestionBankFiltersCardProps = {
  isCreatingCategory: boolean;
  newCategoryName: string;
  onCreateCategory: () => void;
  onNewCategoryNameChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSelectedCategoryFilterChange: (value: string) => void;
  onSelectedDifficultyChange: (value: string) => void;
  questionBank: QuestionBankCategory[];
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty: string;
};

export function QuestionBankFiltersCard({
  isCreatingCategory,
  newCategoryName,
  onCreateCategory,
  onNewCategoryNameChange,
  onSearchQueryChange,
  onSelectedCategoryFilterChange,
  onSelectedDifficultyChange,
  questionBank,
  searchQuery,
  selectedCategoryFilter,
  selectedDifficulty,
}: QuestionBankFiltersCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="ÐÑÑƒÑƒÐ»Ñ‚ Ñ…Ð°Ð¹Ñ…..."
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
              />
            </div>
          </div>

          <Select
            value={selectedCategoryFilter}
            onValueChange={onSelectedCategoryFilterChange}
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÐ¾Ð½Ð³Ð¾Ñ…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ð‘Ò¯Ñ… Ð°Ð½Ð³Ð¸Ð»Ð°Ð»</SelectItem>
              {questionBank.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={onSelectedDifficultyChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ð¢Ò¯Ð²ÑˆÐ¸Ð½ ÑÐ¾Ð½Ð³Ð¾Ñ…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ð‘Ò¯Ñ… Ñ‚Ò¯Ð²ÑˆÐ¸Ð½</SelectItem>
              <SelectItem value="easy">Ð¥Ó©Ð½Ð³Ó©Ð½</SelectItem>
              <SelectItem value="standard">Ð”ÑƒÐ½Ð´</SelectItem>
              <SelectItem value="hard">Ð¥ÑÑ†Ò¯Ò¯</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <Label>Ð¨Ð¸Ð½Ñ Ð°Ð½Ð³Ð¸Ð»Ð°Ð»</Label>
            <Input
              placeholder="Ð–Ð¸ÑˆÑÑ: ÐœÐ°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸Ðº"
              value={newCategoryName}
              onChange={(event) => onNewCategoryNameChange(event.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            onClick={onCreateCategory}
            disabled={isCreatingCategory}
          >
            Create new category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
