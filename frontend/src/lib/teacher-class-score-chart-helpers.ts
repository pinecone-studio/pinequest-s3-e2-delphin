import type { ExamResult, Student } from "@/lib/mock-data-types"
import { getAwardedPoints, normalizeExamDifficulty, type ExamDifficultyBucket } from "@/lib/teacher-class-detail"
import type { TeacherExam } from "@/lib/teacher-exams"
import type { ExamQualityChartModel, ExamQualityChartPoint, TeacherClassSummaryRow } from "@/lib/teacher-class-score-chart-data"

export type DifficultyAccumulator = Record<ExamDifficultyBucket, { earned: number; possible: number }>

export const DIFFICULTY_META: Record<ExamDifficultyBucket, { accent: string; label: string }> = {
  easy: { accent: "#8ed8b9", label: "Хөнгөн" },
  medium: { accent: "#8cb2ff", label: "Дунд" },
  hard: { accent: "#f3b2c7", label: "Хүнд" },
}

export function createDifficultyAccumulator(): DifficultyAccumulator {
  return {
    easy: { earned: 0, possible: 0 },
    medium: { earned: 0, possible: 0 },
    hard: { earned: 0, possible: 0 },
  }
}

export function toPercent(earned: number, possible: number) {
  if (possible <= 0) return null
  return Math.round((earned / possible) * 100)
}

export function formatPercent(value: number | null) {
  return value === null ? "—" : `${value}%`
}

export function chooseBucketMode(exam: TeacherExam): "topic" | "category" {
  const categoryCount = new Set(
    exam.questions.map((question) => question.categoryName?.trim()).filter(Boolean),
  ).size
  const normalizedTitle = exam.title.toLowerCase()
  const largeExamKeywords = ["term", "final", "promotion", "нэгдсэн", "улирал"]

  return exam.questions.length >= 9 ||
    categoryCount >= 3 ||
    largeExamKeywords.some((keyword) => normalizedTitle.includes(keyword))
    ? "category"
    : "topic"
}

export function createEmptyExamQualityChartModel(): ExamQualityChartModel {
  return {
    bucketLabel: "topic",
    bucketLabelText: "Сэдэв",
    data: [],
    difficultyRows: buildEmptyDifficultyRows(),
    difficultySparklineValues: [0, 0, 0],
    headlineValue: "—",
    hasData: false,
    bestBucket: null,
    mostMissedBucket: null,
    overallAverage: null,
    summaryRows: [
      { accent: "#9bb0ff", label: "X тэнхлэг", value: "Сэдэв" },
      { accent: "#f3b2c7", label: "Хамгийн сул", value: "—" },
      { accent: "#8ed8b9", label: "Хамгийн сайн", value: "—" },
    ],
    topicSparklineValues: [0, 0, 0],
    totalStudents: 0,
    yAxisTicks: [0, 25, 50, 75, 100],
  }
}

export function buildRelevantResults(exam: TeacherExam | null, results: ExamResult[], students: Student[]) {
  if (!exam) return []
  const studentIds = new Set(students.map((student) => student.id))
  return results.filter((result) => studentIds.has(result.studentId))
}

export function applyQuestionResult(
  bucket: { difficulties: DifficultyAccumulator; overall: { earned: number; possible: number } },
  question: TeacherExam["questions"][number],
  answer: ExamResult["answers"][number] | undefined,
) {
  const difficulty = normalizeExamDifficulty(question.difficulty)
  const awardedPoints = getAwardedPoints(question.points, answer)
  bucket.difficulties[difficulty].earned += awardedPoints
  bucket.difficulties[difficulty].possible += question.points
  bucket.overall.earned += awardedPoints
  bucket.overall.possible += question.points
}

export function getBucketKey(question: TeacherExam["questions"][number], bucketMode: "topic" | "category") {
  return (
    (bucketMode === "topic" ? question.topicName : question.categoryName)?.trim() ||
    question.topicName?.trim() ||
    question.categoryName?.trim() ||
    "Тодорхойгүй"
  )
}

export function buildExamQualityChartPoint(bucket: {
  key: string
  label: string
  difficulties: DifficultyAccumulator
}): ExamQualityChartPoint {
  return {
    bucketKey: bucket.key,
    bucketLabel: bucket.label,
    easyRatio: toPercent(bucket.difficulties.easy.earned, bucket.difficulties.easy.possible),
    mediumRatio: toPercent(bucket.difficulties.medium.earned, bucket.difficulties.medium.possible),
    hardRatio: toPercent(bucket.difficulties.hard.earned, bucket.difficulties.hard.possible),
    easyEarned: bucket.difficulties.easy.earned,
    easyPossible: bucket.difficulties.easy.possible,
    mediumEarned: bucket.difficulties.medium.earned,
    mediumPossible: bucket.difficulties.medium.possible,
    hardEarned: bucket.difficulties.hard.earned,
    hardPossible: bucket.difficulties.hard.possible,
  }
}

export function buildChartTotals(data: ExamQualityChartPoint[]) {
  return data.reduce(
    (accumulator, bucket) => {
      accumulator.easy.earned += bucket.easyEarned
      accumulator.easy.possible += bucket.easyPossible
      accumulator.medium.earned += bucket.mediumEarned
      accumulator.medium.possible += bucket.mediumPossible
      accumulator.hard.earned += bucket.hardEarned
      accumulator.hard.possible += bucket.hardPossible
      accumulator.overall.earned += bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned
      accumulator.overall.possible += bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible
      return accumulator
    },
    {
      easy: { earned: 0, possible: 0 },
      medium: { earned: 0, possible: 0 },
      hard: { earned: 0, possible: 0 },
      overall: { earned: 0, possible: 0 },
    },
  )
}

export function buildDifficultyRows(totals: ReturnType<typeof buildChartTotals>): TeacherClassSummaryRow[] {
  return (["easy", "medium", "hard"] as const).map((difficulty) => ({
    accent: DIFFICULTY_META[difficulty].accent,
    label: `${DIFFICULTY_META[difficulty].label} дундаж`,
    value: formatPercent(toPercent(totals[difficulty].earned, totals[difficulty].possible)),
  }))
}

export function buildBucketInsights(data: ExamQualityChartPoint[]) {
  const ratios = data
    .map((bucket) => ({
      label: bucket.bucketLabel,
      ratio: toPercent(
        bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned,
        bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible,
      ),
    }))
    .filter((bucket): bucket is { label: string; ratio: number } => bucket.ratio !== null)

  return {
    bestBucket: ratios.length ? ratios.reduce((highest, current) => (current.ratio > highest.ratio ? current : highest)) : null,
    mostMissedBucket: ratios.length ? ratios.reduce((lowest, current) => (current.ratio < lowest.ratio ? current : lowest)) : null,
    topicSparklineValues: data.map((bucket) =>
      toPercent(
        bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned,
        bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible,
      ) ?? 0,
    ),
  }
}

function buildEmptyDifficultyRows(): TeacherClassSummaryRow[] {
  return [
    { accent: DIFFICULTY_META.easy.accent, label: "Хөнгөн дундаж", value: "—" },
    { accent: DIFFICULTY_META.medium.accent, label: "Дунд дундаж", value: "—" },
    { accent: DIFFICULTY_META.hard.accent, label: "Хүнд дундаж", value: "—" },
  ]
}
