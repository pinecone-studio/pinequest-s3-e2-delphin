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

export const DEFAULT_QUESTION_BANK_SEED: CategorySeed[] = [
  {
    name: 'Математик',
    topics: [
      {
        name: 'Алгебр',
        questions: [
          {
            type: 'multiple-choice',
            question: '2x + 7 = 19 тэгшитгэлийг бодоход x хэд вэ?',
            options: ['5', '6', '7', '8'],
            correctAnswer: '6',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: '3x - 4 = 17 бол x-ийн утгыг ол.',
            correctAnswer: '7',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              'Квадрат тэгшитгэлийг ялгавар ашиглан бодох алхмуудыг товч бич.',
            correctAnswer: 'D = b² - 4ac-г олж язгуурын томьёо хэрэглэнэ.',
            points: 12,
            difficulty: 'hard',
          },
        ],
      },
      {
        name: 'Функц ба график',
        questions: [
          {
            type: 'multiple-choice',
            question: 'y = 2x + 1 функцийн налалт хэд вэ?',
            options: ['1', '2', '-1', '0'],
            correctAnswer: '2',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: 'y = x² функцийн график нь доошоо нээгдсэн парабол байдаг.',
            correctAnswer: 'false',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              'f(x) = x² - 4x + 3 функцийн оройн цэгийн x координатыг ол.',
            correctAnswer: '2',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: 'Геометр',
        questions: [
          {
            type: 'multiple-choice',
            question:
              'Тэгш өнцөгт гурвалжны катетууд 6 ба 8 бол гипотенуз хэд вэ?',
            options: ['10', '12', '14', '16'],
            correctAnswer: '10',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: 'Радиус нь 5 см тойргийн талбайг π-ээр илэрхийл.',
            correctAnswer: '25π',
            points: 8,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: 'Магадлал ба статистик',
        questions: [
          {
            type: 'multiple-choice',
            question:
              'Шударга шоо нэг удаа хаяхад тэгш тоо буух магадлал хэд вэ?',
            options: ['1/6', '1/3', '1/2', '2/3'],
            correctAnswer: '1/2',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question:
              'Өгөгдлийн дундаж утга нь медиантай заавал тэнцүү байдаг.',
            correctAnswer: 'false',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: '4, 7, 7, 9, 13 өгөгдлийн медианыг ол.',
            correctAnswer: '7',
            points: 8,
            difficulty: 'standard',
          },
        ],
      },
    ],
  },
];

export const LEGACY_DEFAULT_CATEGORY_NAMES = [
  'ÐœÐ°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸Ðº',
  '1-Ñ€ Ð±Ò¯Ð»ÑÐ³ - Ð‘Ò¯Ñ…ÑÐ» Ñ‚Ð¾Ð¾',
  '2-Ñ€ Ð±Ò¯Ð»ÑÐ³ - Ð‘ÑƒÑ‚Ð°Ñ€Ñ…Ð°Ð¹',
];
