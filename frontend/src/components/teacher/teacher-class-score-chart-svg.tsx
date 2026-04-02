"use client"

import {
  teacherClassChartHighlightBubbles,
  teacherClassChartSeries,
  teacherClassChartXAxisLabels,
  teacherClassChartYAxisLabels,
} from "@/lib/teacher-class-score-chart-data"

export function TeacherClassScoreChartSvg() {
  const width = 880
  const height = 423
  const left = 64
  const right = 28
  const top = 18
  const bottom = 76
  const chartWidth = width - left - right
  const chartHeight = height - top - bottom
  const highlightIndex = 5
  const focusX =
    left + (chartWidth / (teacherClassChartXAxisLabels.length - 1)) * highlightIndex
  const focusY =
    top + (chartHeight / (teacherClassChartYAxisLabels.length - 1)) * 2.7

  const buildX = (index: number) =>
    left + (chartWidth / (teacherClassChartXAxisLabels.length - 1)) * index
  const buildY = (value: number) =>
    top + (chartHeight / (teacherClassChartYAxisLabels.length - 1)) * value

  return (
    <div className="relative overflow-hidden rounded-[28px] px-1 py-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <defs>
          <filter id="seriesGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="10"
              floodColor="rgba(155,167,198,0.18)"
            />
          </filter>
          <radialGradient id="focusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,164,204,0.42)" />
            <stop offset="55%" stopColor="rgba(255,183,210,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="focusColumn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(244,176,212,0)" />
            <stop offset="20%" stopColor="rgba(244,176,212,0.2)" />
            <stop offset="80%" stopColor="rgba(244,176,212,0.14)" />
            <stop offset="100%" stopColor="rgba(244,176,212,0)" />
          </linearGradient>
        </defs>

        <rect
          x={focusX - 30}
          y={top + 8}
          width="60"
          height={chartHeight - 34}
          rx="30"
          fill="url(#focusColumn)"
        />
        <line
          x1={focusX}
          x2={focusX}
          y1={top + 18}
          y2={top + chartHeight - 18}
          stroke="rgba(241,138,186,0.38)"
          strokeWidth="1.2"
        />

        {teacherClassChartYAxisLabels.map((label, index) => {
          const y = top + (chartHeight / (teacherClassChartYAxisLabels.length - 1)) * index
          return (
            <text
              key={label}
              x="2"
              y={y + 4}
              className="fill-[#a0a8c2]"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          )
        })}

        {teacherClassChartSeries.map((series) => {
          const path = series.points
            .map(([xValue, yValue], index) => {
              const x = buildX(xValue)
              const y = buildY(yValue)
              if (index === 0) return `M ${x} ${y}`

              const [prevXValue, prevYValue] = series.points[index - 1]
              const prevX = buildX(prevXValue)
              const prevY = buildY(prevYValue)
              const controlX = prevX + (x - prevX) / 2
              return `C ${controlX} ${prevY} ${controlX} ${y} ${x} ${y}`
            })
            .join(" ")

          return (
            <path
              key={series.color}
              d={path}
              fill="none"
              filter="url(#seriesGlow)"
              stroke={series.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.65"
            />
          )
        })}

        <circle cx={focusX} cy={focusY} fill="url(#focusGlow)" r="58" />
        <circle cx={focusX} cy={focusY} fill="#ffd9e8" opacity="0.95" r="7.5" />
        <circle cx={focusX} cy={focusY} fill="#ffffff" opacity="0.84" r="3.1" />

        {teacherClassChartHighlightBubbles.map((bubble) => (
          <g
            key={bubble.text}
            transform={`translate(${bubble.x + focusX - 70}, ${bubble.y + focusY - 86})`}
            filter="url(#bubbleShadow)"
          >
            <rect width="44" height="22" rx="11" fill={bubble.bg} />
            <circle cx="11" cy="11" fill={bubble.dot} r="3" />
            <text
              x="21"
              y="14.2"
              className="fill-[#7f88a7]"
              fontSize="10.5"
              fontWeight="600"
            >
              {bubble.text}
            </text>
          </g>
        ))}

        {teacherClassChartXAxisLabels.map((item, index) => {
          const x = buildX(index)
          return (
            <g key={`${item.range}-${item.points}`}>
              <text
                x={x}
                y={height - 26}
                textAnchor="middle"
                className="fill-[#8e98b4]"
                fontSize="11"
                fontWeight="500"
              >
                {item.range}
              </text>
              <text
                x={x}
                y={height - 11}
                textAnchor="middle"
                className="fill-[#afb7cb]"
                fontSize="10.5"
                fontWeight="500"
              >
                {item.points}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
