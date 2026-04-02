import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { ServiceUnavailableException } from '@nestjs/common';
import { rethrowAsInternal } from '../../common/error-handling';
import type {
  StudentExamAnswer,
  StudentExamResult,
  StudentExamResultFilters,
  StudentExamResultRecord,
  StudentExamResultStoreContext,
} from './student-exam-results.types';

export async function readStudentExamResultRecords(
  context: StudentExamResultStoreContext,
  filters?: StudentExamResultFilters,
): Promise<StudentExamResultRecord[]> {
  if (context.databaseService.isConfigured()) {
    try {
      return await context.databaseService.query<StudentExamResultRecord>(
        buildResultSelectQuery(filters),
        buildResultParams(filters),
      );
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) throw error;
    }
  }

  await ensureLocalStoreLoaded(context);
  return context.localStore.results
    .filter((record) => matchesResultFilters(record, filters))
    .slice()
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
}

export async function writeStudentExamResultRecord(
  context: StudentExamResultStoreContext,
  record: StudentExamResultRecord,
): Promise<void> {
  if (context.databaseService.isConfigured()) {
    try {
      await context.databaseService.execute(buildResultUpsertQuery(), [
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
      ]);
      return;
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) throw error;
    }
  }

  await ensureLocalStoreLoaded(context);
  const existingIndex = context.localStore.results.findIndex(
    (entry) =>
      entry.examId === record.examId && entry.studentId === record.studentId,
  );
  if (existingIndex >= 0) {
    context.localStore.results[existingIndex] = {
      ...context.localStore.results[existingIndex],
      ...record,
      createdAt: context.localStore.results[existingIndex].createdAt,
    };
  } else {
    context.localStore.results.push(record);
  }
  await persistLocalStore(context);
}

export function mapStudentExamResultRecord(
  record: StudentExamResultRecord,
): StudentExamResult {
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

async function ensureLocalStoreLoaded(context: StudentExamResultStoreContext) {
  if (context.localStoreLoaded) return;
  try {
    const rawContent = await readFile(context.localStorePath, 'utf8');
    const parsed = JSON.parse(rawContent) as {
      results?: StudentExamResultRecord[];
    };
    context.localStore = { results: parsed.results ?? [] };
    context.localStoreLoaded = true;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      context.localStoreLoaded = true;
      return;
    }
    rethrowAsInternal(
      error,
      `Failed to load local student exam results from ${context.localStorePath}`,
    );
  }
}

async function persistLocalStore(context: StudentExamResultStoreContext) {
  try {
    await mkdir(dirname(context.localStorePath), { recursive: true });
    await writeFile(
      context.localStorePath,
      JSON.stringify(context.localStore, null, 2),
      'utf8',
    );
  } catch (error) {
    rethrowAsInternal(
      error,
      `Failed to persist local student exam results to ${context.localStorePath}`,
    );
  }
}

function buildResultSelectQuery(filters?: StudentExamResultFilters) {
  const clauses = [
    filters?.examId ? 'exam_id = ?' : '',
    filters?.studentId ? 'student_id = ?' : '',
    filters?.classId ? 'class_id = ?' : '',
  ].filter(Boolean);
  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return `SELECT id, exam_id as examId, student_id as studentId, student_name as studentName, class_id as classId, answers_json as answersJson, score, total_points as totalPoints, status, submitted_at as submittedAt, created_at as createdAt, updated_at as updatedAt FROM student_exam_results ${whereSql} ORDER BY submitted_at DESC`;
}

function buildResultParams(filters?: StudentExamResultFilters) {
  return [filters?.examId, filters?.studentId, filters?.classId].filter(
    (value): value is string => Boolean(value),
  );
}

function buildResultUpsertQuery() {
  return `INSERT INTO student_exam_results (id, exam_id, student_id, student_name, class_id, answers_json, score, total_points, status, submitted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET student_name = excluded.student_name, class_id = excluded.class_id, answers_json = excluded.answers_json, score = excluded.score, total_points = excluded.total_points, status = excluded.status, submitted_at = excluded.submitted_at, updated_at = excluded.updated_at`;
}

function matchesResultFilters(
  record: StudentExamResultRecord,
  filters?: StudentExamResultFilters,
) {
  return (
    (!filters?.examId || record.examId === filters.examId) &&
    (!filters?.studentId || record.studentId === filters.studentId) &&
    (!filters?.classId || record.classId === filters.classId)
  );
}
