import { resolve } from 'node:path';
import type {
  QuestionBankDifficulty,
  QuestionBankQuestion,
} from './question-bank.types';

export type StoredCategory = {
  id: string;
  name: string;
  createdAt: string;
};

export type StoredTopic = {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
};

export type StoredQuestion = {
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

export type LocalQuestionBankStore = {
  categories: StoredCategory[];
  topics: StoredTopic[];
  questions: StoredQuestion[];
};

export function createLocalQuestionBankStore(): LocalQuestionBankStore {
  return { categories: [], topics: [], questions: [] };
}

export function getQuestionBankStorePath() {
  return resolve(process.cwd(), '.data', 'question-bank.json');
}
