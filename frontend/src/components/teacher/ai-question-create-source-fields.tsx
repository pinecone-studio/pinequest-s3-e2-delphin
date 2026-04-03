"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getReadableUploadName } from "@/lib/source-files";
import type { UploadRecord } from "@/lib/uploads-api";

type Props = {
  availableSourceFiles: UploadRecord[];
  gradeOptions: string[];
  onSourceChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  selectedGrade: string;
  selectedSourceId: string;
  selectedTopic: string;
  selectedUnit: string;
  topicOptions: string[];
  unitOptions: string[];
};

export function AIQuestionCreateSourceFields({
  availableSourceFiles,
  gradeOptions,
  onGradeChange,
  onSourceChange,
  onTopicChange,
  onUnitChange,
  selectedGrade,
  selectedSourceId,
  selectedTopic,
  selectedUnit,
  topicOptions,
  unitOptions,
}: Props) {
  return (
    <div className="space-y-[5px]">
      <Select
        value={selectedSourceId}
        onValueChange={onSourceChange}
        disabled={availableSourceFiles.length === 0}
      >
        <SelectTrigger className="h-[36px] w-[400px] max-w-full rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
          <SelectValue placeholder="Эх сурвалж сонгох" />
        </SelectTrigger>
        <SelectContent className="max-h-[180px] overflow-y-auto">
          {availableSourceFiles.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {getReadableUploadName(source.originalName)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid w-[400px] max-w-full grid-cols-[190px_190px] gap-5">
        <div className="space-y-[5px]">
          <p className="text-[14px] font-semibold text-[#4b4f72]">Хичээл</p>
          <div className="flex h-[36px] items-center rounded-[12px] border border-[#dce7ff] bg-white px-3 text-[14px] text-[#4b4f72]">
            Математик
          </div>
        </div>
        <div className="space-y-[5px]">
          <p className="text-[14px] font-semibold text-[#4b4f72]">Ангиа сонгох</p>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="h-[36px] w-[190px] rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
              <SelectValue placeholder="Ангиа сонгох" />
            </SelectTrigger>
            <SelectContent className="max-h-[180px] overflow-y-auto">
              {gradeOptions.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-[5px]">
        <p className="text-[14px] font-semibold text-[#4b4f72]">Бүлэг сонгох</p>
        <Select value={selectedUnit} onValueChange={onUnitChange}>
          <SelectTrigger className="h-[36px] w-[400px] max-w-full rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
            <SelectValue placeholder="Бүлэг сонгох" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-[5px]">
        <p className="text-[14px] font-semibold text-[#4b4f72]">Сэдэв сонгох</p>
        <Select value={selectedTopic} onValueChange={onTopicChange}>
          <SelectTrigger className="h-[36px] w-[400px] max-w-full rounded-[12px] border-[#dce7ff] bg-white text-[14px] text-[#4b4f72]">
            <SelectValue placeholder="Сэдэв сонгох" />
          </SelectTrigger>
          <SelectContent>
            {topicOptions.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
