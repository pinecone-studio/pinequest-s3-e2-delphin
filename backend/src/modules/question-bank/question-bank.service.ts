import { BadRequestException, Injectable } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import type {
  CreateQuestionBankCategoryDto,
  CreateQuestionBankQuestionSetDto,
  QuestionBankCategory,
  QuestionBankDifficulty,
  QuestionBankQuestion,
  QuestionBankTopic,
} from './question-bank.types';

type StoredCategory = {
  id: string;
  name: string;
  createdAt: string;
};

type StoredTopic = {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
};

type StoredQuestion = {
  id: string;
  topicId: string;
  type: QuestionBankQuestion['type'];
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: QuestionBankDifficulty;
  createdAt: string;
};

type LocalQuestionBankStore = {
  categories: StoredCategory[];
  topics: StoredTopic[];
  questions: StoredQuestion[];
};

type QuestionSeed = {
  correctAnswer?: string;
  difficulty: QuestionBankDifficulty;
  options?: string[];
  points: number;
  question: string;
  type: QuestionBankQuestion['type'];
};

type TopicSeed = {
  name: string;
  questions: QuestionSeed[];
};

type CategorySeed = {
  name: string;
  topics: TopicSeed[];
};

const DEFAULT_QUESTION_BANK_SEED: CategorySeed[] = [
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
            question:
              '3x - 4 = 17 бол бодолтын алхмаа богино тайлбартай бичээд x-ийн утгыг ол.',
            correctAnswer: 'x = 7',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              'Квадрат тэгшитгэлийг ялгавар ашиглан бодох аргыг жишээтэй тайлбарла.',
            correctAnswer:
              'Ялгавар D = b² - 4ac-г олж, язгуурын томьёо ашиглана.',
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
            question:
              'y = x² функцийн график нь доошоо нээгдсэн парабол байдаг.',
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
            question:
              'Радиус нь 5 см тойргийн талбайг π-ээр илэрхийл.',
            correctAnswer: '25π',
            points: 8,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              'Пифагорын теоремыг ашиглан бодлого бодох ерөнхий дарааллыг тайлбарла.',
            correctAnswer:
              'Тэгш өнцөгт гурвалжны талуудыг таньж, a² + b² = c² томьёог хэрэглэнэ.',
            points: 10,
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
            question:
              '4, 7, 7, 9, 13 өгөгдлийн медианыг ол.',
            correctAnswer: '7',
            points: 8,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: 'Тооцоо ба уламжлалын суурь',
        questions: [
          {
            type: 'multiple-choice',
            question: 'f(x) = x³ функцийн уламжлал аль нь вэ?',
            options: ['x²', '2x', '3x²', '3x'],
            correctAnswer: '3x²',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              'f(x) = 5x² - 2x функцийн уламжлалыг бич.',
            correctAnswer: '10x - 2',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              'Уламжлалын бодит амьдрал дахь хэрэглээнээс нэг жишээ авч тайлбарла.',
            correctAnswer:
              'Хурдны агшин зуурын өөрчлөлтийг уламжлалаар илэрхийлж болно.',
            points: 12,
            difficulty: 'hard',
          },
        ],
      },
    ],
  },
];

@Injectable()
export class QuestionBankService {
  private readonly localStorePath = resolve(
    process.cwd(),
    '.data',
    'question-bank.json',
  );
  private localStoreLoaded = false;
  private localStore: LocalQuestionBankStore = {
    categories: [],
    topics: [],
    questions: [],
  };

  async findAll(): Promise<QuestionBankCategory[]> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      return this.buildSnapshot();
    }, 'Failed to list question bank records');
  }

  async createCategory(
    payload: CreateQuestionBankCategoryDto,
  ): Promise<QuestionBankCategory> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      const name = payload.name.trim();

      if (!name) {
        throw new BadRequestException('Category name is required');
      }

      const existingCategory = this.localStore.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );

      if (existingCategory) {
        return {
          ...existingCategory,
          topics:
            this.buildSnapshot().find(
              (category) => category.id === existingCategory.id,
            )?.topics ?? [],
        };
      }

      const createdCategory: StoredCategory = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
      };

      this.localStore.categories.push(createdCategory);
      await this.persistLocalStore();

      return {
        ...createdCategory,
        topics: [],
      };
    }, `Failed to create question bank category ${payload.name}`);
  }

  async createQuestionSet(
    payload: CreateQuestionBankQuestionSetDto,
  ): Promise<QuestionBankTopic> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      const category = this.localStore.categories.find(
        (entry) => entry.id === payload.categoryId,
      );

      if (!category) {
        throw new BadRequestException('Choose a valid category');
      }

      const topicName = payload.topicName.trim();
      if (!topicName) {
        throw new BadRequestException('Topic name is required');
      }

      if (!payload.questions.length) {
        throw new BadRequestException('Add at least one question');
      }

      const existingTopic = this.localStore.topics.find(
        (topic) =>
          topic.categoryId === payload.categoryId &&
          topic.name.toLowerCase() === topicName.toLowerCase(),
      );

      const topicRecord: StoredTopic =
        existingTopic ??
        (() => {
          const createdTopic: StoredTopic = {
            id: crypto.randomUUID(),
            categoryId: payload.categoryId,
            name: topicName,
            createdAt: new Date().toISOString(),
          };
          this.localStore.topics.push(createdTopic);
          return createdTopic;
        })();

      const createdQuestions = payload.questions.map((question) => {
        const prompt = question.question.trim();
        if (!prompt) {
          throw new BadRequestException('Each question needs prompt text');
        }

        return {
          id: crypto.randomUUID(),
          topicId: topicRecord.id,
          type: question.type,
          question: prompt,
          options: question.options?.map((option) => option.trim()),
          correctAnswer: question.correctAnswer?.trim() || undefined,
          points: question.points,
          difficulty: payload.difficulty,
          createdAt: new Date().toISOString(),
        } satisfies StoredQuestion;
      });

      this.localStore.questions.push(...createdQuestions);
      await this.persistLocalStore();

      return this.buildTopic(topicRecord);
    }, `Failed to create question set for topic ${payload.topicName}`);
  }

  private buildSnapshot(): QuestionBankCategory[] {
    return this.localStore.categories
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((category) => ({
        ...category,
        topics: this.localStore.topics
          .filter((topic) => topic.categoryId === category.id)
          .sort((left, right) => left.name.localeCompare(right.name))
          .map((topic) => this.buildTopic(topic)),
      }));
  }

  private buildTopic(topic: StoredTopic): QuestionBankTopic {
    return {
      ...topic,
      questions: this.localStore.questions
        .filter((question) => question.topicId === topic.id)
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
    };
  }

  private async ensureLocalStoreLoaded(): Promise<void> {
    if (this.localStoreLoaded) {
      return;
    }

    try {
      const rawContent = await readFile(this.localStorePath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<LocalQuestionBankStore>;

      this.localStore = {
        categories: parsed.categories ?? [],
        topics: parsed.topics ?? [],
        questions: parsed.questions ?? [],
      };
      const didSeedDefaults = this.ensureDefaultMathQuestionBank();
      this.localStoreLoaded = true;
      if (didSeedDefaults) {
        await this.persistLocalStore();
      }
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        this.ensureDefaultMathQuestionBank();
        this.localStoreLoaded = true;
        await this.persistLocalStore();
        return;
      }

      rethrowAsInternal(
        error,
        `Failed to load question bank records from ${this.localStorePath}`,
      );
    }
  }

  private async persistLocalStore(): Promise<void> {
    try {
      await mkdir(dirname(this.localStorePath), { recursive: true });
      await writeFile(
        this.localStorePath,
        JSON.stringify(this.localStore, null, 2),
        'utf8',
      );
    } catch (error) {
      rethrowAsInternal(
        error,
        `Failed to persist question bank records to ${this.localStorePath}`,
      );
    }
  }

  private ensureDefaultMathQuestionBank() {
    const hasMathCategory = this.localStore.categories.some(
      (category) => category.name.trim().toLowerCase() === 'математик',
    );

    if (hasMathCategory) {
      return false;
    }

    const createdAt = new Date().toISOString();

    DEFAULT_QUESTION_BANK_SEED.forEach((categorySeed) => {
      const categoryId = crypto.randomUUID();
      this.localStore.categories.push({
        id: categoryId,
        name: categorySeed.name,
        createdAt,
      });

      categorySeed.topics.forEach((topicSeed) => {
        const topicId = crypto.randomUUID();
        this.localStore.topics.push({
          id: topicId,
          categoryId,
          name: topicSeed.name,
          createdAt,
        });

        topicSeed.questions.forEach((questionSeed) => {
          this.localStore.questions.push({
            id: crypto.randomUUID(),
            topicId,
            type: questionSeed.type,
            question: questionSeed.question,
            options: questionSeed.options,
            correctAnswer: questionSeed.correctAnswer,
            points: questionSeed.points,
            difficulty: questionSeed.difficulty,
            createdAt,
          });
        });
      });
    });

    return true;
  }
}
