import type { ExamQuestion } from "@/lib/mock-data";

export type MatchingChoice = {
  label: string;
  value: string;
};

export type MatchingRow = {
  left: string;
};

const MATCHING_SEPARATOR = "|||";

const FALLBACK_MATCHING_DESCRIPTIONS: Record<string, string> = {
  HTML: "Вэб хуудасны бүтцийг тодорхойлно",
  CSS: "Өнгө, хэмжээ, загварыг удирдана",
  SQL: "Өгөгдлийн сантай ажиллана",
  Git: "Хувилбарын түүхийг хөтөлнө",
};

export function parseMatchingSelections(value: string, length: number) {
  const parts = value.split(",").map((item) => item.trim());
  return Array.from({ length }, (_, index) => parts[index] ?? "");
}

export function buildMatchingSelections(value: string[]) {
  return value.join(",");
}

export function getMatchingConfig(question: ExamQuestion): {
  choices: MatchingChoice[];
  rows: MatchingRow[];
} {
  const options = question.options ?? [];
  const hasExplicitPairs = options.some((option) =>
    option.includes(MATCHING_SEPARATOR),
  );

  if (!hasExplicitPairs) {
    return {
      choices: options.map((option, index) => ({
        label:
          FALLBACK_MATCHING_DESCRIPTIONS[option] ??
          option ??
          `Choice ${index + 1}`,
        value: option || `choice-${index + 1}`,
      })),
      rows: options.map((option, index) => ({
        left: option || `Item ${index + 1}`,
      })),
    };
  }

  const parsed = options.map((option, index) => {
    const [left = "", right = ""] = option
      .split(MATCHING_SEPARATOR)
      .map((part) => part.trim());

    return {
      choice: {
        label: right || `Choice ${index + 1}`,
        value: String.fromCharCode(65 + index),
      },
      row: {
        left: left || `Item ${index + 1}`,
      },
    };
  });

  return {
    choices: parsed.map((entry) => entry.choice),
    rows: parsed.map((entry) => entry.row),
  };
}
