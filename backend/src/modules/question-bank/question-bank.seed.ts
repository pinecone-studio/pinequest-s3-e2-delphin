import type {
  LocalQuestionBankStore,
  StoredQuestion,
} from './question-bank.internal-types';
import {
  DEFAULT_QUESTION_BANK_SEED,
  LEGACY_DEFAULT_CATEGORY_NAME,
  LEGACY_DEFAULT_TOPIC_NAMES,
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
  const legacyCategory = store.categories.find(
    (category) =>
      category.name.trim().toLowerCase() ===
      LEGACY_DEFAULT_CATEGORY_NAME.toLowerCase(),
  );
  if (!legacyCategory) return false;

  const legacyTopics = store.topics.filter(
    (topic) => topic.categoryId === legacyCategory.id,
  );
  const hasOnlyLegacyTopics =
    legacyTopics.length === LEGACY_DEFAULT_TOPIC_NAMES.length &&
    LEGACY_DEFAULT_TOPIC_NAMES.every((name) =>
      legacyTopics.some(
        (topic) => topic.name.trim().toLowerCase() === name.toLowerCase(),
      ),
    );
  if (!hasOnlyLegacyTopics) return false;

  const legacyTopicIds = new Set(legacyTopics.map((topic) => topic.id));
  store.categories = store.categories.filter(
    (category) => category.id !== legacyCategory.id,
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
