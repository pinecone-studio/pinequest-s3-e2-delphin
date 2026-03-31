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
        <CardTitle>Шинэ асуултууд үүсгэх</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ангилал, сэдвээ сонгоод асуултаа гараар эсвэл AI-аар нэмнэ.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Ангилал</Label>
            <Select
              value={builderCategoryId || CREATE_CATEGORY_OPTION}
              onValueChange={onCategorySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                {questionBank.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value={CREATE_CATEGORY_OPTION}>
                  + Шинэ ангилал үүсгэх
                </SelectItem>
              </SelectContent>
            </Select>
            {!builderCategoryId ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Шинэ ангиллын нэр"
                  value={builderNewCategoryName}
                  onChange={(event) => onBuilderCategoryNameChange(event.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={onCreateCategory}
                  disabled={isCreatingCategory}
                >
                  Нэмэх
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Сэдэв</Label>
            <Input
              placeholder="Жишээ: Алгебр 7 томьёо"
              value={builderTopicName}
              onChange={(event) => onBuilderTopicNameChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Түвшин</Label>
            <Select value={builderDifficulty} onValueChange={onBuilderDifficultyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Хөнгөн</SelectItem>
                <SelectItem value="standard">Дунд</SelectItem>
                <SelectItem value="hard">Хэцүү</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
          <div>
            <p className="font-medium">
              {builderCategoryName || "Ангиллаа сонгоно уу"}
            </p>
            <p className="text-sm text-muted-foreground">
              Сэдэв доторх асуултуудыг энд бэлтгээд дараа нь нэг дор
              хадгална.
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
            Болих
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Хадгалж байна..." : "Асуултуудыг хадгалах"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
