"use client"

import { CalendarDays, Clock3, FileText } from "lucide-react"
import type { StudentExamResult } from "@/lib/teacher-classes-side-panel-data"

export function TeacherClassesStudentResultsCard(props: {
  className: string
  date: string
  results: StudentExamResult[]
  time: string
}) {
  const { className, date, results, time } = props

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">
        Шалгалтын дүн
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#a6b0c5]">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
          {date}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
          Өнөөдөр · {time}
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
          Явцын шалгалт
        </span>
      </div>

      <p className="mt-4 text-[15px] font-medium text-[#6b77a4]">
        {className} сурагчдын шалгалтын дүн
      </p>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {results.map((result) => (
          <StudentResultRow key={result.studentId} result={result} />
        ))}
      </div>
    </section>
  )
}

function StudentResultRow(props: { result: StudentExamResult }) {
  const { result } = props

  return (
    <div className="grid grid-cols-[46px_minmax(0,1fr)_10px] items-center gap-3 rounded-[16px] border border-[#edf1fa] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,252,255,0.94)_100%)] px-3 py-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-semibold"
        style={buildScoreBadgeStyles(result.scorePercent)}
      >
        {result.scorePercent}%
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <p className="truncate text-[13px] font-semibold text-[#4d5671]">
            {result.studentName}
          </p>
          <p className="text-[11px] text-[#8f9ab6]">ID: {result.studentId}</p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-[#a1acc2]">
          <span>{result.className}</span>
          <span>{result.email}</span>
        </div>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-[#d8dfee]" />
    </div>
  )
}

function buildScoreBadgeStyles(scorePercent: number) {
  if (scorePercent >= 90) {
    return {
      backgroundColor: "rgba(231,250,237,0.96)",
      borderColor: "#aee3bf",
      color: "#64c583",
    }
  }

  if (scorePercent >= 75) {
    return {
      backgroundColor: "rgba(238,245,255,0.98)",
      borderColor: "#b9d0ff",
      color: "#6a8fff",
    }
  }

  return {
    backgroundColor: "rgba(246,239,255,0.98)",
    borderColor: "#d3c0ff",
    color: "#a276ff",
  }
}
