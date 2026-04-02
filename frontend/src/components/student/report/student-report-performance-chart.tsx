"use client"

import { useId } from "react"

import { useTheme } from "@/components/theme-provider"

type StudentReportPerformanceChartProps = {
  correctCount: number
  percentage: number
  questionCount: number
  score: number
  totalPoints: number
  wrongCount: number
}

const CENTER_X = 93.0121
const CENTER_Y = 95.0755
const START_ANGLE = -90
const GREEN_OUTER_RADIUS = 90.66
const ORANGE_OUTER_RADIUS = 85.12
const BLUE_OUTER_RADIUS = 72.265
const CENTER_RADIUS = 51.901
const INNER_HIGHLIGHT_RADIUS = 45.99

const polarToCartesian = (radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CENTER_X + radius * Math.cos(radians), y: CENTER_Y + radius * Math.sin(radians) }
}

const buildDonutPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
  const sweep = endAngle - startAngle
  if (sweep <= 0) return ""
  if (sweep >= 359.999) {
    return [
      `M ${CENTER_X + outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${CENTER_X - outerRadius} ${CENTER_Y}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${CENTER_X + outerRadius} ${CENTER_Y}`,
      `L ${CENTER_X + innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${CENTER_X - innerRadius} ${CENTER_Y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${CENTER_X + innerRadius} ${CENTER_Y}`,
      "Z",
    ].join(" ")
  }
  const largeArcFlag = sweep > 180 ? 1 : 0
  const outerStart = polarToCartesian(outerRadius, startAngle)
  const outerEnd = polarToCartesian(outerRadius, endAngle)
  const innerStart = polarToCartesian(innerRadius, startAngle)
  const innerEnd = polarToCartesian(innerRadius, endAngle)
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ")
}

export function StudentReportPerformanceChart(props: StudentReportPerformanceChartProps) {
  const { correctCount, percentage, questionCount, score, totalPoints, wrongCount } = props
  const { resolvedTheme } = useTheme()
  const safePercentage = Math.max(0, Math.min(100, percentage))
  const safeQuestionCount = Math.max(questionCount, 1)
  const correctRatio = Math.max(0, Math.min(correctCount / safeQuestionCount, 1))
  const wrongRatio = Math.max(0, Math.min(wrongCount / safeQuestionCount, 1 - correctRatio))
  const unansweredRatio = Math.max(0, 1 - correctRatio - wrongRatio)
  const correctEnd = START_ANGLE + correctRatio * 360
  const wrongEnd = correctEnd + wrongRatio * 360
  const unansweredEnd = wrongEnd + unansweredRatio * 360
  const isDark = resolvedTheme === "dark"

  const svgId = useId().replace(/:/g, "")
  const blueGradientId = `report_chart_blue_${svgId}`
  const orangeGradientId = `report_chart_orange_${svgId}`
  const greenGradientId = `report_chart_green_${svgId}`
  const innerRingGradientId = `report_chart_inner_${svgId}`
  const centerFilterId = `report_chart_center_filter_${svgId}`
  const greenShadowId = `report_chart_green_shadow_${svgId}`
  const orangeShadowId = `report_chart_orange_shadow_${svgId}`

  return (
    <div className="flex justify-center">
      <svg width="192" height="197" viewBox="0 0 192 197" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-[192px]">
        {unansweredRatio > 0 ? (
          <path d={buildDonutPath(wrongEnd, unansweredEnd, BLUE_OUTER_RADIUS, CENTER_RADIUS)} fill={`url(#${blueGradientId})`} opacity="0.15" />
        ) : null}
        {wrongRatio > 0 ? (
          <path d={buildDonutPath(correctEnd, wrongEnd, ORANGE_OUTER_RADIUS, CENTER_RADIUS)} fill={`url(#${orangeGradientId})`} filter={`url(#${orangeShadowId})`} />
        ) : null}
        {correctRatio > 0 ? (
          <path d={buildDonutPath(START_ANGLE, correctEnd, GREEN_OUTER_RADIUS, CENTER_RADIUS)} fill={`url(#${greenGradientId})`} filter={`url(#${greenShadowId})`} />
        ) : null}

        <g filter={`url(#${centerFilterId})`}>
          <circle cx={CENTER_X} cy={CENTER_Y} r={CENTER_RADIUS} fill={isDark ? "#001933" : "#FFFFFF"} />
        </g>
        <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_HIGHLIGHT_RADIUS} stroke={`url(#${innerRingGradientId})`} strokeWidth="4.59882" transform={`rotate(165 ${CENTER_X} ${CENTER_Y})`} />

        <text x={CENTER_X} y="92" textAnchor="middle" fill={isDark ? "#F5FAFF" : "#003366"} fontSize="16" fontWeight="600">
          {`${score}/${totalPoints}`}
        </text>
        <text x={CENTER_X} y="110" textAnchor="middle" fill={isDark ? "#F9FAFB" : "#003366"} fillOpacity={isDark ? "0.8" : "0.72"} fontSize="12" fontWeight="400">
          {`Үнэлгээ ${safePercentage}%`}
        </text>

        <defs>
          <filter id={centerFilterId} x="24.6867" y="30.0351" width="136.651" height="136.651" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3.28487" />
            <feGaussianBlur stdDeviation="8.21218" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_report" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_report" result="shape" />
          </filter>
          <filter id={greenShadowId} x="0" y="0" width="192" height="197" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3.28487" />
            <feGaussianBlur stdDeviation="3.94185" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.529412 0 0 0 0 0.964706 0 0 0 0 0.576471 0 0 0 0.2 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_green" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_green" result="shape" />
          </filter>
          <filter id={orangeShadowId} x="0" y="0" width="192" height="197" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3.28487" />
            <feGaussianBlur stdDeviation="3.94185" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.984314 0 0 0 0 0.8 0 0 0 0 0.392157 0 0 0 0.2 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_orange" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_orange" result="shape" />
          </filter>
          <linearGradient id={blueGradientId} x1={CENTER_X} y1="22.8105" x2={CENTER_X} y2="167.34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7AD3FF" />
            <stop offset="1" stopColor="#4FBAF0" />
          </linearGradient>
          <linearGradient id={orangeGradientId} x1={CENTER_X} y1="9.95551" x2={CENTER_X} y2="180.195" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9364" />
            <stop offset="1" stopColor="#F25F33" />
          </linearGradient>
          <linearGradient id={greenGradientId} x1={CENTER_X} y1="4.41553" x2={CENTER_X} y2="185.736" gradientUnits="userSpaceOnUse">
            <stop stopColor="#99FFA3" />
            <stop offset="1" stopColor="#68EE76" />
          </linearGradient>
          <linearGradient id={innerRingGradientId} x1="63.2472" y1="56.5672" x2="122.124" y2="131.93" gradientUnits="userSpaceOnUse">
            <stop stopColor="#007FFF" stopOpacity="0" />
            <stop offset="0.514211" stopColor="#007FFF" stopOpacity="0.3" />
            <stop offset="1" stopColor="#007FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
