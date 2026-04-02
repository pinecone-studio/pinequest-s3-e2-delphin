import type { ExamResult, Student } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import {
  applyQuestionResult,
  buildRelevantResults,
  buildBucketInsights,
  buildChartTotals,
  buildDifficultyRows,
  buildExamQualityChartPoint,
  chooseBucketMode,
  createDifficultyAccumulator,
  createEmptyExamQualityChartModel,
  formatPercent,
  getBucketKey,
  toPercent,
  type DifficultyAccumulator,
} from "@/lib/teacher-class-score-chart-helpers"

export type TeacherClassSummaryRow = {
  accent: string
  label: string
  value: string
}

export type ExamQualityChartPoint = {
  bucketKey: string
  bucketLabel: string
  easyRatio: number | null
  mediumRatio: number | null
  hardRatio: number | null
  easyEarned: number
  easyPossible: number
  mediumEarned: number
  mediumPossible: number
  hardEarned: number
  hardPossible: number
}

export type ExamQualityChartModel = {
  bucketLabel: "topic" | "category"
  bucketLabelText: string
  data: ExamQualityChartPoint[]
  difficultyRows: TeacherClassSummaryRow[]
  difficultySparklineValues: number[]
  headlineValue: string
  hasData: boolean
  bestBucket: { label: string; ratio: number } | null
  mostMissedBucket: { label: string; ratio: number } | null
  overallAverage: number | null
  summaryRows: TeacherClassSummaryRow[]
  topicSparklineValues: number[]
  totalStudents: number
  yAxisTicks: number[]
}

export function buildExamQualityChartModel(args: {
  exam: TeacherExam | null
  results: ExamResult[]
  students: Student[]
}): ExamQualityChartModel {
  const { exam, results, students } = args

  if (!exam) return createEmptyExamQualityChartModel()

  const relevantResults = buildRelevantResults(exam, results, students)
  const bucketMode = chooseBucketMode(exam)
  const bucketMap = new Map<
    string,
    {
      key: string
      label: string
      difficulties: DifficultyAccumulator
      overall: { earned: number; possible: number }
    }
  >()

  exam.questions.forEach((question) => {
    const bucketKey = getBucketKey(question, bucketMode)

    if (!bucketMap.has(bucketKey)) {
      bucketMap.set(bucketKey, {
        key: bucketKey,
        label: bucketKey,
        difficulties: createDifficultyAccumulator(),
        overall: { earned: 0, possible: 0 },
      })
    }
  })

  relevantResults.forEach((result) => {
    const answerMap = new Map(result.answers.map((answer) => [answer.questionId, answer]))

    exam.questions.forEach((question) => {
      const bucketKey = getBucketKey(question, bucketMode)
      const bucket = bucketMap.get(bucketKey)
      if (!bucket) return

      applyQuestionResult(bucket, question, answerMap.get(question.id))
    })
  })

  const data = Array.from(bucketMap.values()).map(buildExamQualityChartPoint)
  const totals = buildChartTotals(data)
  const difficultyRows = buildDifficultyRows(totals)
  const { bestBucket, mostMissedBucket, topicSparklineValues } = buildBucketInsights(data)
  const overallAverage = toPercent(totals.overall.earned, totals.overall.possible)

  return {
    bucketLabel: bucketMode,
    bucketLabelText: bucketMode === "topic" ? "Сэдэв" : "Ангилал",
    data,
    difficultyRows,
    difficultySparklineValues: [
      toPercent(totals.easy.earned, totals.easy.possible) ?? 0,
      toPercent(totals.medium.earned, totals.medium.possible) ?? 0,
      toPercent(totals.hard.earned, totals.hard.possible) ?? 0,
    ],
    headlineValue: formatPercent(overallAverage),
    hasData:
      relevantResults.length > 0 &&
      data.some(
        (bucket) =>
          bucket.easyRatio !== null ||
          bucket.mediumRatio !== null ||
          bucket.hardRatio !== null,
      ),
    bestBucket,
    mostMissedBucket,
    overallAverage,
    summaryRows: [
      { accent: "#9bb0ff", label: "X тэнхлэг", value: bucketMode === "topic" ? "Сэдэв" : "Ангилал" },
      {
        accent: "#f3b2c7",
        label: "Хамгийн сул",
        value: mostMissedBucket ? `${mostMissedBucket.label} · ${mostMissedBucket.ratio}%` : "—",
      },
      {
        accent: "#8ed8b9",
        label: "Хамгийн сайн",
        value: bestBucket ? `${bestBucket.label} · ${bestBucket.ratio}%` : "—",
      },
    ],
    topicSparklineValues,
    totalStudents: relevantResults.length,
    yAxisTicks: [0, 25, 50, 75, 100],
  }
}
