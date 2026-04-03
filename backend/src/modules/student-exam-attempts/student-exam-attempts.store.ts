import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { ServiceUnavailableException } from '@nestjs/common';
import { rethrowAsInternal } from '../../common/error-handling';
import type {
  StudentExamAttempt,
  StudentExamAttemptFilters,
  StudentExamAttemptRecord,
  StudentExamAttemptStoreContext,
} from './student-exam-attempts.types';

export async function readStudentExamAttemptRecords(
  context: StudentExamAttemptStoreContext,
  filters?: StudentExamAttemptFilters,
): Promise<StudentExamAttemptRecord[]> {
  if (context.databaseService.isConfigured()) {
    try {
      return await context.databaseService.query<StudentExamAttemptRecord>(
        buildAttemptSelectQuery(filters),
        buildAttemptParams(filters),
      );
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) throw error;
    }
  }

  await ensureLocalStoreLoaded(context);
  return context.localStore.attempts
    .filter((record) => matchesAttemptFilters(record, filters))
    .slice()
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));
}

export async function writeStudentExamAttemptRecord(
  context: StudentExamAttemptStoreContext,
  record: StudentExamAttemptRecord,
): Promise<void> {
  if (context.databaseService.isConfigured()) {
    try {
      await context.databaseService.execute(buildAttemptUpsertQuery(), [
        record.id,
        record.examId,
        record.studentId,
        record.studentName,
        record.classId,
        record.status,
        record.answersJson ?? '{}',
        record.currentQuestion ?? 0,
        record.answeredCount ?? 0,
        record.startedAt,
        record.submittedAt ?? null,
        record.createdAt,
        record.updatedAt,
      ]);
      return;
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) throw error;
    }
  }

  await ensureLocalStoreLoaded(context);
  const existingIndex = context.localStore.attempts.findIndex(
    (entry) =>
      entry.examId === record.examId && entry.studentId === record.studentId,
  );
  if (existingIndex >= 0) {
    context.localStore.attempts[existingIndex] = {
      ...context.localStore.attempts[existingIndex],
      ...record,
      createdAt: context.localStore.attempts[existingIndex].createdAt,
    };
  } else {
    context.localStore.attempts.push(record);
  }
  await persistLocalStore(context);
}

export function mapStudentExamAttemptRecord(
  record: StudentExamAttemptRecord,
): StudentExamAttempt {
  return {
    id: record.id,
    examId: record.examId,
    studentId: record.studentId,
    studentName: record.studentName,
    classId: record.classId,
    status: record.status,
    answers: record.answersJson
      ? (JSON.parse(record.answersJson) as Record<string, string>)
      : {},
    currentQuestion: record.currentQuestion ?? 0,
    answeredCount: record.answeredCount ?? 0,
    startedAt: record.startedAt,
    submittedAt: record.submittedAt ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function ensureLocalStoreLoaded(context: StudentExamAttemptStoreContext) {
  if (context.localStoreLoaded) return;
  try {
    const rawContent = await readFile(context.localStorePath, 'utf8');
    const parsed = JSON.parse(rawContent) as {
      attempts?: StudentExamAttemptRecord[];
    };
    context.localStore = { attempts: parsed.attempts ?? [] };
    context.localStoreLoaded = true;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      context.localStoreLoaded = true;
      return;
    }
    rethrowAsInternal(
      error,
      `Failed to load local student exam attempts from ${context.localStorePath}`,
    );
  }
}

async function persistLocalStore(context: StudentExamAttemptStoreContext) {
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
      `Failed to persist local student exam attempts to ${context.localStorePath}`,
    );
  }
}

function buildAttemptSelectQuery(filters?: StudentExamAttemptFilters) {
  const clauses = [
    filters?.examId ? 'exam_id = ?' : '',
    filters?.studentId ? 'student_id = ?' : '',
    filters?.classId ? 'class_id = ?' : '',
    filters?.status ? 'status = ?' : '',
  ].filter(Boolean);
  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return `SELECT id, exam_id as examId, student_id as studentId, student_name as studentName, class_id as classId, status, answers_json as answersJson, current_question as currentQuestion, answered_count as answeredCount, started_at as startedAt, submitted_at as submittedAt, created_at as createdAt, updated_at as updatedAt FROM student_exam_attempts ${whereSql} ORDER BY started_at DESC`;
}

function buildAttemptParams(filters?: StudentExamAttemptFilters) {
  return [
    filters?.examId,
    filters?.studentId,
    filters?.classId,
    filters?.status,
  ].filter((value): value is string => Boolean(value));
}

function buildAttemptUpsertQuery() {
  return `INSERT INTO student_exam_attempts (id, exam_id, student_id, student_name, class_id, status, answers_json, current_question, answered_count, started_at, submitted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET student_name = excluded.student_name, class_id = excluded.class_id, status = excluded.status, answers_json = excluded.answers_json, current_question = excluded.current_question, answered_count = excluded.answered_count, started_at = student_exam_attempts.started_at, submitted_at = CASE WHEN excluded.status = 'submitted' THEN COALESCE(excluded.submitted_at, student_exam_attempts.submitted_at) ELSE COALESCE(student_exam_attempts.submitted_at, excluded.submitted_at) END, updated_at = excluded.updated_at`;
}

function matchesAttemptFilters(
  record: StudentExamAttemptRecord,
  filters?: StudentExamAttemptFilters,
) {
  return (
    (!filters?.examId || record.examId === filters.examId) &&
    (!filters?.studentId || record.studentId === filters.studentId) &&
    (!filters?.classId || record.classId === filters.classId) &&
    (!filters?.status || record.status === filters.status)
  );
}
