import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type StudentExamAttemptStatus = 'in_progress' | 'submitted';

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

type StudentExamAttemptRecord = {
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

type LocalStudentExamAttemptStore = {
  attempts: StudentExamAttemptRecord[];
};

@Injectable()
export class StudentExamAttemptsService {
  private readonly localStorePath = resolve(
    process.cwd(),
    '.data',
    'student-exam-attempts.json',
  );
  private localStoreLoaded = false;
  private localStore: LocalStudentExamAttemptStore = {
    attempts: [],
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
    status?: StudentExamAttemptStatus;
  }): Promise<StudentExamAttempt[]> {
    return executeOrRethrowAsync(async () => {
      const records = await this.readRecords({
        examId: filters?.examId?.trim(),
        studentId: filters?.studentId?.trim(),
        classId: filters?.classId?.trim(),
        status: filters?.status,
      });
      return records.map((record) => this.mapRecord(record));
    }, 'Failed to list student exam attempts');
  }

  async findOne(id: string): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(async () => {
      const records = await this.readRecords();
      const record = records.find((entry) => entry.id === id);

      if (!record) {
        throw new NotFoundException(`Student exam attempt ${id} not found`);
      }

      return this.mapRecord(record);
    }, `Failed to load student exam attempt ${id}`);
  }

  async upsert(
    payload: UpsertStudentExamAttemptDto,
  ): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(async () => {
      const timestamp = new Date().toISOString();
      const id = `${payload.examId.trim()}::${payload.studentId.trim()}`;
      const existing = (
        await this.readRecords({
          examId: payload.examId.trim(),
          studentId: payload.studentId.trim(),
        })
      )[0];

      const nextRecord: StudentExamAttemptRecord = {
        id,
        examId: payload.examId.trim(),
        studentId: payload.studentId.trim(),
        studentName: payload.studentName.trim(),
        classId: payload.classId.trim(),
        status: payload.status,
        startedAt: existing?.startedAt ?? payload.startedAt,
        submittedAt:
          payload.status === 'submitted'
            ? payload.submittedAt ?? existing?.submittedAt ?? timestamp
            : existing?.submittedAt ?? null,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      await this.writeRecord(nextRecord);
      return this.mapRecord(nextRecord);
    }, `Failed to save student exam attempt for ${payload.studentId}`);
  }

  private async readRecords(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
    status?: StudentExamAttemptStatus;
  }): Promise<StudentExamAttemptRecord[]> {
    const readFromDatabase = async () => {
      const whereClauses: string[] = [];
      const params: Array<string> = [];

      if (filters?.examId) {
        whereClauses.push('exam_id = ?');
        params.push(filters.examId);
      }

      if (filters?.studentId) {
        whereClauses.push('student_id = ?');
        params.push(filters.studentId);
      }

      if (filters?.classId) {
        whereClauses.push('class_id = ?');
        params.push(filters.classId);
      }

      if (filters?.status) {
        whereClauses.push('status = ?');
        params.push(filters.status);
      }

      const whereSql =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      return this.databaseService.query<StudentExamAttemptRecord>(
        `SELECT
           id,
           exam_id as examId,
           student_id as studentId,
           student_name as studentName,
           class_id as classId,
           status,
           started_at as startedAt,
           submitted_at as submittedAt,
           created_at as createdAt,
           updated_at as updatedAt
         FROM student_exam_attempts
         ${whereSql}
         ORDER BY started_at DESC`,
        params,
      );
    };

    if (this.databaseService.isConfigured()) {
      try {
        return await readFromDatabase();
      } catch (error) {
        if (!(error instanceof ServiceUnavailableException)) {
          throw error;
        }
      }
    }

    await this.ensureLocalStoreLoaded();
    return this.localStore.attempts
      .filter((record) => {
        if (filters?.examId && record.examId !== filters.examId) return false;
        if (filters?.studentId && record.studentId !== filters.studentId)
          return false;
        if (filters?.classId && record.classId !== filters.classId) return false;
        if (filters?.status && record.status !== filters.status) return false;
        return true;
      })
      .slice()
      .sort((left, right) => right.startedAt.localeCompare(left.startedAt));
  }

  private async writeRecord(record: StudentExamAttemptRecord): Promise<void> {
    const upsertToDatabase = async () => {
      const existing = await this.databaseService.queryFirst<{
        id: string;
        createdAt: string;
      }>(
        `SELECT id, created_at as createdAt
         FROM student_exam_attempts
         WHERE exam_id = ? AND student_id = ?
         LIMIT 1`,
        [record.examId, record.studentId],
      );

      if (existing) {
        await this.databaseService.execute(
          `UPDATE student_exam_attempts
           SET student_name = ?, class_id = ?, status = ?, started_at = ?,
               submitted_at = ?, updated_at = ?
           WHERE id = ?`,
          [
            record.studentName,
            record.classId,
            record.status,
            record.startedAt,
            record.submittedAt ?? null,
            record.updatedAt,
            existing.id,
          ],
        );
        record.id = existing.id;
        record.createdAt = existing.createdAt;
        return;
      }

      await this.databaseService.execute(
        `INSERT INTO student_exam_attempts (
          id, exam_id, student_id, student_name, class_id, status,
          started_at, submitted_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.examId,
          record.studentId,
          record.studentName,
          record.classId,
          record.status,
          record.startedAt,
          record.submittedAt ?? null,
          record.createdAt,
          record.updatedAt,
        ],
      );
    };

    if (this.databaseService.isConfigured()) {
      try {
        await upsertToDatabase();
        return;
      } catch (error) {
        if (!(error instanceof ServiceUnavailableException)) {
          throw error;
        }
      }
    }

    await this.ensureLocalStoreLoaded();
    const existingIndex = this.localStore.attempts.findIndex(
      (entry) => entry.examId === record.examId && entry.studentId === record.studentId,
    );

    if (existingIndex >= 0) {
      this.localStore.attempts[existingIndex] = {
        ...this.localStore.attempts[existingIndex],
        ...record,
        createdAt: this.localStore.attempts[existingIndex].createdAt,
      };
    } else {
      this.localStore.attempts.push(record);
    }

    await this.persistLocalStore();
  }

  private async ensureLocalStoreLoaded(): Promise<void> {
    if (this.localStoreLoaded) {
      return;
    }

    try {
      const rawContent = await readFile(this.localStorePath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<LocalStudentExamAttemptStore>;
      this.localStore = {
        attempts: parsed.attempts ?? [],
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
        `Failed to load local student exam attempts from ${this.localStorePath}`,
      );
    }
  }

  private async persistLocalStore(): Promise<void> {
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
        `Failed to persist local student exam attempts to ${this.localStorePath}`,
      );
    }
  }

  private mapRecord(record: StudentExamAttemptRecord): StudentExamAttempt {
    return {
      id: record.id,
      examId: record.examId,
      studentId: record.studentId,
      studentName: record.studentName,
      classId: record.classId,
      status: record.status,
      startedAt: record.startedAt,
      submittedAt: record.submittedAt ?? null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
