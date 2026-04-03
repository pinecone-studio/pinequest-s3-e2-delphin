"use client";

import { FileText } from "lucide-react";
import { getSourceDisplayMeta } from "@/lib/source-file-display";
import type { UploadRecord } from "@/lib/uploads-api";

type Props = {
  files: UploadRecord[];
};

function EmptyState() {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d7e3ff] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] px-4 py-8 text-center">
      <FileText className="mx-auto mb-3 h-10 w-10 text-[#98a9ca]" />
      <p className="font-medium text-[#344264]">Эх сурвалж файл алга байна</p>
      <p className="mt-1 text-sm text-[#6f7898]">
        Шинэ файл нэмээд AI-аар асуулт үүсгэхдээ ашиглаарай.
      </p>
    </div>
  );
}

function SourceFileCard({ file }: { file: UploadRecord }) {
  const meta = getSourceDisplayMeta(file);

  return (
    <div className="grid grid-cols-[minmax(124px,0.85fr)_minmax(150px,1fr)] gap-x-5 gap-y-1 px-7 py-5">
      <div className="min-w-0">
        <p className="truncate text-[16px] font-medium leading-6 text-[#4c4c66]">
          {meta.leftPrimary}
        </p>
        <p className="mt-1 truncate text-[16px] font-normal leading-6 text-[#7a80a3]">
          {meta.leftSecondary}
        </p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[16px] font-medium leading-6 text-[#4c4c66]">
          {meta.rightPrimary}
        </p>
        <p className="mt-1 truncate text-[16px] font-normal leading-6 text-[#7a80a3]">
          {meta.rightSecondary}
        </p>
      </div>
    </div>
  );
}

function SourceFileRows({ files }: Props) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#dde7ff] bg-[linear-gradient(180deg,#fdfefe_0%,#ffffff_100%)] shadow-[0_12px_30px_rgba(168,196,235,0.08)]">
      {files.map((file, index) => (
        <div key={file.id} className="min-w-0">
          <SourceFileCard file={file} />
          {index < files.length - 1 ? (
            <div className="mx-7 h-px bg-[#e8eefb]" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function QuestionBankSourceFileList({ files }: Props) {
  return (
    <div>
      {files.length === 0 ? (
        <EmptyState />
      ) : (
        <SourceFileRows files={files} />
      )}
    </div>
  );
}
