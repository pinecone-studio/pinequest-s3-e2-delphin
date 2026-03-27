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

export type StudentExamAnswer = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
};

export type StudentExamResult = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  answers: StudentExamAnswer[];
  score: number;
  totalPoints: number;
  status: 'submitted';
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStudentExamResultDto = Omit<
  StudentExamResult,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & {
  status?: 'submitted';
};

type StudentExamResultRecord = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classId: string;
  answersJson: string;
  score: number;
  totalPoints: number;
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

type LocalStudentExamResultStore = {
  results: StudentExamResultRecord[];
};

@Injectable()
export class StudentExamResultsService {
  private readonly localStorePath = resolve(
    process.cwd(),
    '.data',
    'student-exam-results.json',
  );
  private localStoreLoaded = false;
  private localStore: LocalStudentExamResultStore = {
    results: [],
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
  }): Promise<StudentExamResult[]> {
    return executeOrRethrowAsync(async () => {
      const normalizedFilters = {
        examId: filters?.examId?.trim(),
        studentId: filters?.studentId?.trim(),
        classId: filters?.classId?.trim(),
      };

      const records = await this.readRecords(normalizedFilters);
      return records.map((record) => this.mapRecord(record));
    }, 'Failed to list student exam results');
  }

  async findOne(id: string): Promise<StudentExamResult> {
    return executeOrRethrowAsync(async () => {
      const records = await this.readRecords();
      const record = records.find((entry) => entry.id === id);

      if (!record) {
        throw new NotFoundException(`Student exam result ${id} not found`);
      }

      return this.mapRecord(record);
    }, `Failed to load student exam result ${id}`);
  }

  async upsert(payload: CreateStudentExamResultDto): Promise<StudentExamResult> {
    return executeOrRethrowAsync(async () => {
      const timestamp = new Date().toISOString();
      const id = `${payload.examId.trim()}::${payload.studentId.trim()}`;
      const nextRecord: StudentExamResultRecord = {
        id,
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

      const existing = (await this.readRecords({
        examId: nextRecord.examId,
        studentId: nextRecord.studentId,
      }))[0];

      if (existing) {
        nextRecord.createdAt = existing.createdAt;
      }

      await this.writeRecord(nextRecord);
      return this.mapRecord(nextRecord);
    }, `Failed to save student exam result for ${payload.studentId}`);
  }

  private async readRecords(filters?: {
    examId?: string;
    studentId?: string;
    classId?: string;
  }): Promise<StudentExamResultRecord[]> {
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

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      return this.databaseService.query<StudentExamResultRecord>(
        `SELECT
           id,
           exam_id as examId,
           student_id as studentId,
           student_name as studentName,
           class_id as classId,
           answers_json as answersJson,
           score,
           total_points as totalPoints,
           status,
           submitted_at as submittedAt,
           created_at as createdAt,
           updated_at as updatedAt
         FROM student_exam_results
         ${whereSql}
         ORDER BY submitted_at DESC`,
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
    return this.localStore.results
      .filter((record) => {
        if (filters?.examId && record.examId !== filters.examId) return false;
        if (filters?.studentId && record.studentId !== filters.studentId) return false;
        if (filters?.classId && record.classId !== filters.classId) return false;
        return true;
      })
      .slice()
      .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
  }

  private async writeRecord(record: StudentExamResultRecord): Promise<void> {
    const upsertToDatabase = async () => {
      const existing = await this.databaseService.queryFirst<{ id: string; createdAt: string }>(
        `SELECT id, created_at as createdAt
         FROM student_exam_results
         WHERE exam_id = ? AND student_id = ?
         LIMIT 1`,
        [record.examId, record.studentId],
      );

      if (existing) {
        await this.databaseService.execute(
          `UPDATE student_exam_results
           SET student_name = ?, class_id = ?, answers_json = ?, score = ?, total_points = ?,
               status = ?, submitted_at = ?, updated_at = ?
           WHERE id = ?`,
          [
            record.studentName,
            record.classId,
            record.answersJson,
            record.score,
            record.totalPoints,
            record.status,
            record.submittedAt,
            record.updatedAt,
            existing.id,
          ],
        );
        record.id = existing.id;
        record.createdAt = existing.createdAt;
        return;
      }

      await this.databaseService.execute(
        `INSERT INTO student_exam_results (
          id, exam_id, student_id, student_name, class_id, answers_json, score,
          total_points, status, submitted_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.examId,
          record.studentId,
          record.studentName,
          record.classId,
          record.answersJson,
          record.score,
          record.totalPoints,
          record.status,
          record.submittedAt,
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
    const existingIndex = this.localStore.results.findIndex(
      (entry) => entry.examId === record.examId && entry.studentId === record.studentId,
    );

    if (existingIndex >= 0) {
      this.localStore.results[existingIndex] = {
        ...this.localStore.results[existingIndex],
        ...record,
        createdAt: this.localStore.results[existingIndex].createdAt,
      };
    } else {
      this.localStore.results.push(record);
    }

    await this.persistLocalStore();
  }

  private async ensureLocalStoreLoaded(): Promise<void> {
    if (this.localStoreLoaded) {
      return;
    }

    try {
      const rawContent = await readFile(this.localStorePath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<LocalStudentExamResultStore>;
      this.localStore = {
        results: parsed.results ?? [],
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
        `Failed to load local student exam results from ${this.localStorePath}`,
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
        `Failed to persist local student exam results to ${this.localStorePath}`,
      );
    }
  }

  private mapRecord(record: StudentExamResultRecord): StudentExamResult {
    return {
      id: record.id,
      examId: record.examId,
      studentId: record.studentId,
      studentName: record.studentName,
      classId: record.classId,
      answers: JSON.parse(record.answersJson) as StudentExamAnswer[],
      score: record.score,
      totalPoints: record.totalPoints,
      status: 'submitted',
      submittedAt: record.submittedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
