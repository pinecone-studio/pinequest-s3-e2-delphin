import { NotFoundException } from '@nestjs/common';
import type { ExamsStoreContext } from './exams.internal-types';
import { mapExamRecord } from './exams.transforms';
import {
  ensureLocalStoreLoaded,
  loadAllExamRecords,
  persistLocalStore,
} from './exams.store';
import type { CreateExamDto, Exam, UpdateExamDto } from './exams.types';

export async function findMappedExamOrThrow(
  context: ExamsStoreContext,
  id: string,
) {
  const { examRecords, questionRecords, scheduleRecords } =
    await loadAllExamRecords(context);
  const examRecord = examRecords.find((entry) => entry.id === id);
  if (!examRecord) throw new NotFoundException(`Exam ${id} not found`);
  return mapExamRecord(
    examRecord,
    questionRecords.filter((question) => question.examId === id),
    scheduleRecords.filter((schedule) => schedule.examId === id),
  );
}

export function buildNextExamPayload(
  existingExam: Exam,
  payload: UpdateExamDto,
): CreateExamDto {
  return {
    title: payload.title?.trim() || existingExam.title,
    durationMinutes: payload.durationMinutes ?? existingExam.durationMinutes,
    reportReleaseMode:
      payload.reportReleaseMode ?? existingExam.reportReleaseMode,
    status: (payload.status ?? existingExam.status) as CreateExamDto['status'],
    questions:
      payload.questions ??
      existingExam.questions.map((question) => ({
        type: question.type,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: question.points,
        order: question.order,
      })),
    schedules:
      payload.schedules ??
      existingExam.schedules.map((schedule) => ({
        classId: schedule.classId,
        date: schedule.date,
        time: schedule.time,
      })),
  };
}

export async function createExamLocally(
  context: ExamsStoreContext,
  examInsert: (typeof context.localStore.exams)[number],
  questionInserts: typeof context.localStore.questions,
  scheduleInserts: typeof context.localStore.schedules,
) {
  await ensureLocalStoreLoaded(context);
  context.localStore.exams.push(examInsert);
  context.localStore.questions.push(...questionInserts);
  context.localStore.schedules.push(...scheduleInserts);
  await persistLocalStore(context);
}

export async function updateExamLocally(
  context: ExamsStoreContext,
  examId: string,
  examInsert: (typeof context.localStore.exams)[number],
  questionInserts: typeof context.localStore.questions,
  scheduleInserts: typeof context.localStore.schedules,
) {
  await ensureLocalStoreLoaded(context);
  context.localStore.exams = context.localStore.exams.map((entry) =>
    entry.id === examId ? examInsert : entry,
  );
  context.localStore.questions = context.localStore.questions.filter(
    (entry) => entry.examId !== examId,
  );
  context.localStore.schedules = context.localStore.schedules.filter(
    (entry) => entry.examId !== examId,
  );
  context.localStore.questions.push(...questionInserts);
  context.localStore.schedules.push(...scheduleInserts);
  await persistLocalStore(context);
}

export async function removeExamLocally(
  context: ExamsStoreContext,
  examId: string,
) {
  await ensureLocalStoreLoaded(context);
  context.localStore.exams = context.localStore.exams.filter(
    (entry) => entry.id !== examId,
  );
  context.localStore.questions = context.localStore.questions.filter(
    (entry) => entry.examId !== examId,
  );
  context.localStore.schedules = context.localStore.schedules.filter(
    (entry) => entry.examId !== examId,
  );
  await persistLocalStore(context);
}
