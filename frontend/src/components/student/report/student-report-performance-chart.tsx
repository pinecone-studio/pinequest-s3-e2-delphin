"use client"

import { useId } from "react"

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
const OUTER_RADIUS = 72.2672
const INNER_RADIUS = 51.901
const RING_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2
const RING_STROKE_WIDTH = OUTER_RADIUS - INNER_RADIUS
const START_ROTATION = -90

export function StudentReportPerformanceChart(props: StudentReportPerformanceChartProps) {
  const { correctCount, percentage, questionCount, score, totalPoints, wrongCount } = props
  const safePercentage = Math.max(0, Math.min(100, percentage))
  const safeQuestionCount = Math.max(questionCount, 1)
  const correctRatio = Math.max(0, Math.min(correctCount / safeQuestionCount, 1))
  const wrongRatio = Math.max(0, Math.min(wrongCount / safeQuestionCount, 1))
  const answeredRatio = Math.max(0, Math.min(correctRatio + wrongRatio, 1))
  const unansweredRatio = Math.max(0, 1 - answeredRatio)

  const correctLength = correctRatio * 100
  const wrongLength = wrongRatio * 100
  const unansweredLength = unansweredRatio * 100

  const svgId = useId().replace(/:/g, "")
  const backgroundGradientId = `report_chart_bg_${svgId}`
  const wrongGradientId = `report_chart_wrong_${svgId}`
  const correctGradientId = `report_chart_correct_${svgId}`
  const innerRingGradientId = `report_chart_inner_${svgId}`
  const centerFilterId = `report_chart_center_filter_${svgId}`

  return (
    <div className="flex justify-center">
      <svg
        width="192"
        height="197"
        viewBox="0 0 192 197"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-[192px]"
      >
        <circle opacity="0.15" cx={CENTER_X} cy={CENTER_Y} r={OUTER_RADIUS} fill={`url(#${backgroundGradientId})`} />

        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RING_RADIUS}
          fill="none"
          stroke={`url(#${correctGradientId})`}
          strokeWidth={RING_STROKE_WIDTH}
          strokeLinecap="butt"
          pathLength={100}
          transform={`rotate(${START_ROTATION} ${CENTER_X} ${CENTER_Y})`}
        />

        {unansweredLength > 0 ? (
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RING_RADIUS}
            fill="none"
            stroke={`url(#${backgroundGradientId})`}
            strokeWidth={RING_STROKE_WIDTH}
            strokeLinecap="butt"
            pathLength={100}
            strokeDasharray={`${unansweredLength} ${100 - unansweredLength}`}
            strokeDashoffset={-answeredRatio * 100}
            transform={`rotate(${START_ROTATION} ${CENTER_X} ${CENTER_Y})`}
          />
        ) : null}

        {wrongLength > 0 ? (
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RING_RADIUS}
            fill="none"
            stroke={`url(#${wrongGradientId})`}
            strokeWidth={RING_STROKE_WIDTH}
            strokeLinecap="butt"
            pathLength={100}
            strokeDasharray={`${wrongLength} ${100 - wrongLength}`}
            strokeDashoffset={-correctLength}
            transform={`rotate(${START_ROTATION} ${CENTER_X} ${CENTER_Y})`}
          />
        ) : null}

        <g filter={`url(#${centerFilterId})`}>
          <circle cx="93.0121" cy="95.0755" r="51.901" fill="white" />
        </g>

        <circle
          cx="92.6859"
          cy="94.8995"
          r="43.6888"
          transform="rotate(165 92.6859 94.8995)"
          stroke={`url(#${innerRingGradientId})`}
          strokeWidth="4.59882"
        />

        <text
          x="93"
          y="92"
          textAnchor="middle"
          fill="#003366"
          fontSize="15"
          fontWeight="700"
          letterSpacing="-0.02em"
        >
          {`${score}/${totalPoints}`}
        </text>
        <text x="93" y="110" textAnchor="middle" fill="#003366" fillOpacity="0.8" fontSize="8.6" fontWeight="500">
          {`Үнэлгээ ${safePercentage}%`}
        </text>

        <defs>
          <filter
            id={centerFilterId}
            x="24.6867"
            y="30.0351"
            width="136.651"
            height="136.651"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="3.28487" />
            <feGaussianBlur stdDeviation="8.21218" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_report" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_report" result="shape" />
          </filter>

          <linearGradient id={backgroundGradientId} x1="93.0121" y1="22.8083" x2="93.0121" y2="167.343" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7AD3FF" />
            <stop offset="1" stopColor="#4FBAF0" />
          </linearGradient>
          <linearGradient id={wrongGradientId} x1="93.0024" y1="9.96704" x2="93.0024" y2="180.204" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9364" />
            <stop offset="1" stopColor="#F25F33" />
          </linearGradient>
          <linearGradient id={correctGradientId} x1="93.0121" y1="4.41296" x2="93.0121" y2="185.738" gradientUnits="userSpaceOnUse">
            <stop stopColor="#99FFA3" />
            <stop offset="1" stopColor="#68EE76" />
          </linearGradient>
          <linearGradient id={innerRingGradientId} x1="64.7645" y1="58.7659" x2="118.636" y2="127.748" gradientUnits="userSpaceOnUse">
            <stop stopColor="#007FFF" stopOpacity="0" />
            <stop offset="0.514211" stopColor="#007FFF" stopOpacity="0.3" />
            <stop offset="1" stopColor="#007FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
