import type { DateRange } from "react-day-picker";
import type { TeacherExam } from "@/lib/teacher-exams";

export function isExamLiveNow(exam: TeacherExam, now = new Date()) {
  if (exam.status !== "scheduled") {
    return false;
  }

  const currentTime = now.getTime();

  return exam.scheduledClasses.some((schedule) => {
    const start = new Date(`${schedule.date}T${schedule.time}:00`).getTime();

    if (Number.isNaN(start)) {
      return false;
    }

    const end = start + exam.duration * 60 * 1000;
    return start <= currentTime && currentTime < end;
  });
}

export function isExamLaunchReady(exam: TeacherExam, now = new Date()) {
  if (exam.status === "completed" || isExamLiveNow(exam, now)) {
    return false;
  }

  return exam.status === "draft" || exam.status === "scheduled";
}

export function getLaunchStatusLabel(exam: TeacherExam) {
  if (exam.scheduledClasses.length === 0) {
    return "Хуваарьгүй";
  }

  const nearestSchedule = exam.scheduledClasses
    .map((schedule) => ({
      ...schedule,
      timestamp: new Date(`${schedule.date}T${schedule.time}:00`).getTime(),
    }))
    .filter((schedule) => !Number.isNaN(schedule.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp)[0];

  return nearestSchedule
    ? `${nearestSchedule.date} • ${nearestSchedule.time}`
    : "Товлогдсон";
}

export function buildHistoryReviewLink(exam: TeacherExam) {
  const firstSchedule = exam.scheduledClasses[0];
  return firstSchedule
    ? `/teacher/classes/${firstSchedule.classId}/exam/${exam.id}`
    : `/teacher/exams/${exam.id}/monitoring`;
}

export function formatExamDateSummary(exam: TeacherExam) {
  const timestamps = exam.scheduledClasses
    .map((schedule) => new Date(`${schedule.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

  if (timestamps.length === 0) {
    return "Огноо байхгүй";
  }

  const first = timestamps[0];
  const last = timestamps[timestamps.length - 1];

  return first.getTime() === last.getTime()
    ? formatDisplayDate(first)
    : `${formatDisplayDate(first)} - ${formatDisplayDate(last)}`;
}

export function formatExamClassSummary(exam: TeacherExam) {
  const classIds = Array.from(
    new Set(exam.scheduledClasses.map((schedule) => schedule.classId)),
  );

  return classIds.length > 0 ? classIds.join(", ") : "Анги байхгүй";
}

export function isDateWithinRange(dateString: string, dateRange?: DateRange) {
  if (!dateRange?.from && !dateRange?.to) {
    return true;
  }

  const examDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(examDate.getTime())) {
    return false;
  }

  const from = dateRange.from ? startOfDay(dateRange.from) : null;
  const to = dateRange.to ? endOfDay(dateRange.to) : null;
  return (!from || examDate >= from) && (!to || examDate <= to);
}

export function formatCalendarDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
