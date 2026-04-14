import {
  getStudentSchedule,
  type FinishedExamItem,
} from "@/components/student/student-exams-page-utils";
import type { Exam, ExamResult } from "@/lib/mock-data";
import { getScheduleEnd } from "@/lib/student-exam-time";

export function getScheduleStartTime(exam: Exam, studentClass: string) {
  const schedule = getStudentSchedule(exam, studentClass);
  return schedule
    ? new Date(`${schedule.date}T${schedule.time}:00`).getTime()
    : Number.MAX_SAFE_INTEGER;
}

export function getLatestResultsByExamId(results: ExamResult[]) {
  const resultMap = new Map<string, ExamResult>();

  results
    .slice()
    .sort(
      (left, right) =>
        new Date(right.submittedAt).getTime() -
        new Date(left.submittedAt).getTime(),
    )
    .forEach((result) => {
      if (!resultMap.has(result.examId)) {
        resultMap.set(result.examId, result);
      }
    });

  return resultMap;
}

export function getFinishedItemSortTime(
  item: FinishedExamItem,
  studentClass: string,
) {
  if (item.kind === "result") {
    return new Date(item.result.submittedAt).getTime();
  }

  const schedule = getStudentSchedule(item.exam, studentClass);
  return getScheduleEnd(
    schedule?.date || "",
    schedule?.time || "00:00",
    item.exam.duration,
    item.exam.availableIndefinitely,
  ).getTime();
}
