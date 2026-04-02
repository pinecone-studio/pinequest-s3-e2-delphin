import { resolve } from 'node:path';
import type { DatabaseService } from '../../database/database.service';

export type StudentExamAttemptStatus =
  | 'in_progress'
  | 'submitted'
  | 'tab_switched'
  | 'app_switched';

export type StudentExamAttempt = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  status: StudentExamAttemptStatus;
  startedAt: string;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertStudentExamAttemptDto = Omit<
  StudentExamAttempt,
  'id' | 'createdAt' | 'updatedAt'
>;

export type StudentExamAttemptFilters = {
  examId?: string;
  studentId?: string;
  classId?: string;
  status?: StudentExamAttemptStatus;
};

export type StudentExamAttemptRecord = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  status: StudentExamAttemptStatus;
  startedAt: string;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentExamAttemptStoreContext = {
  databaseService: DatabaseService;
  localStorePath: string;
  localStoreLoaded: boolean;
  localStore: { attempts: StudentExamAttemptRecord[] };
};

export function createStudentExamAttemptStoreContext(
  databaseService: DatabaseService,
): StudentExamAttemptStoreContext {
  return {
    databaseService,
    localStorePath: resolve(
      process.cwd(),
      '.data',
      'student-exam-attempts.json',
    ),
    localStoreLoaded: false,
    localStore: { attempts: [] },
  };
}
