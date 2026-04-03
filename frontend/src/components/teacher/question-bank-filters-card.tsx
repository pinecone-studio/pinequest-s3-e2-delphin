"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { Search } from "lucide-react";

export const CREATE_CATEGORY_FILTER_VALUE = "__create_category__";

type QuestionBankFiltersCardProps = {
  embedded?: boolean;
  onSearchQueryChange: (value: string) => void;
  onSelectedCategoryFilterChange: (value: string) => void;
  onSelectedDifficultyChange?: (value: string) => void;
  questionBank: QuestionBankCategory[];
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty?: string;
};

export function QuestionBankFiltersCard({
  embedded = false,
  onSearchQueryChange,
  onSelectedCategoryFilterChange,
  questionBank,
  searchQuery,
  selectedCategoryFilter,
}: QuestionBankFiltersCardProps) {
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  const selectedCategoryName =
    selectedCategoryFilter === "all"
      ? ""
      : questionBank.find((category) => category.id === selectedCategoryFilter)?.name ?? "";

  useEffect(() => {
    setCategoryInputValue(selectedCategoryName);
  }, [selectedCategoryName]);

  const filteredCategories = useMemo(() => {
    const keyword = categoryInputValue.trim().toLowerCase();
    if (!keyword) return questionBank;
    return questionBank.filter((category) =>
      category.name.toLowerCase().includes(keyword),
    );
  }, [categoryInputValue, questionBank]);

  const handleCategoryInputChange = (value: string) => {
    setCategoryInputValue(value);
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      onSelectedCategoryFilterChange("all");
      return;
    }

    const matchedCategory = questionBank.find(
      (category) => category.name.toLowerCase() === trimmedValue.toLowerCase(),
    );
    onSelectedCategoryFilterChange(matchedCategory?.id ?? "all");
  };

  const handleCategorySelect = (category: QuestionBankCategory) => {
    setCategoryInputValue(category.name);
    onSelectedCategoryFilterChange(category.id);
    setIsCategoryFocused(false);
  };

  const content = (
    <CardContent className={embedded ? "space-y-3 p-0" : "space-y-3 p-5 sm:p-5"}>
      {!embedded ? (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#303959]">
            Асуултаа шүүх
          </h2>
          <p className="text-sm text-[#6f7898]">
            Ангилал, түвшин, түлхүүр үгээрээ хурдан хайж хараарай.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col items-start gap-3 xl:flex-row xl:items-center">
        <div className="w-[635px] max-w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8090b2]" />
            <Input
              className="h-[48px] min-h-[48px] rounded-2xl border-[#e2eafc] bg-white py-0 pl-11"
              placeholder="Асуулт хайх..."
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
            />
          </div>
        </div>

        <div className="relative w-[207px] max-w-full">
          <Image
            src="/Leading-icon.svg"
            alt=""
            width={20}
            height={20}
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2"
          />
          <Input
            list="question-bank-category-options"
            className="h-[48px] min-h-[48px] rounded-2xl border-[#e2eafc] bg-white py-0 pl-11 pr-4 text-[#6f7898]"
            placeholder="Ангилал"
            value={categoryInputValue}
            onChange={(event) => handleCategoryInputChange(event.target.value)}
            onBlur={() => setTimeout(() => setIsCategoryFocused(false), 120)}
            onFocus={() => setIsCategoryFocused(true)}
          />
          {isCategoryFocused ? (
            <div className="absolute left-0 right-0 top-[54px] z-20 overflow-hidden rounded-[18px] border border-[#e2eafc] bg-white shadow-[0_14px_32px_rgba(168,196,235,0.16)]">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-[14px] text-[#4c4c66] transition-colors hover:bg-[#f7fbff]"
                    onMouseDown={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[14px] text-[#8b93ad]">
                  Тохирох бүлэг олдсонгүй
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </CardContent>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card className="rounded-[28px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,250,255,0.92)_100%)] shadow-[0_20px_60px_rgba(177,198,232,0.14)]">
      {content}
    </Card>
  );
}
