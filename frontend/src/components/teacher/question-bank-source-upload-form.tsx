"use client";

import { FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatFileSize,
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
  UNIT_OPTIONS,
} from "@/components/teacher/question-bank-source-shared";

type Props = {
  availableTopics: readonly string[];
  fileInputId: string;
  grade: string;
  newSourceName: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGradeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  selectedSourceFile: File | null;
  subject: string;
  topic: string;
  unit: string;
};

function SelectField({
  label,
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#5a5f80]">{label}</label>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-11 w-full rounded-[18px] border-[#d8e2f6] bg-white px-4 text-sm text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function QuestionBankSourceUploadForm({
  availableTopics,
  fileInputId,
  grade,
  newSourceName,
  onFileSelect,
  onGradeChange,
  onNameChange,
  onSubjectChange,
  onTopicChange,
  onUnitChange,
  selectedSourceFile,
  subject,
  topic,
  unit,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#5a5f80]" htmlFor="source-name">
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
        <SelectField
          label="Хичээл"
          options={SUBJECT_OPTIONS}
          placeholder="Хичээл сонгох"
          value={subject}
          onChange={onSubjectChange}
        />
        <SelectField
          label="Ангиа сонгох"
          options={GRADE_OPTIONS}
          placeholder="Ангиа сонгох"
          value={grade}
          onChange={onGradeChange}
        />
      </div>

      <SelectField
        label="Бүлэг сонгох"
        options={UNIT_OPTIONS.map((option) => option.value)}
        placeholder="Бүлэг сонгох"
        value={unit}
        onChange={onUnitChange}
      />
      <SelectField
        label="Сэдэв сонгох"
        options={availableTopics}
        placeholder="Сэдэв сонгох"
        value={topic}
        onChange={onTopicChange}
        disabled={!unit}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#5a5f80]" htmlFor={fileInputId}>
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
                {selectedSourceFile ? selectedSourceFile.name : "PDF файл сонгох"}
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
  );
}
