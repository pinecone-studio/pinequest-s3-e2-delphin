export const examQuestionTypes = [
  'multiple-choice',
  'true-false',
  'short-answer',
  'essay',
] as const;

export const examStatuses = ['draft', 'scheduled', 'completed'] as const;

export const reportReleaseModes = [
  'after-all-classes-complete',
  'immediately',
] as const;

export type ExamQuestionType = (typeof examQuestionTypes)[number];
export type ExamStatus = (typeof examStatuses)[number];
export type ReportReleaseMode = (typeof reportReleaseModes)[number];

export type ExamQuestion = {
  id: string;
  type: ExamQuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
};

export type ExamSchedule = {
  id: string;
  classId: string;
  date: string;
  time: string;
};

export type Exam = {
  id: string;
  title: string;
  durationMinutes: number;
  reportReleaseMode: ReportReleaseMode;
  status: ExamStatus;
  createdAt: string;
  updatedAt: string;
  questions: ExamQuestion[];
  schedules: ExamSchedule[];
};

export type CreateExamQuestionDto = Omit<ExamQuestion, 'id'>;
export type CreateExamScheduleDto = Omit<ExamSchedule, 'id'>;

export type CreateExamDto = {
  title: string;
  durationMinutes: number;
  reportReleaseMode: ReportReleaseMode;
  status: Extract<ExamStatus, 'draft' | 'scheduled'>;
  questions: CreateExamQuestionDto[];
  schedules: CreateExamScheduleDto[];
};

export type UpdateExamDto = Partial<
  Omit<CreateExamDto, 'questions' | 'schedules'>
> & {
  questions?: CreateExamQuestionDto[];
  schedules?: CreateExamScheduleDto[];
};

export type AIGenerateQuestionSourceFileDto = {
  name: string;
  startPage: number;
  endPage: number;
};

export type AIGenerateQuestionsDto = {
  sourceFiles: AIGenerateQuestionSourceFileDto[];
  mcCount: number;
  tfCount: number;
  shortAnswerCount: number;
  variants: number;
  difficulty: 'easy' | 'standard' | 'hard';
  category: string;
};
