"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SelectedQuestionEntry } from "@/hooks/use-exam-question-selection";

type CreateExamSelectedQuestionsPanelProps = {
  onMoveQuestion: (questionId: string, direction: "up" | "down") => void;
  onRemoveQuestion: (questionId: string) => void;
  selectedQuestions: SelectedQuestionEntry[];
};

export function CreateExamSelectedQuestionsPanel({
  onMoveQuestion,
  onRemoveQuestion,
  selectedQuestions,
}: CreateExamSelectedQuestionsPanelProps) {
  return (
    <div className="rounded-[24px] border border-[#e3ebfd] bg-[#fbfcff]">
      <div className="border-b px-5 py-4">
        <h3 className="text-lg font-semibold text-[#303959]">Сонгосон асуултууд</h3>
        <p className="mt-1 text-sm text-[#6f7898]">
          Эндээс дарааллаа өөрчилнө. Чагталсан асуултууд доорх жагсаалтад шууд орно.
        </p>
      </div>

      <ScrollArea className="h-[520px] px-5 py-4">
        {selectedQuestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d7e3ff] bg-white px-5 py-8 text-center text-sm text-[#6f7898]">
            Асуулт сонгоогүй байна. Зүүн талын сэдвийг нээгээд асуултуудаа чагтална
            уу.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedQuestions.map(({ categoryName, question, topicName }, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-[#e3ebfd] bg-white p-4 shadow-[0_8px_24px_rgba(177,198,232,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#303959]">
                      {index + 1}. {question.question}
                    </div>
                    <div className="mt-2 text-xs text-[#6f7898]">
                      {categoryName} · {topicName} · {question.points} оноо
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveQuestion(question.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveQuestion(question.id, "down")}
                      disabled={index === selectedQuestions.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
