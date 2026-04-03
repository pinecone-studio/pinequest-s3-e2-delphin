import type { ExamQuestionIconKey } from './exams.types';

export const DEFAULT_EXAM_QUESTION_ICON_KEY: ExamQuestionIconKey = 'general';

const ICON_KEYWORDS: Array<{
  iconKey: ExamQuestionIconKey;
  keywords: string[];
}> = [
  {
    iconKey: 'logic',
    keywords: [
      'true',
      'false',
      'match',
      'matching',
      'order',
      'ordering',
      'sequence',
      'logic',
      'compare',
      'ratio',
      'equation',
    ],
  },
  {
    iconKey: 'analysis',
    keywords: [
      'graph',
      'chart',
      'data',
      'table',
      'analyze',
      'analysis',
      'probability',
      'statistics',
      'measure',
      'report',
    ],
  },
  {
    iconKey: 'creative',
    keywords: [
      'write',
      'essay',
      'explain',
      'describe',
      'reason',
      'story',
      'design',
      'draw',
      'opinion',
      'summary',
    ],
  },
];

export function normalizeExamQuestionIconKey(
  value?: string | null,
): ExamQuestionIconKey {
  if (
    value === 'general' ||
    value === 'logic' ||
    value === 'analysis' ||
    value === 'creative'
  ) {
    return value;
  }

  return DEFAULT_EXAM_QUESTION_ICON_KEY;
}

export function safePickQuestionIconKey(args: {
  categoryName?: string;
  difficulty?: string;
  question?: string;
  topicName?: string;
  type?: string;
}): ExamQuestionIconKey {
  try {
    const haystack = [
      args.question,
      args.categoryName,
      args.topicName,
      args.type,
      args.difficulty,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (!haystack) {
      return DEFAULT_EXAM_QUESTION_ICON_KEY;
    }

    for (const entry of ICON_KEYWORDS) {
      if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
        return entry.iconKey;
      }
    }

    if (args.type === 'short-answer' || args.type === 'fill') {
      return 'creative';
    }

    if (args.type === 'matching' || args.type === 'ordering') {
      return 'logic';
    }

    return DEFAULT_EXAM_QUESTION_ICON_KEY;
  } catch {
    return DEFAULT_EXAM_QUESTION_ICON_KEY;
  }
}
