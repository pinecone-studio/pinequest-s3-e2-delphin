"use client";

import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { CREATE_CATEGORY_OPTION } from "@/components/teacher/question-bank-builder-card";
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
  NewQuestion,
  QuestionType,
} from "@/components/teacher/exam-builder-types";
import type { QuestionBankCategory } from "@/lib/question-bank-api";

type Props = {
  builderCategoryId: string;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  onAddQuestion: (type: QuestionType) => void;
  onCategoryChange: (value: string) => void;
  onCreateCategory: () => void;
  onRemoveQuestion: (id: string) => void;
  onTopicNameChange: (value: string) => void;
  onUpdateOption: (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  questionBank: QuestionBankCategory[];
};

export function QuestionBankCreateBuilderCard({
  builderCategoryId,
  builderQuestions,
  builderTopicName,
  onAddQuestion,
  onCategoryChange,
  onCreateCategory,
  onRemoveQuestion,
  onTopicNameChange,
  onUpdateOption,
  onUpdateQuestion,
  questionBank,
}: Props) {
  return (
    <section className="space-y-5">
      <div className="text-[24px] font-semibold text-[#4b4f72]">
        Шинэ асуулт үүсгэх
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="topic-name">Сэдэв</Label>
          <Input
            id="topic-name"
            placeholder="Жишээ: Алгебр 7 томьёо"
            value={builderTopicName}
            onChange={(event) => onTopicNameChange(event.target.value)}
            className="h-12 rounded-[14px] border-[#dce7ff] bg-white text-base"
          />
        </div>
        <div className="space-y-2">
          <Label>Ангилал</Label>
          <Select
            value={builderCategoryId}
            onValueChange={(value) =>
              value === CREATE_CATEGORY_OPTION
                ? onCreateCategory()
                : onCategoryChange(value)
            }
          >
            <SelectTrigger className="h-12 rounded-[14px] border-[#dce7ff] bg-white">
              <SelectValue placeholder="Ангилал сонгоно уу" />
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
        </div>
      </div>
      <ExamBuilderQuestionList
        onAddQuestion={onAddQuestion}
        onRemoveQuestion={onRemoveQuestion}
        onUpdateOption={onUpdateOption}
        onUpdateQuestion={onUpdateQuestion}
        questions={builderQuestions}
      />
    </section>
  );
}
