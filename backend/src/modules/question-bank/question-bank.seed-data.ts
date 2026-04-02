import type {
  QuestionBankDifficulty,
  QuestionBankQuestion,
} from './question-bank.types';

export type QuestionSeed = {
  type: QuestionBankQuestion['type'];
  question: string;
  points: number;
  difficulty: QuestionBankDifficulty;
  options?: string[];
  correctAnswer?: string;
};
export type TopicSeed = { name: string; questions: QuestionSeed[] };
export type CategorySeed = { name: string; topics: TopicSeed[] };

export const LEGACY_DEFAULT_CATEGORY_NAME = 'ÐœÐ°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸Ðº';
export const LEGACY_DEFAULT_TOPIC_NAMES = [
  'ÐÐ»Ð³ÐµÐ±Ñ€',
  'Ð¤ÑƒÐ½ÐºÑ† Ð±Ð° Ð³Ñ€Ð°Ñ„Ð¸Ðº',
  'Ð“ÐµÐ¾Ð¼ÐµÑ‚Ñ€',
  'ÐœÐ°Ð³Ð°Ð´Ð»Ð°Ð» Ð±Ð° ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸Ðº',
  'Ð¢Ð¾Ð¾Ñ†Ð¾Ð¾ Ð±Ð° ÑƒÐ»Ð°Ð¼Ð¶Ð»Ð°Ð»Ñ‹Ð½ ÑÑƒÑƒÑ€ÑŒ',
];

export const DEFAULT_QUESTION_BANK_SEED: CategorySeed[] = [
  {
    name: '1-Ñ€ Ð±Ò¯Ð»ÑÐ³ - Ð‘Ò¯Ñ…ÑÐ» Ñ‚Ð¾Ð¾',
    topics: [
      {
        name: '1.2 ÑÑÐ´ÑÐ² - Ò®Ñ€Ð¶Ð¸Ñ…, Ñ…ÑƒÐ²Ð°Ð°Ñ… Ò¯Ð¹Ð»Ð´ÑÐ»',
        questions: [
          {
            type: 'multiple-choice',
            question: '(-6) x 4 Ð¸Ð»ÑÑ€Ñ…Ð¸Ð¹Ð»Ð»Ð¸Ð¹Ð½ Ñ…Ð°Ñ€Ð¸Ñƒ Ñ…ÑÐ´ Ð²Ñ?',
            options: ['-24', '-10', '10', '24'],
            correctAnswer: '-24',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'multiple-choice',
            question: '36 : (-9) Ð¸Ð»ÑÑ€Ñ…Ð¸Ð¹Ð»Ð»Ð¸Ð¹Ð³ Ð±Ð¾Ð´.',
            options: ['-4', '-3', '3', '4'],
            correctAnswer: '-4',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'true-false',
            question:
              'Ð¥Ð¾Ñ‘Ñ€ ÑÓ©Ñ€Ó©Ð³ Ð±Ò¯Ñ…ÑÐ» Ñ‚Ð¾Ð¾Ð³ Ò¯Ñ€Ð¶Ò¯Ò¯Ð»ÑÑ…ÑÐ´ ÑÐµÑ€ÑÐ³ Ñ‚Ð¾Ð¾ Ð³Ð°Ñ€Ð½Ð°.',
            correctAnswer: 'true',
            points: 12,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '(-48)-Ñ‹Ð³ 6-Ð´ Ñ…ÑƒÐ²Ð°Ð°Ð²Ð°Ð» Ñ…ÑÐ´ Ð³Ð°Ñ€Ð°Ñ… Ð²Ñ? Ð‘Ð¾Ð´Ð¾Ð»Ñ‚Ð¾Ð¾ Ð±Ð¸Ñ‡.',
            correctAnswer: '-8',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
    ],
  },
  {
    name: '2-Ñ€ Ð±Ò¯Ð»ÑÐ³ - Ð‘ÑƒÑ‚Ð°Ñ€Ñ…Ð°Ð¹',
    topics: [
      {
        name: '2.1 ÑÑÐ´ÑÐ² - Ð‘ÑƒÑ‚Ð°Ñ€Ñ…Ð°Ð¹ Ð½ÑÐ¼ÑÑ…, Ñ…Ð°ÑÐ°Ñ…',
        questions: [
          {
            type: 'multiple-choice',
            question: '1/4 + 2/4 Ð½Ð¸Ð¹Ð»Ð±ÑÑ€ Ñ…ÑÐ´ Ð²Ñ?',
            options: ['3/4', '2/8', '1/2', '3/8'],
            correctAnswer: '3/4',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: '5/6 - 1/6 = 4/6 Ñ‚ÑÐ½Ñ†ÑÑ‚Ð³ÑÐ» Ð·Ó©Ð².',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '3/5 + 1/10 Ð¸Ð»ÑÑ€Ñ…Ð¸Ð¹Ð»Ð»Ð¸Ð¹Ð³ Ð¸Ð¶Ð¸Ð» Ð½ÑÑ€Ñ‚ÑÐ¹ Ð±Ð¾Ð»Ð³Ð¾Ð¾Ð´ Ð±Ð¾Ð´.',
            correctAnswer: '7/10',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question: '7/8 - 3/8 ÑÐ»Ð³Ð°Ð²Ñ€Ñ‹Ð³ Ð¾Ð».',
            correctAnswer: '4/8 Ð±ÑƒÑŽÑƒ 1/2',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: '2.2 ÑÑÐ´ÑÐ² - Ð‘ÑƒÑ‚Ð°Ñ€Ñ…Ð°Ð¹ Ò¯Ñ€Ð¶Ð¸Ñ…, Ñ…ÑƒÐ²Ð°Ð°Ñ…',
        questions: [
          {
            type: 'multiple-choice',
            question: '2/3 x 3/5 Ò¯Ñ€Ð¶Ð²ÑÑ€ Ñ…ÑÐ´ Ð²Ñ?',
            options: ['2/5', '6/15', '5/6', '1'],
            correctAnswer: '2/5',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: '1/2 : 1/4 = 2 Ñ‚ÑÐ½Ñ†ÑÑ‚Ð³ÑÐ» Ð·Ó©Ð².',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '4/9 x 3/4 Ò¯Ñ€Ð¶Ð²ÑÑ€Ð¸Ð¹Ð³ Ñ…Ð°Ð¼Ð³Ð¸Ð¹Ð½ ÑÐ½Ð³Ð¸Ð¹Ð½ Ñ…ÑÐ»Ð±ÑÑ€Ñ‚ Ð±Ð¸Ñ‡.',
            correctAnswer: '1/3',
            points: 8,
            difficulty: 'standard',
          },
          {
            type: 'multiple-choice',
            question:
              '3/7 : 9/14 Ð¸Ð»ÑÑ€Ñ…Ð¸Ð¹Ð»Ð»Ð¸Ð¹Ð½ Ñ…Ð°Ñ€Ð¸Ñƒ Ð°Ð»ÑŒ Ð½ÑŒ Ð²Ñ?',
            options: ['2/3', '3/2', '6/7', '7/6'],
            correctAnswer: '2/3',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
    ],
  },
];
