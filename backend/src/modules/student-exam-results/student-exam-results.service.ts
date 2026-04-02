import { Injectable, NotFoundException } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';
import {
  mapStudentExamResultRecord,
  readStudentExamResultRecords,
  writeStudentExamResultRecord,
} from './student-exam-results.store';
import {
  createStudentExamResultStoreContext,
  type CreateStudentExamResultDto,
  type StudentExamResult,
  type StudentExamResultStoreContext,
} from './student-exam-results.types';

export type {
  CreateStudentExamResultDto,
  StudentExamAnswer,
  StudentExamResult,
} from './student-exam-results.types';

@Injectable()
export class StudentExamResultsService {
  private readonly storeContext: StudentExamResultStoreContext;

  constructor(private readonly databaseService: DatabaseService) {
    this.storeContext = createStudentExamResultStoreContext(databaseService);
  }

  async findAll(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
  }): Promise<StudentExamResult[]> {
    return executeOrRethrowAsync(async () => {
      const records = await readStudentExamResultRecords(this.storeContext, {
        examId: filters?.examId?.trim(),
        studentId: filters?.studentId?.trim(),
        classId: filters?.classId?.trim(),
      });
      return records.map(mapStudentExamResultRecord);
    }, 'Failed to list student exam results');
  }

  async findOne(id: string): Promise<StudentExamResult> {
    return executeOrRethrowAsync(async () => {
      const record = (
        await readStudentExamResultRecords(this.storeContext)
      ).find((entry) => entry.id === id);
      if (!record) {
        throw new NotFoundException(`Student exam result ${id} not found`);
      }
      return mapStudentExamResultRecord(record);
    }, `Failed to load student exam result ${id}`);
  }

  async upsert(
    payload: CreateStudentExamResultDto,
  ): Promise<StudentExamResult> {
    return executeOrRethrowAsync(async () => {
      const timestamp = new Date().toISOString();
      const nextRecord = {
        id: `${payload.examId.trim()}::${payload.studentId.trim()}`,
        examId: payload.examId.trim(),
        studentId: payload.studentId.trim(),
        studentName: payload.studentName.trim(),
        classId: payload.classId.trim(),
        answersJson: JSON.stringify(payload.answers),
        score: payload.score,
        totalPoints: payload.totalPoints,
        status: payload.status ?? 'submitted',
        submittedAt: payload.submittedAt,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const existing = (
        await readStudentExamResultRecords(this.storeContext, {
          examId: nextRecord.examId,
          studentId: nextRecord.studentId,
        })
      )[0];
      if (existing) {
        nextRecord.createdAt = existing.createdAt;
      }
      await writeStudentExamResultRecord(this.storeContext, nextRecord);
      return mapStudentExamResultRecord(nextRecord);
    }, `Failed to save student exam result for ${payload.studentId}`);
  }
}
