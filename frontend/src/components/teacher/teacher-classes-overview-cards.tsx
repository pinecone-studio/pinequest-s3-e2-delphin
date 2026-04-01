"use client"

import Image from "next/image"

export function OverviewMetricCard({
  metric,
}: {
  metric: {
    deltaColor?: string
    delta: string
    deltaClassName: string
    icon?: string
    label: string
    stroke: string
    trend: number[]
    value: string
  }
}) {
  const width = 120
  const height = 28
  const max = Math.max(...metric.trend, 1)
  const min = Math.min(...metric.trend)

  return (
    <div className="rounded-[16px] border border-[#ededed] bg-[linear-gradient(237deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] px-3 py-4 shadow-[50px_38px_102px_rgba(120,118,148,0.08)]">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border border-[#eef1f8] bg-white/70">
          {metric.icon ? (
            <Image
              src={metric.icon}
              alt=""
              width={16}
              height={16}
              className="object-contain"
            />
          ) : (
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: metric.stroke }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-medium leading-[14px] text-[#4c4c66]">
              {metric.label}
            </p>
            <span
              className="text-[10px] font-semibold"
              style={{ color: metric.deltaColor ?? "#24b982" }}
            >
              {metric.delta}
            </span>
          </div>
          <p className="mt-1 text-[30px] font-normal leading-none text-[#141a1f]">
            {metric.value}
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-[30px] w-full">
        <path
          d={metric.trend
            .map((point, index) => {
              const x = (index * width) / Math.max(metric.trend.length - 1, 1)
              const y =
                height -
                (((point - min) / Math.max(max - min, 1)) * (height - 6) + 3)
              return `${index === 0 ? "M" : "L"} ${x} ${y}`
            })
            .join(" ")}
          fill="none"
          stroke={metric.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.8"
        />
      </svg>
    </div>
  )
}

export function OverviewInsightCard({
  card,
}: {
  card: {
    delta: string
    deltaClassName: string
    label: string
    stroke: string
    trend: number[]
    value: string
  }
}) {
  return (
    <div className="flex h-[108px] flex-col rounded-[18px] border border-[#d8deea] bg-white px-4 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#141a1f]">
          {card.label}
        </p>
        <span className={`text-[11px] font-semibold ${card.deltaClassName}`}>
          {card.delta}
        </span>
      </div>
      <p className="mt-1.5 text-[24px] leading-none text-[#454561]">{card.value}</p>
      <Sparkline height={24} stroke={card.stroke} trend={card.trend} />
    </div>
  )
}

function Sparkline({
  height,
  stroke,
  trend,
}: {
  height: number
  stroke: string
  trend: number[]
}) {
  return (
    <div className="mt-3 h-6">
      <svg viewBox={`0 0 120 ${height}`} className="h-full w-full">
        <path
          d={buildSparklinePath(trend, height)}
          fill="none"
          stroke="#c4cad6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  )
}

function buildSparklinePath(points: number[], height: number) {
  if (points.length === 0) return ""
  const max = Math.max(...points, 1)
  const min = Math.min(...points)
  return points
    .map((point, index) => {
      const x = (index * 120) / Math.max(points.length - 1, 1)
      const y = height - (((point - min) / Math.max(max - min, 1)) * (height - 8) + 4)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")
}
