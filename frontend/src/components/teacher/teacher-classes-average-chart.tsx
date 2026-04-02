"use client"

import type { ClassDifficultyChartPoint } from "@/lib/teacher-classes-side-panel-data"

export function TeacherClassesAverageChart(props: {
  data: ClassDifficultyChartPoint[]
}) {
  const { data } = props
  const width = 340
  const height = 190
  const left = 28
  const right = 14
  const top = 16
  const bottom = 28
  const chartWidth = width - left - right
  const chartHeight = height - top - bottom

  const buildX = (index: number) =>
    left + (chartWidth / Math.max(data.length - 1, 1)) * index
  const buildY = (value: number) =>
    top + chartHeight - (value / 100) * chartHeight

  const series = [
    { color: "#8ed8b9", key: "easyRatio", label: "Хөнгөн" },
    { color: "#8cb2ff", key: "mediumRatio", label: "Дунд" },
    { color: "#f3b2c7", key: "hardRatio", label: "Хүнд" },
  ] as const

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {([100, 80, 60, 40, 20] as const).map((tick, index) => (
        <text
          key={tick}
          x="0"
          y={top + (chartHeight / 4) * index + 4}
          className="fill-[#a8b3c8]"
          fontSize="10"
          fontWeight="500"
        >
          {tick}
        </text>
      ))}

      {series.map((seriesItem) => {
        const path = data
          .map((point, index) => {
            const x = buildX(index)
            const value = point[seriesItem.key] ?? 0
            const y = buildY(value)
            if (index === 0) return `M ${x} ${y}`

            const prevX = buildX(index - 1)
            const prevPoint = data[index - 1]
            const prevY = buildY(prevPoint?.[seriesItem.key] ?? value)
            const controlX = prevX + (x - prevX) / 2
            return `C ${controlX} ${prevY} ${controlX} ${y} ${x} ${y}`
          })
          .join(" ")

        return (
          <path
            key={seriesItem.key}
            d={path}
            fill="none"
            stroke={seriesItem.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        )
      })}

      {data.map((point, index) => (
        <text
          key={point.classId}
          x={buildX(index)}
          y={height - 4}
          textAnchor="middle"
          className="fill-[#95a2bd]"
          fontSize="10.5"
          fontWeight="500"
        >
          {point.classLabel}
        </text>
      ))}

      {series.map((seriesItem, index) => {
        const point = data[index]
        if (!point) return null
        const value = point[seriesItem.key]
        if (typeof value !== "number") return null
        const x = buildX(index)
        const y = buildY(value)
        return (
          <g key={`${point.classId}-${seriesItem.key}`} transform={`translate(${x - 18}, ${y - 16})`}>
            <rect
              width="40"
              height="18"
              rx="9"
              fill="rgba(255,255,255,0.98)"
              stroke="#f3f5fb"
            />
            <text
              x="20"
              y="12"
              textAnchor="middle"
              className="fill-[#8a96b2]"
              fontSize="9.5"
              fontWeight="600"
            >
              {value}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
