"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { classes } from "@/lib/mock-data";

export default function CreateExamPage() {
  const router = useRouter();
  const {
    addQuestion,
    addScheduleEntry,
    aiMCCount,
    aiShortCount,
    aiTFCount,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    practiceMaterials,
    questionCounts,
    questions,
    removeQuestion,
    removeScheduleEntry,
    scheduleEntries,
    selectedMaterialIds,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
    setDuration,
    setExamTitle,
    setSelectedMaterialIds,
    setShowAIDialog,
    showAIDialog,
    totalPoints,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = useExamBuilder();

  const handleSubmit = () => {
    console.log({
      title: examTitle,
      questions,
      duration,
      scheduleEntries,
    });
    alert("Exam created successfully! Students will be notified.");
    router.push("/teacher/exams");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Exams
          </Link>
          <h1 className="text-2xl font-bold mt-2">Create New Exam</h1>
        </div>
        <Button onClick={() => setShowAIDialog(true)}>
          Prepare Questions with AI
        </Button>
      </div>

      {/* Exam Title */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Untitled Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
          />
        </CardContent>
      </Card>
      <ExamBuilderQuestionList
        questions={questions}
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateOption={updateOption}
        onUpdateQuestion={updateQuestion}
      />
      <ExamBuilderSummaryCard
        classes={classes}
        duration={duration}
        onAddScheduleEntry={addScheduleEntry}
        onDurationChange={setDuration}
        onRemoveScheduleEntry={removeScheduleEntry}
        onUpdateScheduleEntry={updateScheduleEntry}
        questionCounts={questionCounts}
        scheduleEntries={scheduleEntries}
        totalPoints={totalPoints}
        totalQuestions={questions.length}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/teacher/exams")}>
          Save as Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!examTitle || questions.length === 0 || scheduleEntries.length === 0}
        >
          Create & Notify Students
        </Button>
      </div>
      <AiQuestionGeneratorDialog
        isGenerating={isGenerating}
        materialOptions={practiceMaterials}
        mcCount={aiMCCount}
        onGenerate={generateAIQuestions}
        onMcCountChange={setAiMCCount}
        onOpenChange={setShowAIDialog}
        onSelectedMaterialIdsChange={setSelectedMaterialIds}
        onShortCountChange={setAiShortCount}
        onTfCountChange={setAiTFCount}
        open={showAIDialog}
        selectedMaterialIds={selectedMaterialIds}
        shortCount={aiShortCount}
        tfCount={aiTFCount}
      />
    </div>
  );
}
