export const teacherClassChartYAxisLabels = [
  "IX бүлэг",
  "VIII бүлэг",
  "VII бүлэг",
  "VI бүлэг",
  "V бүлэг",
  "IV бүлэг",
  "III бүлэг",
  "II бүлэг",
  "I бүлэг",
]

export const teacherClassChartXAxisLabels = [
  { points: "1 оноо", range: "1-5" },
  { points: "1 оноо", range: "6-10" },
  { points: "2 оноо", range: "11-15" },
  { points: "2 оноо", range: "16-20" },
  { points: "2 оноо", range: "21-25" },
  { points: "3 оноо", range: "26-30" },
  { points: "3 оноо", range: "31-35" },
  { points: "3 оноо", range: "36-40" },
  { points: "10 оноо", range: "40-41" },
  { points: "10 оноо", range: "42-45" },
]

export const teacherClassChartSeries = [
  {
    color: "#f27fb0",
    points: [
      [0, 6.9],
      [1, 6.5],
      [2, 5.9],
      [3, 5.3],
      [4, 5.4],
      [5, 4.7],
      [6, 4.2],
      [7, 4.0],
      [8, 3.3],
      [9, 3.1],
    ],
  },
  {
    color: "#6fd1e7",
    points: [
      [0, 7.1],
      [1, 6.4],
      [2, 6.1],
      [3, 5.8],
      [4, 5.0],
      [5, 4.5],
      [6, 5.1],
      [7, 5.3],
      [8, 4.6],
      [9, 4.2],
    ],
  },
  {
    color: "#f2b58f",
    points: [
      [0, 6.8],
      [1, 6.2],
      [2, 5.6],
      [3, 5.9],
      [4, 5.5],
      [5, 4.9],
      [6, 4.7],
      [7, 5.2],
      [8, 5.0],
      [9, 4.7],
    ],
  },
] as const

export const teacherClassChartHighlightBubbles = [
  { bg: "#ffffff", dot: "#f2b58f", text: "6.987", x: 40, y: 38 },
  { bg: "#ffffff", dot: "#f27fb0", text: "7.357", x: 52, y: 10 },
  { bg: "#ffffff", dot: "#6fd1e7", text: "3.43", x: 63, y: 44 },
]

export type TeacherClassSummaryRow = {
  accent: string
  label: string
  value: string
}

export const teacherClassDifficultyRows: TeacherClassSummaryRow[] = [
  { accent: "#77c98a", label: "Хөнгөн", value: "+82%" },
  { accent: "#f4b56f", label: "Дунд", value: "+59%" },
  { accent: "#ef6f76", label: "Хүнд", value: "+32%" },
]

export const teacherClassTopicRows: TeacherClassSummaryRow[] = [
  { accent: "#5b8cff", label: "1-р бүлэг 1.1-1.5", value: "+72%" },
  { accent: "#67c7a3", label: "2-р бүлэг 2.5-2.8", value: "+82%" },
  { accent: "#ef8b89", label: "3-р бүлэг 3.4-3.8", value: "+59%" },
]
