"use client"

import type { ClassAveragePoint } from "@/lib/teacher-classes-side-panel-data"

export function TeacherClassesAverageChart(props: {
  averages: ClassAveragePoint[]
}) {
  const { averages } = props
  const width = 340
  const height = 190
  const left = 28
  const right = 14
  const top = 16
  const bottom = 28
  const chartWidth = width - left - right
  const chartHeight = height - top - bottom

  const buildX = (index: number) =>
    left + (chartWidth / Math.max(averages.length - 1, 1)) * index
  const buildY = (value: number) =>
    top + chartHeight - (value / 100) * chartHeight

  const helperSeries = [
    { color: "#f3b2d2", offset: -6 },
    { color: "#78d9e9", offset: 0 },
    { color: "#f3c6a5", offset: 7 },
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

      {helperSeries.map((series) => {
        const path = averages
          .map((point, index) => {
            const x = buildX(index)
            const y = buildY(Math.max(24, Math.min(96, point.averageScore + series.offset)))
            if (index === 0) return `M ${x} ${y}`

            const prevX = buildX(index - 1)
            const prevPoint = averages[index - 1]
            const prevY = buildY(
              Math.max(24, Math.min(96, (prevPoint?.averageScore ?? point.averageScore) + series.offset)),
            )
            const controlX = prevX + (x - prevX) / 2
            return `C ${controlX} ${prevY} ${controlX} ${y} ${x} ${y}`
          })
          .join(" ")

        return (
          <path
            key={series.color}
            d={path}
            fill="none"
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        )
      })}

      {averages.map((point, index) => (
        <text
          key={point.className}
          x={buildX(index)}
          y={height - 4}
          textAnchor="middle"
          className="fill-[#95a2bd]"
          fontSize="10.5"
          fontWeight="500"
        >
          {point.className}
        </text>
      ))}

      {averages.slice(0, 2).map((point, index) => {
        const x = buildX(index + 1)
        const y = buildY(point.averageScore - 4)
        return (
          <g key={`${point.className}-label`} transform={`translate(${x - 18}, ${y - 16})`}>
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
              85.56%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
