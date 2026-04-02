import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { rethrowAsInternal } from '../../common/error-handling';
import type {
  ExamQuestionRecord,
  ExamRecord,
  ExamScheduleRecord,
  ExamsStoreContext,
} from './exams.internal-types';

export async function loadAllExamRecords(context: ExamsStoreContext) {
  if (context.databaseService.isConfigured()) {
    const [examRecords, questionRecords, scheduleRecords] = await Promise.all([
      context.databaseService.query<ExamRecord>(
        `SELECT id, title, duration_minutes as durationMinutes, report_release_mode as reportReleaseMode, status, created_at as createdAt, updated_at as updatedAt FROM exams`,
      ),
      context.databaseService.query<ExamQuestionRecord>(
        `SELECT id, exam_id as examId, type, prompt, options_json as optionsJson, correct_answer as correctAnswer, points, display_order as displayOrder FROM exam_questions`,
      ),
      context.databaseService.query<ExamScheduleRecord>(
        `SELECT id, exam_id as examId, class_id as classId, scheduled_date as scheduledDate, scheduled_time as scheduledTime FROM exam_schedules`,
      ),
    ]);
    return { examRecords, questionRecords, scheduleRecords };
  }

  await ensureLocalStoreLoaded(context);
  return {
    examRecords: [...context.localStore.exams],
    questionRecords: [...context.localStore.questions],
    scheduleRecords: [...context.localStore.schedules],
  };
}

export async function ensureLocalStoreLoaded(context: ExamsStoreContext) {
  if (context.localStoreLoaded || context.databaseService.isConfigured())
    return;
  try {
    const rawContent = await readFile(context.localStorePath, 'utf8');
    const parsed = JSON.parse(rawContent) as {
      exams?: typeof context.localStore.exams;
      questions?: typeof context.localStore.questions;
      schedules?: typeof context.localStore.schedules;
    };
    context.localStore = {
      exams: parsed.exams ?? [],
      questions: parsed.questions ?? [],
      schedules: parsed.schedules ?? [],
    };
    context.localStoreLoaded = true;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      context.localStoreLoaded = true;
      return;
    }
    rethrowAsInternal(
      error,
      `Failed to load local exam records from ${context.localStorePath}`,
    );
  }
}

export async function persistLocalStore(context: ExamsStoreContext) {
  if (context.databaseService.isConfigured()) return;
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
      `Failed to persist local exam records to ${context.localStorePath}`,
    );
  }
}

export async function createExamRecordsInDatabase(
  context: ExamsStoreContext,
  examInsert: ExamRecord,
  questionInserts: ExamQuestionRecord[],
  scheduleInserts: ExamScheduleRecord[],
) {
  await context.databaseService.execute(
    `INSERT INTO exams (id, title, duration_minutes, report_release_mode, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      examInsert.id,
      examInsert.title,
      examInsert.durationMinutes,
      examInsert.reportReleaseMode,
      examInsert.status,
      examInsert.createdAt,
      examInsert.updatedAt,
    ],
  );
  await insertRelatedExamRecords(context, questionInserts, scheduleInserts);
}

async function insertRelatedExamRecords(
  context: ExamsStoreContext,
  questionInserts: ExamQuestionRecord[],
  scheduleInserts: ExamScheduleRecord[],
) {
  for (const question of questionInserts) {
    await context.databaseService.execute(
      `INSERT INTO exam_questions (id, exam_id, type, prompt, options_json, correct_answer, points, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        question.id,
        question.examId,
        question.type,
        question.prompt,
        question.optionsJson,
        question.correctAnswer,
        question.points,
        question.displayOrder,
      ],
    );
  }
  for (const schedule of scheduleInserts) {
    await context.databaseService.execute(
      `INSERT INTO exam_schedules (id, exam_id, class_id, scheduled_date, scheduled_time) VALUES (?, ?, ?, ?, ?)`,
      [
        schedule.id,
        schedule.examId,
        schedule.classId,
        schedule.scheduledDate,
        schedule.scheduledTime,
      ],
    );
  }
}

export async function replaceExamRecordsInDatabase(
  context: ExamsStoreContext,
  examInsert: ExamRecord,
  questionInserts: ExamQuestionRecord[],
  scheduleInserts: ExamScheduleRecord[],
) {
  await context.databaseService.execute(
    `UPDATE exams SET title = ?, duration_minutes = ?, report_release_mode = ?, status = ?, updated_at = ? WHERE id = ?`,
    [
      examInsert.title,
      examInsert.durationMinutes,
      examInsert.reportReleaseMode,
      examInsert.status,
      examInsert.updatedAt,
      examInsert.id,
    ],
  );
  await context.databaseService.execute(
    'DELETE FROM exam_questions WHERE exam_id = ?',
    [examInsert.id],
  );
  await context.databaseService.execute(
    'DELETE FROM exam_schedules WHERE exam_id = ?',
    [examInsert.id],
  );
  await insertRelatedExamRecords(context, questionInserts, scheduleInserts);
}

export async function deleteExamRecordsInDatabase(
  context: ExamsStoreContext,
  examId: string,
) {
  await context.databaseService.execute(
    'DELETE FROM exam_questions WHERE exam_id = ?',
    [examId],
  );
  await context.databaseService.execute(
    'DELETE FROM exam_schedules WHERE exam_id = ?',
    [examId],
  );
  await context.databaseService.execute('DELETE FROM exams WHERE id = ?', [
    examId,
  ]);
}
