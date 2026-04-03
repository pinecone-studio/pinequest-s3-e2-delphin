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
    name: '1-р бүлэг - Бүхэл тоо',
    topics: [
      {
        name: '1.2 сэдэв - Үржих, хуваах үйлдэл',
        questions: [
          {
            type: 'multiple-choice',
            question: '(-6) x 4 илэрхийллийн хариу хэд вэ?',
            options: ['-24', '-10', '10', '24'],
            correctAnswer: '-24',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: 'Хоёр сөрөг бүхэл тоог үржүүлэхэд эерэг тоо гарна.',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: '36 : (-9) илэрхийллийг бод.',
            correctAnswer: '-4',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question: '(-48)-ыг 6-д хуваавал хэд гарах вэ?',
            correctAnswer: '-8',
            points: 12,
            difficulty: 'hard',
          },
        ],
      },
    ],
  },
  {
    name: '2-р бүлэг - Бутархай',
    topics: [
      {
        name: '2.1 сэдэв - Бутархай нэмэх, хасах',
        questions: [
          {
            type: 'multiple-choice',
            question: '1/4 + 2/4 нийлбэр хэд вэ?',
            options: ['3/4', '2/8', '1/2', '3/8'],
            correctAnswer: '3/4',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: '5/6 - 1/6 = 4/6 тэнцэтгэл зөв.',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: '3/5 + 1/10 илэрхийллийг ижил нэртэй болгоод бод.',
            correctAnswer: '7/10',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question: '7/8 - 3/8 ялгаврыг ол.',
            correctAnswer: '4/8 буюу 1/2',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: '2.2 сэдэв - Бутархай үржих, хуваах',
        questions: [
          {
            type: 'multiple-choice',
            question: '2/3 x 3/5 үржвэр хэд вэ?',
            options: ['2/5', '6/15', '5/6', '1'],
            correctAnswer: '2/5',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question: '1/2 : 1/4 = 2 тэнцэтгэл зөв.',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question: '4/9 x 3/4 үржвэрийг хамгийн энгийн хэлбэрт бич.',
            correctAnswer: '1/3',
            points: 8,
            difficulty: 'standard',
          },
          {
            type: 'multiple-choice',
            question: '3/7 : 9/14 илэрхийллийн хариу аль нь вэ?',
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

export const LEGACY_DEFAULT_CATEGORY_NAMES = ['Математик'];
