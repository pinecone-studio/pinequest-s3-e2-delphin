"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { getReadableUploadName } from "@/lib/source-files";
import type { UploadRecord } from "@/lib/uploads-api";

type BuilderSourcePickerProps = {
  availableSourceFiles: UploadRecord[];
  selectedMockTests: string[];
  onToggleTest: (testId: string, checked: boolean) => void;
};

export function AIQuestionBuilderSourcePicker({
  availableSourceFiles,
  selectedMockTests,
  onToggleTest,
}: BuilderSourcePickerProps) {
  if (availableSourceFiles.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Мэдлэгийн санд хараахан файл алга байна.
      </div>
    );
  }

  return availableSourceFiles.map((source) => (
    <label
      key={source.id}
      className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#eef3ff] px-3 py-2 hover:bg-[#f8fbff]"
    >
      <Checkbox
        checked={selectedMockTests.includes(source.id)}
        onCheckedChange={(checked) => onToggleTest(source.id, checked === true)}
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-[#4b4f72]">
          {getReadableUploadName(source.originalName)}
        </p>
        <p className="text-[12px] text-[#8b92ac]">
          {new Date(source.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </label>
  ));
}
