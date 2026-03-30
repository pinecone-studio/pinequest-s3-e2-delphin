"use client";

import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  QuestionBankCategory,
  QuestionBankDifficulty,
} from "@/lib/question-bank-api";
import { Sparkles } from "lucide-react";

export const CREATE_CATEGORY_OPTION = "__create_new_category__";

type QuestionBankBuilderCardProps = {
  builderCategoryId: string;
  builderCategoryName: string;
  builderDifficulty: QuestionBankDifficulty;
  builderNewCategoryName: string;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  isCreatingCategory: boolean;
  isSaving: boolean;
  onAddQuestion: (type: QuestionType) => void;
  onBuilderCategoryNameChange: (value: string) => void;
  onBuilderDifficultyChange: (value: QuestionBankDifficulty) => void;
  onBuilderTopicNameChange: (value: string) => void;
  onCancel: () => void;
  onCategorySelect: (value: string) => void;
  onCreateCategory: () => void;
  onOpenAIDialog: () => void;
  onRemoveQuestion: (id: string) => void;
  onSave: () => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  questionBank: QuestionBankCategory[];
};

export function QuestionBankBuilderCard({
  builderCategoryId,
  builderCategoryName,
  builderDifficulty,
  builderNewCategoryName,
  builderQuestions,
  builderTopicName,
  isCreatingCategory,
  isSaving,
  onAddQuestion,
  onBuilderCategoryNameChange,
  onBuilderDifficultyChange,
  onBuilderTopicNameChange,
  onCancel,
  onCategorySelect,
  onCreateCategory,
  onOpenAIDialog,
  onRemoveQuestion,
  onSave,
  onUpdateOption,
  onUpdateQuestion,
  questionBank,
}: QuestionBankBuilderCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Ð¨Ð¸Ð½Ñ Ð°ÑÑƒÑƒÐ»Ñ‚ÑƒÑƒÐ´ Ò¯Ò¯ÑÐ³ÑÑ…</CardTitle>
        <p className="text-sm text-muted-foreground">
          ÐÐ½Ð³Ð¸Ð»Ð°Ð», ÑÑÐ´Ð²ÑÑ ÑÐ¾Ð½Ð³Ð¾Ð¾Ð´ Ð°ÑÑƒÑƒÐ»Ñ‚Ð°Ð° Ð³Ð°Ñ€Ð°Ð°Ñ€ ÑÑÐ²ÑÐ» AI-Ð°Ð°Ñ€ Ð½ÑÐ¼Ð½Ñ.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>ÐÐ½Ð³Ð¸Ð»Ð°Ð»</Label>
            <Select
              value={builderCategoryId || CREATE_CATEGORY_OPTION}
              onValueChange={onCategorySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÐ¾Ð½Ð³Ð¾Ñ…" />
              </SelectTrigger>
              <SelectContent>
                {questionBank.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value={CREATE_CATEGORY_OPTION}>
                  + Ð¨Ð¸Ð½Ñ Ð°Ð½Ð³Ð¸Ð»Ð°Ð» Ò¯Ò¯ÑÐ³ÑÑ…
                </SelectItem>
              </SelectContent>
            </Select>
            {!builderCategoryId ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Ð¨Ð¸Ð½Ñ Ð°Ð½Ð³Ð¸Ð»Ð»Ñ‹Ð½ Ð½ÑÑ€"
                  value={builderNewCategoryName}
                  onChange={(event) => onBuilderCategoryNameChange(event.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={onCreateCategory}
                  disabled={isCreatingCategory}
                >
                  ÐÑÐ¼ÑÑ…
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Ð¡ÑÐ´ÑÐ²</Label>
            <Input
              placeholder="Ð–Ð¸ÑˆÑÑ: ÐÐ»Ð³ÐµÐ±Ñ€ 7 Ñ‚Ð¾Ð¼ÑŒÑ‘Ð¾"
              value={builderTopicName}
              onChange={(event) => onBuilderTopicNameChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ð¢Ò¯Ð²ÑˆÐ¸Ð½</Label>
            <Select value={builderDifficulty} onValueChange={onBuilderDifficultyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Ð¥Ó©Ð½Ð³Ó©Ð½</SelectItem>
                <SelectItem value="standard">Ð”ÑƒÐ½Ð´</SelectItem>
                <SelectItem value="hard">Ð¥ÑÑ†Ò¯Ò¯</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
          <div>
            <p className="font-medium">
              {builderCategoryName || "ÐÐ½Ð³Ð¸Ð»Ð»Ð°Ð° ÑÐ¾Ð½Ð³Ð¾Ð½Ð¾ ÑƒÑƒ"}
            </p>
            <p className="text-sm text-muted-foreground">
              Ð¡ÑÐ´ÑÐ² Ð´Ð¾Ñ‚Ð¾Ñ€Ñ… Ð°ÑÑƒÑƒÐ»Ñ‚ÑƒÑƒÐ´Ñ‹Ð³ ÑÐ½Ð´ Ð±ÑÐ»Ñ‚Ð³ÑÑÐ´ Ð´Ð°Ñ€Ð°Ð° Ð½ÑŒ Ð½ÑÐ³ Ð´Ð¾Ñ€
              Ñ…Ð°Ð´Ð³Ð°Ð»Ð½Ð°.
            </p>
          </div>
          <Button variant="secondary" onClick={onOpenAIDialog}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create question with AI
          </Button>
        </div>

        <ExamBuilderQuestionList
          onAddQuestion={onAddQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
          questions={builderQuestions}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Ð‘Ð¾Ð»Ð¸Ñ…
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Ð¥Ð°Ð´Ð³Ð°Ð»Ð¶ Ð±Ð°Ð¹Ð½Ð°..." : "ÐÑÑƒÑƒÐ»Ñ‚ÑƒÑƒÐ´Ñ‹Ð³ Ñ…Ð°Ð´Ð³Ð°Ð»Ð°Ñ…"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
