"use client";

import { Input } from "@/components/ui/input";
import { QuestionBankSourceUploadFileField } from "@/components/teacher/question-bank-source-upload-file-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_OPTIONS, SUBJECT_OPTIONS, UNIT_OPTIONS } from "@/components/teacher/question-bank-source-shared";

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
    <div className="space-y-3">
      <label className="text-[14px] font-semibold text-[#4b4f72]">
        {label}
      </label>
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-[60px] w-full rounded-[20px] border-[#d8e2f6] bg-white px-5 text-[14px] text-[#4b4f72] shadow-none focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20">
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
    <div className="space-y-2">
      <div className="space-y-2">
        <label
          className="text-[14px] font-semibold text-[#4b4f72]"
          htmlFor="source-name"
        >
          Эх сурвалжийн нэр
        </label>
        <Input
          id="source-name"
          placeholder="Жишээ: Математик 7-р анги"
          value={newSourceName}
          onChange={(event) => onNameChange(event.target.value)}
          className="h-[36px] w-[400px] max-w-full rounded-[20px] border-[#d8e2f6] bg-white px-5 text-[14px] text-[#4b4f72] shadow-none placeholder:text-[#b3bacf] focus-visible:border-[#1864FB] focus-visible:ring-[#1864FB]/20"
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

      <QuestionBankSourceUploadFileField
        fileInputId={fileInputId}
        onFileSelect={onFileSelect}
        selectedSourceFile={selectedSourceFile}
      />
    </div>
  );
}
