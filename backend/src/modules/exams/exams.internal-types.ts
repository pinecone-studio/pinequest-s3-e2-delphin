import { resolve } from 'node:path';
import type { DatabaseService } from '../../database/database.service';

export type ExamRecord = {
  id: string;
  title: string;
  durationMinutes: number;
  reportReleaseMode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ExamQuestionRecord = {
  id: string;
  examId: string;
  type: string;
  prompt: string;
  optionsJson: string | null;
  correctAnswer: string | null;
  iconKey: string | null;
  points: number;
  displayOrder: number;
};

export type ExamScheduleRecord = {
  id: string;
  examId: string;
  classId: string;
  scheduledDate: string;
  scheduledTime: string;
};

export type LocalExamStore = {
  exams: ExamRecord[];
  questions: ExamQuestionRecord[];
  schedules: ExamScheduleRecord[];
};

export type ExamsStoreContext = {
  databaseService: DatabaseService;
  localStorePath: string;
  localStoreLoaded: boolean;
  localStore: LocalExamStore;
};

export function createExamsStoreContext(
  databaseService: DatabaseService,
): ExamsStoreContext {
  return {
    databaseService,
    localStorePath: resolve(process.cwd(), '.data', 'exams.json'),
    localStoreLoaded: false,
    localStore: { exams: [], questions: [], schedules: [] },
  };
}
