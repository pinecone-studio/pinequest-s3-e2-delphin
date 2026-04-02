import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';
import {
  mapStudentExamAttemptRecord,
  readStudentExamAttemptRecords,
  writeStudentExamAttemptRecord,
} from './student-exam-attempts.store';
import {
  createStudentExamAttemptStoreContext,
  type StudentExamAttempt,
  type StudentExamAttemptStatus,
  type StudentExamAttemptStoreContext,
  type UpsertStudentExamAttemptDto,
} from './student-exam-attempts.types';

export type {
  StudentExamAttempt,
  StudentExamAttemptStatus,
  UpsertStudentExamAttemptDto,
} from './student-exam-attempts.types';

@Injectable()
export class StudentExamAttemptsService {
  private readonly storeContext: StudentExamAttemptStoreContext;

  constructor(private readonly databaseService: DatabaseService) {
    this.storeContext = createStudentExamAttemptStoreContext(databaseService);
  }

  async findAll(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
    status?: StudentExamAttemptStatus;
  }): Promise<StudentExamAttempt[]> {
    return executeOrRethrowAsync(async () => {
      const records = await readStudentExamAttemptRecords(this.storeContext, {
        examId: filters?.examId?.trim(),
        studentId: filters?.studentId?.trim(),
        classId: filters?.classId?.trim(),
        status: filters?.status,
      });
      return records.map(mapStudentExamAttemptRecord);
    }, 'Failed to list student exam attempts');
  }

  async findOne(id: string): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(async () => {
      const record = (
        await readStudentExamAttemptRecords(this.storeContext)
      ).find((entry) => entry.id === id);
      if (!record) {
        throw new NotFoundException(`Student exam attempt ${id} not found`);
      }
      return mapStudentExamAttemptRecord(record);
    }, `Failed to load student exam attempt ${id}`);
  }

  async upsert(
    payload: UpsertStudentExamAttemptDto,
  ): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(async () => {
      const timestamp = new Date().toISOString();
      const existing = (
        await readStudentExamAttemptRecords(this.storeContext, {
          examId: payload.examId.trim(),
          studentId: payload.studentId.trim(),
        })
      )[0];
      const nextRecord = {
        id: `${payload.examId.trim()}::${payload.studentId.trim()}`,
        examId: payload.examId.trim(),
        studentId: payload.studentId.trim(),
        studentName: payload.studentName.trim(),
        classId: payload.classId.trim(),
        status: payload.status,
        startedAt: existing?.startedAt ?? payload.startedAt,
        submittedAt:
          payload.status === 'submitted'
            ? (payload.submittedAt ?? existing?.submittedAt ?? timestamp)
            : (existing?.submittedAt ?? null),
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
      await writeStudentExamAttemptRecord(this.storeContext, nextRecord);
      return mapStudentExamAttemptRecord(nextRecord);
    }, `Failed to save student exam attempt for ${payload.studentId}`);
  }
}
