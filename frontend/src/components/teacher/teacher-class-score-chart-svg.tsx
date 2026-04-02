"use client"

import {
  type ExamQualityChartModel,
} from "@/lib/teacher-class-score-chart-data"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  SCORE_CHART_SERIES_META as SERIES_META,
  TeacherClassScoreChartTooltip,
} from "@/components/teacher/teacher-class-score-chart-tooltip"

export function TeacherClassScoreChartSvg(props: {
  model: ExamQualityChartModel
}) {
  const { model } = props

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96)_0%,rgba(249,251,255,0.94)_48%,rgba(244,247,255,0.88)_100%)] px-4 py-4 shadow-[0_18px_50px_rgba(180,196,227,0.16)]">
      <div className="pointer-events-none absolute inset-x-10 top-0 h-28 rounded-full bg-[radial-gradient(circle,rgba(188,214,255,0.18)_0%,rgba(255,255,255,0)_72%)]" />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(SERIES_META) as Array<keyof typeof SERIES_META>).map((seriesKey) => (
            <div
              key={seriesKey}
              className="rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-medium text-[#73809d] shadow-[0_10px_24px_rgba(188,199,226,0.14)]"
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SERIES_META[seriesKey].color }}
              />
              {SERIES_META[seriesKey].label}
            </div>
          ))}
        </div>
        <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#91a0be]">
          Y: Гүйцэтгэлийн хувь
        </div>
      </div>

      <div className="h-[360px] w-full">
        {model.hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={model.data} margin={{ top: 10, right: 18, left: 8, bottom: 28 }}>
              <defs>
                <filter id="chartLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                stroke="rgba(196,207,232,0.38)"
                strokeDasharray="4 10"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="bucketLabel"
                minTickGap={16}
                tick={{ fill: "#93a0bd", fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                tickMargin={14}
              />
              <YAxis
                axisLine={false}
                domain={[0, 100]}
                tick={{ fill: "#a0a9c0", fontSize: 11, fontWeight: 500 }}
                tickCount={model.yAxisTicks.length}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                ticks={model.yAxisTicks}
                width={50}
              />
              <Tooltip
                content={<TeacherClassScoreChartTooltip />}
                cursor={{ stroke: "rgba(154,173,222,0.35)", strokeDasharray: "3 6" }}
              />
              <Line
                activeDot={{ r: 5, fill: SERIES_META.easy.color, stroke: "#ffffff", strokeWidth: 2 }}
                animationDuration={800}
                connectNulls={false}
                dataKey="easyRatio"
                dot={false}
                filter="url(#chartLineGlow)"
                name={SERIES_META.easy.label}
                stroke={SERIES_META.easy.color}
                strokeLinecap="round"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                activeDot={{ r: 5, fill: SERIES_META.medium.color, stroke: "#ffffff", strokeWidth: 2 }}
                animationDuration={900}
                connectNulls={false}
                dataKey="mediumRatio"
                dot={false}
                filter="url(#chartLineGlow)"
                name={SERIES_META.medium.label}
                stroke={SERIES_META.medium.color}
                strokeLinecap="round"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                activeDot={{ r: 5, fill: SERIES_META.hard.color, stroke: "#ffffff", strokeWidth: 2 }}
                animationDuration={1000}
                connectNulls={false}
                dataKey="hardRatio"
                dot={false}
                filter="url(#chartLineGlow)"
                name={SERIES_META.hard.label}
                stroke={SERIES_META.hard.color}
                strokeLinecap="round"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-[#dae4fb] bg-white/60 text-center text-sm text-[#9aa6bf]">
            Энэ шалгалтын хадгалсан үр дүн хараахан хүрэлцэхгүй байна.
          </div>
        )}
      </div>
    </div>
  )
}
