"use client";

import { AIQuestionSettingsPanel } from "@/components/teacher/ai-question-settings-panel";
import { AIQuestionSourceSelector } from "@/components/teacher/ai-question-source-selector";
import { type QuestionGeneratorPayload } from "@/components/teacher/ai-question-generator-dialog-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alignAIQuestionCounts } from "@/hooks/ai-question-builder";
import { useAiQuestionGeneratorCard } from "@/hooks/use-ai-question-generator-card";
import type { UploadRecord } from "@/lib/uploads-api";
import { cn } from "@/lib/utils";

type Props = {
  availableSourceFiles: UploadRecord[];
  className?: string;
  isGenerating: boolean;
  onGenerate: (payload: QuestionGeneratorPayload) => void | Promise<void>;
  onToggleTest: (testId: string, checked: boolean) => void;
  selectedMockTests: string[];
};

export function AIQuestionGeneratorCard({
  availableSourceFiles,
  className,
  isGenerating,
  onGenerate,
  onToggleTest,
  selectedMockTests,
}: Props) {
  const card = useAiQuestionGeneratorCard(selectedMockTests);
  const handleDemo = () => {
    const firstSourceId = availableSourceFiles[0]?.id;
    if (firstSourceId) {
      selectedMockTests.forEach((id) => {
        if (id !== firstSourceId) onToggleTest(id, false);
      });
      onToggleTest(firstSourceId, true);
    }
    card.applyDemoPreset();
  };
  const handleGenerate = () =>
    void onGenerate({
      difficulty: card.difficulty,
      questionTypeCounts: alignAIQuestionCounts(
        card.questionTypeCounts,
        card.totalPoints,
      ),
      totalQuestionTarget: card.totalPoints,
      selectedMockTests,
      sourceFilesWithPages: card.sourceFilesWithPages,
      variants: card.variants,
    });

  return (
    <Card
      className={cn(
        "h-[806px] w-[440px] rounded-[32px] border border-[#DDE7FF] bg-white shadow-[0_20px_48px_rgba(168,196,235,0.16)]",
        className,
      )}
    >
      <CardHeader className="space-y-[5px] p-0 px-5 pb-[5px] pt-0">
        <CardTitle className="text-[24px] font-semibold tracking-[-0.02em] pt-2 text-[#4b4f72]">
          AI асуулт үүсгэх
        </CardTitle>
        <p className="text-[16px] text-[#4b4f72]">Эх сурвалж сонгох</p>
      </CardHeader>

      <CardContent className="flex h-[calc(100%-89px)] flex-col gap-[5px] p-0 px-5 pb-5 pt-0">
        <AIQuestionSourceSelector
          availableSourceFiles={availableSourceFiles}
          isBuilderDialog={false}
          isDragging={card.isDragging}
          onDragEnter={card.handleDragOver}
          onDragLeave={card.handleDragLeave}
          onDragOver={card.handleDragOver}
          onDrop={card.handleDrop}
          onFileSelect={card.handleFileSelect}
          onRemoveBuilderFile={() => {}}
          onRemoveLocalFile={card.removeSourceFile}
          onToggleTest={onToggleTest}
          onUpdatePageRange={card.updatePageRange}
          selectedBuilderFiles={[]}
          selectedMockTests={selectedMockTests}
          sourceFilesWithPages={card.sourceFilesWithPages}
        />

        <AIQuestionSettingsPanel
          difficulty={card.difficulty}
          onDifficultyChange={card.setDifficulty}
          onQuestionTypeCountChange={card.updateQuestionTypeCount}
          onTotalPointsChange={card.setTotalPoints}
          onVariantsChange={card.setVariants}
          questionTypeCounts={card.questionTypeCounts}
          totalQuestionCount={card.totalQuestionCount}
          totalPoints={card.totalPoints}
          variants={card.variants}
        />

        <div className="mt-auto flex items-center justify-end gap-2">
          <Button
            className="h-[38px] rounded-[14px] border border-[#dce7ff] bg-white px-4 text-[12px] font-medium text-[#5f6b8a] shadow-none hover:bg-[#f6f9ff]"
            onClick={handleDemo}
            type="button"
            variant="outline"
          >
            Demo
          </Button>
          <Button
            className="h-[38px] w-[153px] rounded-[14px] bg-[#315df3] px-4 text-[12px] font-medium text-white shadow-[0_12px_24px_rgba(49,93,243,0.24)] hover:bg-[#254fe4]"
            disabled={
              isGenerating || !card.hasSource || card.totalQuestionCount === 0
            }
            onClick={handleGenerate}
          >
            {isGenerating ? "Бэлтгэж байна..." : "AI Асуулт бэлтгэх"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
