"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/components/teacher/question-bank-source-shared";
import { getReadableUploadName } from "@/lib/source-files";
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
  return (
    <div className="rounded-[24px] border border-[#dde7ff] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#eef4ff] p-2 text-[#5b91fc]">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[#344264]">
            {getReadableUploadName(file.originalName)}
          </p>
          <p className="mt-1 text-sm text-[#6f7898]">
            {formatFileSize(file.size)} •{" "}
            {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuestionBankSourceFileList({ files }: Props) {
  return (
    <>
      <div className="space-y-3">
        {files.length === 0 ? (
          <EmptyState />
        ) : (
          files.slice(0, 6).map((file) => <SourceFileCard key={file.id} file={file} />)
        )}
      </div>

      {files.length > 6 ? (
        <Button variant="outline" asChild className="w-full">
          <Link href="/teacher/sources">Бүх эх сурвалж харах</Link>
        </Button>
      ) : null}
    </>
  );
}
