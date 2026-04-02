"use client"

import Image from "next/image"
import type { TeacherClassSummaryRow } from "@/lib/teacher-class-score-chart-data"

export function TeacherClassScoreSummaryCard(props: {
  rows: TeacherClassSummaryRow[]
  title: string
  variant: "difficulty" | "topic"
}) {
  const { rows, title, variant } = props

  return (
    <div className="flex-1 rounded-[18px] border border-[#edf1fa] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,251,255,0.92)_100%)] px-4 py-3 shadow-[0_12px_32px_rgba(180,196,227,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Image
              src={variant === "difficulty" ? "/certificate.svg" : "/book-open-blue.svg"}
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            <p className="text-[13px] font-semibold text-[#687391]">{title}</p>
          </div>
          <p className="mt-0.5 text-[10px] text-[#a5aec4]">
            {variant === "difficulty"
              ? "Difficulty-based summary"
              : "Chapter-based summary"}
          </p>
        </div>
        <div className="text-[12px] font-semibold text-[#6d85ff]">
          {variant === "difficulty" ? "+32%" : "+72%"}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 text-[11px]"
            >
              <span className="truncate text-[#6d7690]">{row.label}</span>
              <span className="shrink-0 font-semibold" style={{ color: row.accent }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <MiniSparkline variant={variant} />
      </div>
    </div>
  )
}

function MiniSparkline({ variant }: { variant: "difficulty" | "topic" }) {
  const line =
    variant === "difficulty"
      ? "M 4 26 C 18 14, 28 10, 38 18 C 46 24, 56 29, 66 21 C 75 15, 83 12, 94 17"
      : "M 4 28 C 15 24, 24 19, 33 17 C 43 15, 54 9, 63 12 C 74 15, 83 10, 94 6"

  return (
    <svg viewBox="0 0 98 34" className="h-[32px] w-[96px] shrink-0">
      <path
        d={line}
        fill="none"
        stroke={variant === "difficulty" ? "#d8dde9" : "#cfd7ec"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  )
}
