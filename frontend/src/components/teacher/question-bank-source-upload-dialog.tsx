"use client";

import { useId, useMemo, useState } from "react";
import { QuestionBankSourceUploadForm } from "@/components/teacher/question-bank-source-upload-form";
import { QuestionBankSourceUploadSummary } from "@/components/teacher/question-bank-source-upload-summary";
import { UNIT_OPTIONS } from "@/components/teacher/question-bank-source-shared";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  isUploading: boolean;
  newSourceName: string;
  onDemo: () => void | Promise<void>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
  selectedSourceFile: File | null;
};

export function QuestionBankSourceUploadDialog({
  isOpen,
  isUploading,
  newSourceName,
  onDemo,
  onFileSelect,
  onNameChange,
  onOpenChange,
  onUpload,
  selectedSourceFile,
}: Props) {
  const fileInputId = useId();
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [unit, setUnit] = useState("");
  const [topic, setTopic] = useState("");
  const availableTopics = useMemo(
    () => UNIT_OPTIONS.find((entry) => entry.value === unit)?.topics ?? [],
    [unit],
  );

  const resetFormState = () => {
    setSubject("");
    setGrade("");
    setUnit("");
    setTopic("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetFormState();
    }
    onOpenChange(open);
  };

  const handleUnitChange = (nextUnit: string) => {
    const nextTopics: readonly string[] =
      UNIT_OPTIONS.find((entry) => entry.value === nextUnit)?.topics ?? [];
    setUnit(nextUnit);
    if (!nextTopics.includes(topic)) {
      setTopic("");
    }
  };

  const handleDemo = async () => {
    onNameChange("Математик 7-р анги");
    setSubject("Математик");
    setGrade("7-р анги");
    setUnit("1-р бүлэг - Бүхэл тоо");
    setTopic("1.1 сэдэв - Нэмэх, хасах үйлдэл");
    await onDemo();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="h-[400px] w-[764px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[34px] border border-[#dbe6ff] bg-white p-0 shadow-[0_28px_72px_rgba(99,131,196,0.22)] sm:max-w-[764px]">
        <div className="grid h-full gap-4 overflow-hidden p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-0 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              <DialogTitle className="text-[24px] font-semibold tracking-[-0.03em] text-[#4b4f72]">
                Эх сурвалж бүртгэх
              </DialogTitle>
            </div>
            <QuestionBankSourceUploadForm
              availableTopics={availableTopics}
              fileInputId={fileInputId}
              grade={grade}
              newSourceName={newSourceName}
              onFileSelect={onFileSelect}
              onGradeChange={setGrade}
              onNameChange={onNameChange}
              onSubjectChange={setSubject}
              onTopicChange={setTopic}
              onUnitChange={handleUnitChange}
              selectedSourceFile={selectedSourceFile}
              subject={subject}
              topic={topic}
              unit={unit}
            />
          </div>

          <div className="relative flex min-h-0 pt-8">
            <QuestionBankSourceUploadSummary
              grade={grade}
              isUploading={isUploading}
              newSourceName={newSourceName}
              onUpload={onUpload}
              selectedSourceFile={selectedSourceFile}
              subject={subject}
              topic={topic}
              unit={unit}
            />
            <button
              type="button"
              onClick={() => void handleDemo()}
              className="absolute bottom-0 right-1 text-[12px] text-[#8b92ac] transition hover:text-[#4f5f87]"
            >
              Demo
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
