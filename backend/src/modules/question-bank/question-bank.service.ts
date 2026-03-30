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
      this.localStoreLoaded = true;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        this.localStoreLoaded = true;
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
}
