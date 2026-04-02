"use client"

import Image from "next/image"
import type { TeacherClassSummaryRow } from "@/lib/teacher-class-score-chart-data"

export function TeacherClassScoreSummaryCard(props: {
  headlineValue: string
  rows: TeacherClassSummaryRow[]
  sparklineValues: number[]
  subtitle: string
  title: string
  variant: "difficulty" | "topic"
}) {
  const { headlineValue, rows, sparklineValues, subtitle, title, variant } = props

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
            {subtitle}
          </p>
        </div>
        <div className="text-[12px] font-semibold text-[#6d85ff]">
          {headlineValue}
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
        <MiniSparkline values={sparklineValues} variant={variant} />
      </div>
    </div>
  )
}

function MiniSparkline({
  values,
  variant,
}: {
  values: number[]
  variant: "difficulty" | "topic"
}) {
  const line = buildSparklinePath(values)

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

function buildSparklinePath(values: number[]) {
  if (values.length === 0) {
    return "M 4 17 L 94 17"
  }

  const normalized = values.length === 1 ? [values[0], values[0]] : values
  const max = Math.max(...normalized, 1)
  const min = Math.min(...normalized, 0)
  const range = Math.max(max - min, 1)

  return normalized
    .map((value, index) => {
      const x = 4 + (90 / Math.max(normalized.length - 1, 1)) * index
      const y = 28 - ((value - min) / range) * 20
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")
}
