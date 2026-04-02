import type {
  LocalQuestionBankStore,
  StoredQuestion,
} from './question-bank.internal-types';
import {
  DEFAULT_QUESTION_BANK_SEED,
  LEGACY_DEFAULT_CATEGORY_NAMES,
  type QuestionSeed,
} from './question-bank.seed-data';

export function ensureDefaultMathQuestionBank(store: LocalQuestionBankStore) {
  const hasDemoCategories = DEFAULT_QUESTION_BANK_SEED.every((seed) =>
    store.categories.some(
      (category) =>
        category.name.trim().toLowerCase() === seed.name.trim().toLowerCase(),
    ),
  );
  if (hasDemoCategories) return false;
  const createdAt = new Date().toISOString();

  DEFAULT_QUESTION_BANK_SEED.forEach((categorySeed) => {
    const categoryId = crypto.randomUUID();
    store.categories.push({
      id: categoryId,
      name: categorySeed.name,
      createdAt,
    });
    categorySeed.topics.forEach((topicSeed) => {
      const topicId = crypto.randomUUID();
      store.topics.push({
        id: topicId,
        categoryId,
        name: topicSeed.name,
        createdAt,
      });
      topicSeed.questions.forEach((questionSeed) => {
        store.questions.push(
          createStoredQuestion(topicId, createdAt, questionSeed),
        );
      });
    });
  });

  return true;
}

export function replaceLegacyDefaultQuestionBank(
  store: LocalQuestionBankStore,
) {
  const legacyCategoryIds = new Set(
    store.categories
      .filter((category) =>
        LEGACY_DEFAULT_CATEGORY_NAMES.some(
          (legacyName) =>
            category.name.trim().toLowerCase() === legacyName.toLowerCase(),
        ),
      )
      .map((category) => category.id),
  );
  if (legacyCategoryIds.size === 0) return false;

  const legacyTopicIds = new Set(
    store.topics
      .filter((topic) => legacyCategoryIds.has(topic.categoryId))
      .map((topic) => topic.id),
  );
  store.categories = store.categories.filter(
    (category) => !legacyCategoryIds.has(category.id),
  );
  store.topics = store.topics.filter((topic) => !legacyTopicIds.has(topic.id));
  store.questions = store.questions.filter(
    (question) => !legacyTopicIds.has(question.topicId),
  );
  return ensureDefaultMathQuestionBank(store);
}

function createStoredQuestion(
  topicId: string,
  createdAt: string,
  questionSeed: QuestionSeed,
): StoredQuestion {
  return {
    id: crypto.randomUUID(),
    topicId,
    type: questionSeed.type,
    question: questionSeed.question,
    options: questionSeed.options,
    correctAnswer: questionSeed.correctAnswer,
    points: questionSeed.points,
    difficulty: questionSeed.difficulty,
    createdAt,
  };
}
