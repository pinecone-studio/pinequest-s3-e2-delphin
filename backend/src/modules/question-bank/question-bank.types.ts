export type QuestionBankQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'essay';

export type QuestionBankDifficulty = 'easy' | 'standard' | 'hard';

export type QuestionBankQuestion = {
  id: string;
  topicId: string;
  type: QuestionBankQuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: QuestionBankDifficulty;
  createdAt: string;
};

export type QuestionBankTopic = {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
  questions: QuestionBankQuestion[];
};

export type QuestionBankCategory = {
  id: string;
  name: string;
  createdAt: string;
  topics: QuestionBankTopic[];
};

export type CreateQuestionBankCategoryDto = {
  name: string;
};

export type CreateQuestionBankQuestionSetDto = {
  categoryId: string;
  topicName: string;
  difficulty: QuestionBankDifficulty;
  questions: Array<{
    type: QuestionBankQuestionType;
    question: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
  }>;
};
