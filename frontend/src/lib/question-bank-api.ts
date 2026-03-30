import { fetchBackendJson, requestBackendJson } from '@/lib/backend-fetch'
import type { NewQuestion } from '@/components/teacher/exam-builder-types'

export type QuestionBankDifficulty = 'easy' | 'standard' | 'hard'

export type QuestionBankQuestion = {
  id: string
  topicId: string
  type: NewQuestion['type']
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
  difficulty: QuestionBankDifficulty
  createdAt: string
}

export type QuestionBankTopic = {
  id: string
  categoryId: string
  name: string
  createdAt: string
  questions: QuestionBankQuestion[]
}

export type QuestionBankCategory = {
  id: string
  name: string
  createdAt: string
  topics: QuestionBankTopic[]
}

export function getQuestionBank() {
  return fetchBackendJson<QuestionBankCategory[]>(
    '/question-bank',
    'Асуултын сангийн мэдээллийг ачаалж чадсангүй.',
  )
}

export function createQuestionBankCategory(name: string) {
  return requestBackendJson<QuestionBankCategory>('/question-bank/categories', {
    method: 'POST',
    body: { name },
    fallbackMessage: 'Ангилал үүсгэж чадсангүй.',
  })
}

export function createQuestionSet(payload: {
  categoryId: string
  topicName: string
  difficulty: QuestionBankDifficulty
  questions: NewQuestion[]
}) {
  return requestBackendJson<QuestionBankTopic>('/question-bank/question-sets', {
    method: 'POST',
    body: {
      categoryId: payload.categoryId,
      topicName: payload.topicName,
      difficulty: payload.difficulty,
      questions: payload.questions.map((question) => ({
        type: question.type,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: question.points,
      })),
    },
    fallbackMessage: 'Асуултуудыг хадгалж чадсангүй.',
  })
}
