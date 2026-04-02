import { BadRequestException, Injectable } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';
import {
  createExamsStoreContext,
  type ExamsStoreContext,
} from './exams.internal-types';
import { createMockQuestions, getMockLiveAttempts } from './exams.mock';
import {
  buildNextExamPayload,
  createExamLocally,
  findMappedExamOrThrow,
  removeExamLocally,
  updateExamLocally,
} from './exams.service-helpers';
import {
  createExamRecordsInDatabase,
  deleteExamRecordsInDatabase,
  loadAllExamRecords,
  replaceExamRecordsInDatabase,
} from './exams.store';
import {
  buildExamInsert,
  buildQuestionInserts,
  buildScheduleInserts,
  mapExamRecord,
} from './exams.transforms';
import { validateCreateExamDto } from './exams.validation';
import type {
  AIGenerateQuestionsDto,
  Exam,
  ExamQuestion,
  UpdateExamDto,
  CreateExamDto,
} from './exams.types';

@Injectable()
export class ExamsService {
  private readonly storeContext: ExamsStoreContext;

  constructor(private readonly databaseService: DatabaseService) {
    this.storeContext = createExamsStoreContext(databaseService);
  }

  async findAll(): Promise<Exam[]> {
    return executeOrRethrowAsync(async () => {
      const { examRecords, questionRecords, scheduleRecords } =
        await loadAllExamRecords(this.storeContext);
      return examRecords
        .slice()
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map((examRecord) =>
          mapExamRecord(
            examRecord,
            questionRecords.filter(
              (question) => question.examId === examRecord.id,
            ),
            scheduleRecords.filter(
              (schedule) => schedule.examId === examRecord.id,
            ),
          ),
        );
    }, 'Failed to list exams');
  }

  async findOne(id: string): Promise<Exam> {
    return executeOrRethrowAsync(
      async () => findMappedExamOrThrow(this.storeContext, id),
      `Failed to load exam ${id}`,
    );
  }

  async create(payload: CreateExamDto): Promise<Exam> {
    return executeOrRethrowAsync(async () => {
      validateCreateExamDto(payload);
      const timestamp = new Date().toISOString();
      const examId = crypto.randomUUID();
      const examInsert = buildExamInsert(payload, examId, timestamp, timestamp);
      const questionInserts = buildQuestionInserts(payload, examId);
      const scheduleInserts = buildScheduleInserts(payload, examId);

      if (this.databaseService.isConfigured()) {
        await createExamRecordsInDatabase(
          this.storeContext,
          examInsert,
          questionInserts,
          scheduleInserts,
        );
      } else {
        await createExamLocally(
          this.storeContext,
          examInsert,
          questionInserts,
          scheduleInserts,
        );
      }

      return mapExamRecord(examInsert, questionInserts, scheduleInserts);
    }, `Failed to create exam ${payload.title}`);
  }

  async update(id: string, payload: UpdateExamDto): Promise<Exam> {
    return executeOrRethrowAsync(async () => {
      const existingExam = await findMappedExamOrThrow(this.storeContext, id);
      const nextPayload = buildNextExamPayload(existingExam, payload);
      validateCreateExamDto(nextPayload);
      const examInsert = buildExamInsert(
        nextPayload,
        id,
        existingExam.createdAt,
        new Date().toISOString(),
      );
      const questionInserts = buildQuestionInserts(nextPayload, id);
      const scheduleInserts = buildScheduleInserts(nextPayload, id);

      if (this.databaseService.isConfigured()) {
        await replaceExamRecordsInDatabase(
          this.storeContext,
          examInsert,
          questionInserts,
          scheduleInserts,
        );
      } else {
        await updateExamLocally(
          this.storeContext,
          id,
          examInsert,
          questionInserts,
          scheduleInserts,
        );
      }

      return mapExamRecord(examInsert, questionInserts, scheduleInserts);
    }, `Failed to update exam ${id}`);
  }

  async remove(id: string): Promise<Exam> {
    return executeOrRethrowAsync(async () => {
      const existingExam = await findMappedExamOrThrow(this.storeContext, id);
      if (this.databaseService.isConfigured()) {
        await deleteExamRecordsInDatabase(this.storeContext, id);
      } else {
        await removeExamLocally(this.storeContext, id);
      }
      return existingExam;
    }, `Failed to delete exam ${id}`);
  }

  async generateAIQuestions(
    payload: AIGenerateQuestionsDto,
  ): Promise<ExamQuestion[]> {
    return executeOrRethrowAsync(() => {
      if (!payload.sourceFiles?.length)
        throw new BadRequestException(
          'Source files are required for AI generation',
        );
      if (payload.mcCount + payload.tfCount + payload.shortAnswerCount <= 0) {
        throw new BadRequestException(
          'Question counts must be greater than zero',
        );
      }
      return createMockQuestions(payload);
    }, 'Failed to generate AI questions');
  }

  async getLiveAttempts(examId: string): Promise<any[]> {
    return executeOrRethrowAsync(
      () => getMockLiveAttempts(),
      `Failed to get live attempts for exam ${examId}`,
    );
  }
}
