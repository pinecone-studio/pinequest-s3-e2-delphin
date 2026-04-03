"use client";

import { buildScoreBadgeStyles } from "@/components/teacher/teacher-classes-student-results-utils";
import type { StudentExamResult } from "@/lib/teacher-classes-side-panel-data";

export function StudentResultRow(props: {
  result: StudentExamResult;
  onClick: () => void;
}) {
  const { result, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid cursor-pointer grid-cols-[46px_minmax(0,1fr)_10px] items-center gap-3 rounded-[16px] border border-[#edf1fa] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,252,255,0.94)_100%)] px-3 py-3 text-left transition hover:border-[#dbe5fb] hover:bg-white hover:shadow-[0_14px_30px_rgba(210,223,242,0.22)]"
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-semibold"
        style={buildScoreBadgeStyles(result.scorePercent)}
      >
        {result.scorePercent}%
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <p className="truncate text-[13px] font-semibold text-[#4d5671]">{result.studentName}</p>
          <p className="text-[11px] text-[#8f9ab6]">ID: {result.studentId}</p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-[#a1acc2]">
          <span>{result.className}</span>
          <span>{result.email}</span>
        </div>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-[#d8dfee]" />
    </button>
  );
}
