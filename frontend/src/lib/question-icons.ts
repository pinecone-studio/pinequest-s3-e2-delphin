import type { ExamQuestionIconKey } from "@/lib/mock-data-types"

export const DEFAULT_EXAM_QUESTION_ICON_KEY: ExamQuestionIconKey = "general"

const QUESTION_ICON_META: Record<
  ExamQuestionIconKey,
  { alt: string; src: string }
> = {
  general: {
    alt: "General question icon",
    src: "/question-icon-general.svg",
  },
  logic: {
    alt: "Logic question icon",
    src: "/question-icon-logic.svg",
  },
  analysis: {
    alt: "Analysis question icon",
    src: "/question-icon-analysis.svg",
  },
  creative: {
    alt: "Creative question icon",
    src: "/question-icon-creative.svg",
  },
}

const ICON_KEYWORDS: Array<{
  iconKey: ExamQuestionIconKey
  keywords: string[]
}> = [
  {
    iconKey: "logic",
    keywords: [
      "true",
      "false",
      "match",
      "matching",
      "order",
      "ordering",
      "sequence",
      "logic",
      "compare",
      "ratio",
      "equation",
    ],
  },
  {
    iconKey: "analysis",
    keywords: [
      "graph",
      "chart",
      "data",
      "table",
      "analyze",
      "analysis",
      "probability",
      "statistics",
      "measure",
      "report",
    ],
  },
  {
    iconKey: "creative",
    keywords: [
      "write",
      "essay",
      "explain",
      "describe",
      "reason",
      "story",
      "design",
      "draw",
      "opinion",
      "summary",
    ],
  },
]

export function normalizeExamQuestionIconKey(
  iconKey?: string,
): ExamQuestionIconKey {
  if (iconKey && iconKey in QUESTION_ICON_META) {
    return iconKey as ExamQuestionIconKey
  }

  return DEFAULT_EXAM_QUESTION_ICON_KEY
}

export function getExamQuestionIconSrc(iconKey?: string) {
  return QUESTION_ICON_META[normalizeExamQuestionIconKey(iconKey)].src
}

export function getExamQuestionIconAlt(iconKey?: string) {
  return QUESTION_ICON_META[normalizeExamQuestionIconKey(iconKey)].alt
}

export function pickQuestionIconKey(args: {
  categoryName?: string
  difficulty?: string
  question?: string
  topicName?: string
  type?: string
}): ExamQuestionIconKey {
  const haystack = [
    args.question,
    args.categoryName,
    args.topicName,
    args.type,
    args.difficulty,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (!haystack) {
    return DEFAULT_EXAM_QUESTION_ICON_KEY
  }

  for (const entry of ICON_KEYWORDS) {
    if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
      return entry.iconKey
    }
  }

  if (args.type === "short-answer" || args.type === "fill") {
    return "creative"
  }

  if (args.type === "matching" || args.type === "ordering") {
    return "logic"
  }

  return DEFAULT_EXAM_QUESTION_ICON_KEY
}
