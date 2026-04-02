import type { ExamQuestion } from '@/lib/mock-data'

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'ordering'
  | 'short-answer'
  | 'fill'

export interface NewQuestion extends Omit<ExamQuestion, 'id'> {
  id: string
}

export type ScheduleEntry = {
  classId: string
  date: string
  time: string
}
