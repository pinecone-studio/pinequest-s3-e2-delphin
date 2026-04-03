import { resolve } from 'node:path';
import type { DatabaseService } from '../../database/database.service';

export type StudentExamAnswer = {
  questionId: string;
  answer: string;
  isCorrect: boolean | null;
  awardedPoints?: number | null;
  reviewStatus?: 'auto-correct' | 'auto-wrong' | 'pending' | 'graded';
  explanation?: string;
};

export type StudentExamResult = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  answers: StudentExamAnswer[];
  score: number;
  totalPoints: number;
  status: 'submitted';
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStudentExamResultDto = Omit<
  StudentExamResult,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & { status?: 'submitted' };

export type StudentExamResultFilters = {
  examId?: string;
  studentId?: string;
  classId?: string;
};

export type StudentExamResultRecord = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  answersJson: string;
  score: number;
  totalPoints: number;
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentExamResultStoreContext = {
  databaseService: DatabaseService;
  localStorePath: string;
  localStoreLoaded: boolean;
  localStore: { results: StudentExamResultRecord[] };
};

export function createStudentExamResultStoreContext(
  databaseService: DatabaseService,
): StudentExamResultStoreContext {
  return {
    databaseService,
    localStorePath: resolve(
      process.cwd(),
      '.data',
      'student-exam-results.json',
    ),
    localStoreLoaded: false,
    localStore: { results: [] },
  };
}
