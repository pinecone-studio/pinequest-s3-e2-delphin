import type {
  CreateExamDto,
  Exam,
  ExamQuestion,
  ExamSchedule,
} from './exams.types';
import type {
  ExamQuestionRecord,
  ExamRecord,
  ExamScheduleRecord,
} from './exams.internal-types';
import { normalizeExamQuestionIconKey } from './question-icons';
import {
  getDerivedExamStatus,
  toExamStatus,
  toReportReleaseMode,
} from './exams.validation';

export function mapExamRecord(
  exam: ExamRecord,
  questions: ExamQuestionRecord[],
  schedules: ExamScheduleRecord[],
): Exam {
  const mappedSchedules = schedules
    .slice()
    .sort((left, right) =>
      left.scheduledDate.localeCompare(right.scheduledDate),
    )
    .map(mapScheduleRecord);

  return {
    id: exam.id,
    title: exam.title,
    durationMinutes: exam.durationMinutes,
    reportReleaseMode: toReportReleaseMode(exam.reportReleaseMode),
    status: getDerivedExamStatus(
      toExamStatus(exam.status),
      mappedSchedules,
      exam.durationMinutes,
    ),
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    questions: questions
      .slice()
      .sort((left, right) => left.displayOrder - right.displayOrder)
      .map(mapQuestionRecord),
    schedules: mappedSchedules,
  };
}

export function buildExamInsert(
  dto: CreateExamDto,
  examId: string,
  createdAt: string,
  updatedAt: string,
) {
  return {
    id: examId,
    title: dto.title.trim(),
    durationMinutes: dto.durationMinutes,
    reportReleaseMode: dto.reportReleaseMode,
    status: dto.status,
    createdAt,
    updatedAt,
  };
}

export function buildQuestionInserts(dto: CreateExamDto, examId: string) {
  return dto.questions.map((question, index) => ({
    id: crypto.randomUUID(),
    examId,
    type: question.type,
    prompt: question.question.trim(),
    optionsJson: question.options
      ? JSON.stringify(question.options.map((option) => option.trim()))
      : null,
    correctAnswer: question.correctAnswer?.trim() || null,
    iconKey: question.iconKey ?? null,
    points: question.points,
    displayOrder: question.order || index + 1,
  }));
}

export function buildScheduleInserts(dto: CreateExamDto, examId: string) {
  return dto.schedules.map((schedule) => ({
    id: crypto.randomUUID(),
    examId,
    classId: schedule.classId.trim(),
    scheduledDate: schedule.date.trim(),
    scheduledTime: schedule.time.trim(),
  }));
}

function mapQuestionRecord(question: ExamQuestionRecord): ExamQuestion {
  return {
    id: question.id,
    type: question.type as ExamQuestion['type'],
    question: question.prompt,
    options: question.optionsJson
      ? (JSON.parse(question.optionsJson) as string[])
      : undefined,
    correctAnswer: question.correctAnswer ?? undefined,
    iconKey: normalizeExamQuestionIconKey(question.iconKey),
    points: question.points,
    order: question.displayOrder,
  };
}

function mapScheduleRecord(schedule: ExamScheduleRecord): ExamSchedule {
  return {
    id: schedule.id,
    classId: schedule.classId,
    date: schedule.scheduledDate,
    time: schedule.scheduledTime,
  };
}
