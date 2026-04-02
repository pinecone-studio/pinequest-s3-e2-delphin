"use client";

import { useEffect, useId, useState } from "react";
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
  const availableTopics: readonly string[] =
    UNIT_OPTIONS.find((entry) => entry.value === unit)?.topics ?? [];

  useEffect(() => {
    if (isOpen) return;
    setSubject("");
    setGrade("");
    setUnit("");
    setTopic("");
  }, [isOpen]);

  useEffect(() => {
    if (!unit) {
      setTopic("");
      return;
    }

    if (topic && !availableTopics.includes(topic)) {
      setTopic("");
    }
  }, [availableTopics, topic, unit]);

  const handleDemo = async () => {
    onNameChange("Математик 7-р анги");
    setSubject("Математик");
    setGrade("7-р анги");
    setUnit("1-р бүлэг - Бүхэл тоо");
    setTopic("1.1 сэдэв - Нэмэх, хасах үйлдэл");
    await onDemo();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] border border-[#dbe6ff] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-0 shadow-[0_24px_60px_rgba(99,131,196,0.18)] sm:max-w-4xl">
        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.85fr)] lg:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-[-0.02em] text-[#4b4f72] sm:text-[2rem]">
                Эх сурвалж бүртгэх
              </DialogTitle>
              <p className="max-w-2xl text-sm leading-5 text-[#7b81a2]">
                Эх сурвалжийн мэдээллээ оруулаад PDF файлаар нь асуултын сандаа
                бүртгэнэ.
              </p>
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
              onUnitChange={setUnit}
              selectedSourceFile={selectedSourceFile}
              subject={subject}
              topic={topic}
              unit={unit}
            />
          </div>

          <div className="flex">
            <QuestionBankSourceUploadSummary
              grade={grade}
              isUploading={isUploading}
              newSourceName={newSourceName}
              onCancel={() => onOpenChange(false)}
              onDemo={() => void handleDemo()}
              onUpload={onUpload}
              selectedSourceFile={selectedSourceFile}
              subject={subject}
              topic={topic}
              unit={unit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
