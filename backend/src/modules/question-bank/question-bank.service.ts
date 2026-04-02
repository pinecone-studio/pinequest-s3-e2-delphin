import { BadRequestException, Injectable } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  buildQuestionBankSnapshot,
  buildQuestionBankTopic,
  loadQuestionBankStore,
  persistQuestionBankStore,
} from './question-bank.store';
import type {
  StoredQuestion,
  StoredTopic,
} from './question-bank.internal-types';
import type {
  CreateQuestionBankCategoryDto,
  CreateQuestionBankQuestionSetDto,
  QuestionBankCategory,
  QuestionBankTopic,
} from './question-bank.types';

@Injectable()
export class QuestionBankService {
  async findAll(): Promise<QuestionBankCategory[]> {
    return executeOrRethrowAsync(
      async () => buildQuestionBankSnapshot(await loadQuestionBankStore()),
      'Failed to list question bank records',
    );
  }

  async createCategory(
    payload: CreateQuestionBankCategoryDto,
  ): Promise<QuestionBankCategory> {
    return executeOrRethrowAsync(async () => {
      const store = await loadQuestionBankStore();
      const name = payload.name.trim();
      if (!name) throw new BadRequestException('Category name is required');

      const existingCategory = store.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );
      if (existingCategory) {
        return {
          ...existingCategory,
          topics:
            buildQuestionBankSnapshot(store).find(
              (category) => category.id === existingCategory.id,
            )?.topics ?? [],
        };
      }

      const createdCategory = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
      };
      store.categories.push(createdCategory);
      await persistQuestionBankStore(store);
      return { ...createdCategory, topics: [] };
    }, `Failed to create question bank category ${payload.name}`);
  }

  async createQuestionSet(
    payload: CreateQuestionBankQuestionSetDto,
  ): Promise<QuestionBankTopic> {
    return executeOrRethrowAsync(async () => {
      const store = await loadQuestionBankStore();
      const category = store.categories.find(
        (entry) => entry.id === payload.categoryId,
      );
      if (!category) throw new BadRequestException('Choose a valid category');

      const topicName = payload.topicName.trim();
      if (!topicName) throw new BadRequestException('Topic name is required');
      if (!payload.questions.length)
        throw new BadRequestException('Add at least one question');

      const existingTopic = store.topics.find(
        (topic) =>
          topic.categoryId === payload.categoryId &&
          topic.name.toLowerCase() === topicName.toLowerCase(),
      );
      const topicRecord: StoredTopic = existingTopic ?? {
        id: crypto.randomUUID(),
        categoryId: payload.categoryId,
        name: topicName,
        createdAt: new Date().toISOString(),
      };
      if (!existingTopic) store.topics.push(topicRecord);

      const createdQuestions = payload.questions.map((question) =>
        this.createStoredQuestion(topicRecord.id, payload.difficulty, question),
      );
      store.questions.push(...createdQuestions);
      await persistQuestionBankStore(store);
      return buildQuestionBankTopic(store, topicRecord);
    }, `Failed to create question set for topic ${payload.topicName}`);
  }

  private createStoredQuestion(
    topicId: string,
    difficulty: CreateQuestionBankQuestionSetDto['difficulty'],
    question: CreateQuestionBankQuestionSetDto['questions'][number],
  ): StoredQuestion {
    const prompt = question.question.trim();
    if (!prompt) {
      throw new BadRequestException('Each question needs prompt text');
    }
    return {
      id: crypto.randomUUID(),
      topicId,
      type: question.type,
      question: prompt,
      options: question.options?.map((option) => option.trim()),
      correctAnswer: question.correctAnswer?.trim() || undefined,
      points: question.points,
      difficulty,
      createdAt: new Date().toISOString(),
    };
  }
}
