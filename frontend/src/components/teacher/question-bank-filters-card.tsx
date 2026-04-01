"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { Search } from "lucide-react";

export const CREATE_CATEGORY_FILTER_VALUE = "__create_category__";

type QuestionBankFiltersCardProps = {
  onSearchQueryChange: (value: string) => void;
  onSelectedCategoryFilterChange: (value: string) => void;
  onSelectedDifficultyChange: (value: string) => void;
  questionBank: QuestionBankCategory[];
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty: string;
};

export function QuestionBankFiltersCard({
  onSearchQueryChange,
  onSelectedCategoryFilterChange,
  onSelectedDifficultyChange,
  questionBank,
  searchQuery,
  selectedCategoryFilter,
  selectedDifficulty,
}: QuestionBankFiltersCardProps) {
  return (
    <Card className="rounded-[28px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,250,255,0.92)_100%)] shadow-[0_20px_60px_rgba(177,198,232,0.14)]">
      <CardContent className="space-y-3 p-5 sm:p-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#303959]">
            Асуултаа шүүх
          </h2>
          <p className="text-sm text-[#6f7898]">
            Ангилал, түвшин, түлхүүр үгээрээ хурдан хайж хараарай.
          </p>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8090b2]" />
              <Input
                className="h-11 rounded-2xl border-[#e2eafc] bg-white pl-11"
                placeholder="Асуулт хайх..."
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
              />
            </div>
          </div>

          <Select
            value={selectedCategoryFilter}
            onValueChange={onSelectedCategoryFilterChange}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-[#e2eafc] bg-white xl:w-44">
              <SelectValue placeholder="Ангилал сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх ангилал</SelectItem>
              {questionBank.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
              <SelectItem value={CREATE_CATEGORY_FILTER_VALUE}>
                + Шинэ ангилал нэмэх
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={onSelectedDifficultyChange}>
            <SelectTrigger className="h-11 w-full rounded-2xl border-[#e2eafc] bg-white xl:w-40">
              <SelectValue placeholder="Түвшин сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх түвшин</SelectItem>
              <SelectItem value="easy">Хөнгөн</SelectItem>
              <SelectItem value="standard">Дунд</SelectItem>
              <SelectItem value="hard">Хэцүү</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
