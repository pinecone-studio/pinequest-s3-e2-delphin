import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { rethrowAsInternal } from '../../common/error-handling';
import type {
  QuestionBankCategory,
  QuestionBankTopic,
} from './question-bank.types';
import {
  ensureDefaultMathQuestionBank,
  replaceLegacyDefaultQuestionBank,
} from './question-bank.seed';
import {
  createLocalQuestionBankStore,
  getQuestionBankStorePath,
  type LocalQuestionBankStore,
  type StoredTopic,
} from './question-bank.internal-types';

export async function loadQuestionBankStore() {
  const localStorePath = getQuestionBankStorePath();
  const localStore = createLocalQuestionBankStore();
  try {
    const rawContent = await readFile(localStorePath, 'utf8');
    const parsed = JSON.parse(rawContent) as Partial<LocalQuestionBankStore>;
    localStore.categories = parsed.categories ?? [];
    localStore.topics = parsed.topics ?? [];
    localStore.questions = parsed.questions ?? [];
    const didMigrateLegacySeed = replaceLegacyDefaultQuestionBank(localStore);
    const didSeedDefaults = ensureDefaultMathQuestionBank(localStore);
    if (didMigrateLegacySeed || didSeedDefaults) {
      await persistQuestionBankStore(localStore);
    }
    return localStore;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      ensureDefaultMathQuestionBank(localStore);
      await persistQuestionBankStore(localStore);
      return localStore;
    }
    rethrowAsInternal(
      error,
      `Failed to load question bank records from ${localStorePath}`,
    );
  }
}

export async function persistQuestionBankStore(store: LocalQuestionBankStore) {
  const localStorePath = getQuestionBankStorePath();
  try {
    await mkdir(dirname(localStorePath), { recursive: true });
    await writeFile(localStorePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (error) {
    rethrowAsInternal(
      error,
      `Failed to persist question bank records to ${localStorePath}`,
    );
  }
}

export function buildQuestionBankSnapshot(
  store: LocalQuestionBankStore,
): QuestionBankCategory[] {
  return store.categories
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((category) => ({
      ...category,
      topics: store.topics
        .filter((topic) => topic.categoryId === category.id)
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((topic) => buildQuestionBankTopic(store, topic)),
    }));
}

export function buildQuestionBankTopic(
  store: LocalQuestionBankStore,
  topic: StoredTopic,
): QuestionBankTopic {
  return {
    ...topic,
    questions: store.questions
      .filter((question) => question.topicId === topic.id)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
  };
}
