import { BadRequestException } from '@nestjs/common';
import type {
  CreateExamDto,
  ExamSchedule,
  ExamStatus,
  ReportReleaseMode,
} from './exams.types';

export function validateCreateExamDto(payload: CreateExamDto) {
  if (!payload.title.trim()) {
    throw new BadRequestException('Exam title is required');
  }
  if (
    !Number.isInteger(payload.durationMinutes) ||
    payload.durationMinutes <= 0
  ) {
    throw new BadRequestException('Duration must be a positive integer');
  }
  if (payload.status === 'scheduled' && payload.questions.length === 0) {
    throw new BadRequestException(
      'At least one question is required before scheduling an exam',
    );
  }

  payload.questions.forEach((question, index) => {
    if (!question.question.trim()) {
      throw new BadRequestException(
        `Question ${index + 1} must include prompt text`,
      );
    }
    if (!Number.isInteger(question.points) || question.points <= 0) {
      throw new BadRequestException(
        `Question ${index + 1} must have a positive point value`,
      );
    }
    if (
      question.type === 'multiple-choice' &&
      (!question.options ||
        question.options.length < 2 ||
        question.options.some((option) => !option.trim()))
    ) {
      throw new BadRequestException(
        `Multiple choice question ${index + 1} must include at least two non-empty options`,
      );
    }
  });

  const seenSchedules = new Set<string>();
  payload.schedules.forEach((schedule, index) => {
    if (
      !schedule.classId.trim() ||
      !schedule.date.trim() ||
      !schedule.time.trim()
    ) {
      throw new BadRequestException(
        `Schedule ${index + 1} must include class, date, and time`,
      );
    }
    const scheduleKey = `${schedule.classId}::${schedule.date}::${schedule.time}`;
    if (seenSchedules.has(scheduleKey)) {
      throw new BadRequestException(
        `Schedule ${index + 1} duplicates an existing class/date/time entry`,
      );
    }
    seenSchedules.add(scheduleKey);
  });
}

export function toExamStatus(value: string): ExamStatus {
  return value as ExamStatus;
}

export function toReportReleaseMode(value: string): ReportReleaseMode {
  return value as ReportReleaseMode;
}

export function getDerivedExamStatus(
  status: ExamStatus,
  schedules: ExamSchedule[],
  durationMinutes: number,
  now = new Date(),
): ExamStatus {
  if (status !== 'scheduled') return status;

  const latestScheduleEnd = schedules.reduce<number | null>(
    (latest, schedule) => {
      const start = new Date(`${schedule.date}T${schedule.time}:00`);
      const startTime = start.getTime();
      if (Number.isNaN(startTime)) return latest;
      const endTime = startTime + durationMinutes * 60 * 1000;
      return latest === null || endTime > latest ? endTime : latest;
    },
    null,
  );

  return latestScheduleEnd !== null && latestScheduleEnd < now.getTime()
    ? 'completed'
    : status;
}
