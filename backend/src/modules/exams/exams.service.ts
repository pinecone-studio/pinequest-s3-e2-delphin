import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { eq } from 'drizzle-orm';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';
import {
  examQuestions,
  examSchedules,
  exams,
} from '../../database/schema';
import type {
  CreateExamDto,
  Exam,
  ExamQuestion,
  ExamQuestionType,
  ExamSchedule,
  ExamStatus,
  ReportReleaseMode,
} from './exams.types';

type ExamRecord = {
  id: string;
  title: string;
  durationMinutes: number;
  reportReleaseMode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ExamQuestionRecord = {
  id: string;
  examId: string;
  type: string;
  prompt: string;
  optionsJson: string | null;
  correctAnswer: string | null;
  points: number;
  displayOrder: number;
};

type ExamScheduleRecord = {
  id: string;
  examId: string;
  classId: string;
  scheduledDate: string;
  scheduledTime: string;
};

type LocalExamStore = {
  exams: ExamRecord[];
  questions: ExamQuestionRecord[];
  schedules: ExamScheduleRecord[];
};

@Injectable()
export class ExamsService {
  private readonly localStorePath = resolve(
    process.cwd(),
    '.data',
    'exams.json',
  );
  private localStoreLoaded = false;
  private localStore: LocalExamStore = {
    exams: [],
    questions: [],
    schedules: [],
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Exam[]> {
    return executeOrRethrowAsync(async () => {
      const { examRecords, questionRecords, scheduleRecords } =
        await this.loadAllRecords();

      return examRecords
        .slice()
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((examRecord) =>
          this.mapExamRecord(
            examRecord,
            questionRecords.filter((question) => question.examId === examRecord.id),
            scheduleRecords.filter((schedule) => schedule.examId === examRecord.id),
          ),
        );
    }, 'Failed to list exams');
  }

  async findOne(id: string): Promise<Exam> {
    return executeOrRethrowAsync(async () => {
      const db = this.databaseService.getDb();
      if (db) {
        const [examRecord] = await db
          .select()
          .from(exams)
          .where(eq(exams.id, id))
          .limit(1);

        if (!examRecord) {
          throw new NotFoundException(`Exam ${id} not found`);
        }

        const questionRecords = await db
          .select()
          .from(examQuestions)
          .where(eq(examQuestions.examId, id));
        const scheduleRecords = await db
          .select()
          .from(examSchedules)
          .where(eq(examSchedules.examId, id));

        return this.mapExamRecord(examRecord, questionRecords, scheduleRecords);
      }

      await this.ensureLocalStoreLoaded();
      const examRecord = this.localStore.exams.find((item) => item.id === id);
      if (!examRecord) {
        throw new NotFoundException(`Exam ${id} not found`);
      }

      return this.mapExamRecord(
        examRecord,
        this.localStore.questions.filter((question) => question.examId === id),
        this.localStore.schedules.filter((schedule) => schedule.examId === id),
      );
    }, `Failed to load exam ${id}`);
  }

  async create(payload: CreateExamDto): Promise<Exam> {
    return executeOrRethrowAsync(async () => {
      this.validateCreateExamDto(payload);

      const examId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const examInsert = this.buildExamInsert(payload, examId, timestamp);
      const questionInserts = this.buildQuestionInserts(payload, examId);
      const scheduleInserts = this.buildScheduleInserts(payload, examId);

      const db = this.databaseService.getDb();
      if (db) {
        await db.insert(exams).values(examInsert);

        if (questionInserts.length > 0) {
          await db.insert(examQuestions).values(questionInserts);
        }

        if (scheduleInserts.length > 0) {
          await db.insert(examSchedules).values(scheduleInserts);
        }
      } else {
        await this.ensureLocalStoreLoaded();
        this.localStore.exams.push(examInsert);
        this.localStore.questions.push(...questionInserts);
        this.localStore.schedules.push(...scheduleInserts);
        await this.persistLocalStore();
      }

      return this.mapExamRecord(examInsert, questionInserts, scheduleInserts);
    }, `Failed to create exam ${payload.title}`);
  }

  private async loadAllRecords(): Promise<{
    examRecords: ExamRecord[];
    questionRecords: ExamQuestionRecord[];
    scheduleRecords: ExamScheduleRecord[];
  }> {
    const db = this.databaseService.getDb();
    if (db) {
      const [examRecords, questionRecords, scheduleRecords] = await Promise.all([
        db.select().from(exams),
        db.select().from(examQuestions),
        db.select().from(examSchedules),
      ]);

      return { examRecords, questionRecords, scheduleRecords };
    }

    await this.ensureLocalStoreLoaded();
    return {
      examRecords: [...this.localStore.exams],
      questionRecords: [...this.localStore.questions],
      scheduleRecords: [...this.localStore.schedules],
    };
  }

  private async ensureLocalStoreLoaded(): Promise<void> {
    if (this.localStoreLoaded || this.databaseService.isConfigured()) {
      return;
    }

    try {
      const rawContent = await readFile(this.localStorePath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<LocalExamStore>;

      this.localStore = {
        exams: parsed.exams ?? [],
        questions: parsed.questions ?? [],
        schedules: parsed.schedules ?? [],
      };
      this.localStoreLoaded = true;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        this.localStoreLoaded = true;
        return;
      }

      rethrowAsInternal(
        error,
        `Failed to load local exam records from ${this.localStorePath}`,
      );
    }
  }

  private async persistLocalStore(): Promise<void> {
    if (this.databaseService.isConfigured()) {
      return;
    }

    try {
      await mkdir(dirname(this.localStorePath), { recursive: true });
      await writeFile(
        this.localStorePath,
        JSON.stringify(this.localStore, null, 2),
        'utf8',
      );
    } catch (error) {
      rethrowAsInternal(
        error,
        `Failed to persist local exam records to ${this.localStorePath}`,
      );
    }
  }

  private validateCreateExamDto(payload: CreateExamDto) {
    if (!payload.title.trim()) {
      throw new BadRequestException('Exam title is required');
    }

    if (!Number.isInteger(payload.durationMinutes) || payload.durationMinutes <= 0) {
      throw new BadRequestException('Duration must be a positive integer');
    }

    if (payload.questions.length === 0) {
      throw new BadRequestException('At least one question is required');
    }

    if (payload.schedules.length === 0) {
      throw new BadRequestException('At least one schedule entry is required');
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
      if (!schedule.classId.trim() || !schedule.date.trim() || !schedule.time.trim()) {
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

  private mapExamRecord(
    exam: ExamRecord,
    questions: ExamQuestionRecord[],
    schedules: ExamScheduleRecord[],
  ): Exam {
    return {
      id: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      reportReleaseMode: this.toReportReleaseMode(exam.reportReleaseMode),
      status: this.toExamStatus(exam.status),
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      questions: questions
        .slice()
        .sort((left, right) => left.displayOrder - right.displayOrder)
        .map((question) => this.mapQuestionRecord(question)),
      schedules: schedules
        .slice()
        .sort((left, right) => left.scheduledDate.localeCompare(right.scheduledDate))
        .map((schedule) => this.mapScheduleRecord(schedule)),
    };
  }

  private buildExamInsert(dto: CreateExamDto, examId: string, timestamp: string) {
    return {
      id: examId,
      title: dto.title.trim(),
      durationMinutes: dto.durationMinutes,
      reportReleaseMode: dto.reportReleaseMode,
      status: dto.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  private buildQuestionInserts(dto: CreateExamDto, examId: string) {
    return dto.questions.map((question, index) => ({
      id: crypto.randomUUID(),
      examId,
      type: question.type,
      prompt: question.question.trim(),
      optionsJson: question.options
        ? JSON.stringify(question.options.map((option) => option.trim()))
        : null,
      correctAnswer: question.correctAnswer?.trim() || null,
      points: question.points,
      displayOrder: question.order || index + 1,
    }));
  }

  private buildScheduleInserts(dto: CreateExamDto, examId: string) {
    return dto.schedules.map((schedule) => ({
      id: crypto.randomUUID(),
      examId,
      classId: schedule.classId.trim(),
      scheduledDate: schedule.date.trim(),
      scheduledTime: schedule.time.trim(),
    }));
  }

  private mapQuestionRecord(question: ExamQuestionRecord): ExamQuestion {
    return {
      id: question.id,
      type: this.toQuestionType(question.type),
      question: question.prompt,
      options: question.optionsJson
        ? (JSON.parse(question.optionsJson) as string[])
        : undefined,
      correctAnswer: question.correctAnswer ?? undefined,
      points: question.points,
      order: question.displayOrder,
    };
  }

  private mapScheduleRecord(schedule: ExamScheduleRecord): ExamSchedule {
    return {
      id: schedule.id,
      classId: schedule.classId,
      date: schedule.scheduledDate,
      time: schedule.scheduledTime,
    };
  }

  private toQuestionType(value: string): ExamQuestionType {
    return value as ExamQuestionType;
  }

  private toExamStatus(value: string): ExamStatus {
    return value as ExamStatus;
  }

  private toReportReleaseMode(value: string): ReportReleaseMode {
    return value as ReportReleaseMode;
  }
}
