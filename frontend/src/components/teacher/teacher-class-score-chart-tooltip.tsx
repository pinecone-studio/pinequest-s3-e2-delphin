"use client"

import type { ExamQualityChartModel } from "@/lib/teacher-class-score-chart-data"

export const SCORE_CHART_SERIES_META = {
  easy: { color: "#8ed8b9", label: "Хөнгөн" },
  medium: { color: "#8cb2ff", label: "Дунд" },
  hard: { color: "#f3b2c7", label: "Хүнд" },
} as const

export function TeacherClassScoreChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    payload?: ExamQualityChartModel["data"][number]
  }>
  label?: string
}) {
  if (!active || !payload?.length || !payload[0]?.payload) return null

  const point = payload[0].payload
  const rows = [
    { ...SCORE_CHART_SERIES_META.easy, earned: point.easyEarned, possible: point.easyPossible, value: point.easyRatio },
    {
      ...SCORE_CHART_SERIES_META.medium,
      earned: point.mediumEarned,
      possible: point.mediumPossible,
      value: point.mediumRatio,
    },
    { ...SCORE_CHART_SERIES_META.hard, earned: point.hardEarned, possible: point.hardPossible, value: point.hardRatio },
  ]

  return (
    <div className="min-w-[220px] rounded-[18px] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_18px_40px_rgba(164,180,214,0.2)] backdrop-blur">
      <div className="text-[12px] font-semibold text-[#63718f]">{label}</div>
      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 text-[#7c89a7]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
              {row.label}
            </div>
            <div className="text-right">
              <div className="font-semibold text-[#5e6f92]">{typeof row.value === "number" ? `${row.value}%` : "—"}</div>
              <div className="text-[10px] text-[#a3aec4]">
                {row.earned}/{row.possible} оноо
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
