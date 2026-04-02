"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";

const SUBJECT_OPTIONS = ["Математик", "Монгол хэл", "Физик"] as const;
const GRADE_OPTIONS = ["6-р анги", "7-р анги", "8-р анги"] as const;
const UNIT_OPTIONS = [
  {
    value: "1-р бүлэг - Бүхэл тоо",
    topics: [
      "1.1 сэдэв - Нэмэх, хасах үйлдэл",
      "1.2 сэдэв - Үржих, хуваах үйлдэл",
    ],
  },
  {
    value: "2-р бүлэг - Бутархай",
    topics: [
      "2.1 сэдэв - Бутархай нэмэх, хасах",
      "2.2 сэдэв - Бутархай үржих, хуваах",
    ],
  },
] as const;

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

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${parseFloat((bytes / 1024 ** unit).toFixed(2))} ${sizes[unit]}`;
}

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

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#5a5f80]"
                htmlFor="source-name"
              >
                Эх сурвалжийн нэр
              </label>
              <Input
                id="source-name"
                placeholder="Жишээ: Математик 7-р анги"
                value={newSourceName}
                onChange={(event) => onNameChange(event.target.value)}
                className="h-11 rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none placeholder:text-[#b3bacf] focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5a5f80]">
                  Хичээл
                </label>
                <Select
                  value={subject || undefined}
                  onValueChange={setSubject}
                >
                  <SelectTrigger className="h-11 w-full rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
                    <SelectValue placeholder="Хичээл сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5a5f80]">
                  Ангиа сонгох
                </label>
                <Select value={grade || undefined} onValueChange={setGrade}>
                  <SelectTrigger className="h-11 w-full rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
                    <SelectValue placeholder="Ангиа сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5a5f80]">
                Бүлэг сонгох
              </label>
              <Select value={unit || undefined} onValueChange={setUnit}>
                <SelectTrigger className="h-11 w-full rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
                  <SelectValue placeholder="Бүлэг сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5a5f80]">
                Сэдэв сонгох
              </label>
              <Select
                value={topic || undefined}
                onValueChange={setTopic}
                disabled={!unit}
              >
                <SelectTrigger className="h-11 w-full rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
                  <SelectValue placeholder="Сэдэв сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#5a5f80]"
                htmlFor={fileInputId}
              >
                PDF файл
              </label>
              <input
                id={fileInputId}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={onFileSelect}
              />
              <label
                htmlFor={fileInputId}
                className="flex min-h-20 cursor-pointer items-center justify-between gap-3 rounded-[18px] border border-dashed border-[#cfe0ff] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-4 transition hover:border-[#1864FB] hover:bg-[#f7faff]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eaf2ff] text-[#1864FB]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#4b4f72]">
                      {selectedSourceFile
                        ? selectedSourceFile.name
                        : "PDF файл сонгох"}
                    </p>
                    <p className="text-xs text-[#8b92ac]">
                      {selectedSourceFile
                        ? `${formatFileSize(selectedSourceFile.size)} хэмжээтэй файл`
                        : "Нэг PDF файл оруулна уу"}
                    </p>
                  </div>
                </div>
                <div className="inline-flex h-9 items-center rounded-full bg-[#1864FB] px-4 text-xs font-medium text-white shadow-[0_12px_24px_rgba(24,100,251,0.22)]">
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  Файл сонгох
                </div>
              </label>
            </div>
          </div>

          <div className="flex">
            <div className="flex w-full flex-col rounded-[22px] border border-[#dbe6ff] bg-white/90 p-4 shadow-[0_18px_42px_rgba(177,196,235,0.18)] backdrop-blur">
              <div className="border-b border-[#dbe6ff] pb-4">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#353b4e]">
                  Мэдээлэл
                </h3>
              </div>

              <div className="space-y-3 py-4 text-[#4b4f72]">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">Нэр:</span>
                  <span className="text-right font-medium">
                    {newSourceName.trim() || "Оруулаагүй"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">Хичээл:</span>
                  <span className="text-right font-medium">
                    {subject || "Оруулаагүй"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">Анги:</span>
                  <span className="text-right font-medium">
                    {grade || "Оруулаагүй"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">Бүлэг:</span>
                  <span className="text-right font-medium">
                    {unit || "Оруулаагүй"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">Сэдэв:</span>
                  <span className="text-right font-medium">
                    {topic || "Оруулаагүй"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-semibold text-[#5a5f80]">PDF:</span>
                  <span className="text-right font-medium">
                    {selectedSourceFile
                      ? selectedSourceFile.name
                      : "Сонгогдоогүй"}
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-[#dbe6ff] pt-4">
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleDemo()}
                    className="h-11 rounded-[18px] border-[#d8e2f6] text-sm font-medium text-[#5c6787] hover:bg-[#f6f9ff]"
                  >
                    Demo
                  </Button>
                  <Button
                    type="button"
                    onClick={onUpload}
                    disabled={
                      !selectedSourceFile || !newSourceName.trim() || isUploading
                    }
                    className="h-11 rounded-[18px] bg-[#1864FB] text-sm font-medium text-white shadow-[0_14px_28px_rgba(24,100,251,0.24)] hover:bg-[#0f57e7] disabled:bg-[#9fbcfb]"
                  >
                    {isUploading ? "Бүртгэж байна..." : "Эх сурвалжийг бүртгэх"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="h-10 rounded-[16px] text-sm text-[#66708f] hover:bg-[#f3f7ff] hover:text-[#425173]"
                  >
                    Болих
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
