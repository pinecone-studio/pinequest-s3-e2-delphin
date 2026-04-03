import type { ExamResult } from "@/lib/mock-data-types";
import { students } from "@/lib/mock-students";
import { teacherLegacyMockExams } from "@/lib/teacher-legacy-mock-exams";
import { mapLegacyExamToTeacherExam, type TeacherExam } from "@/lib/teacher-exams";
import {
  buildAnswerText,
  buildReviewStatus,
  clamp,
  examPerformanceOffsets,
  getAwardedPoints,
  getQuestionVariance,
  getStudentProfile,
} from "@/lib/teacher-class-analytics-mock-helpers";

const analyticsExams = teacherLegacyMockExams;

const analyticsStudents = students.filter((student) =>
  analyticsExams.some((exam) =>
    exam.scheduledClasses.some(
      (schedule) => schedule.classId === student.classId,
    ),
  ),
);

function buildCompletedExamResult(
  exam: (typeof analyticsExams)[number],
  examIndex: number,
  student: (typeof analyticsStudents)[number],
  studentIndex: number,
): ExamResult {
  const profile = getStudentProfile(student.id, student.classId);
  const answers = exam.questions.map((question) => {
    const difficulty = (question.difficulty ?? "medium") as
      | "easy"
      | "medium"
      | "hard";
    const categoryOffset =
      profile.categories[
        (question.categoryName ?? "Алгебр") as keyof typeof profile.categories
      ] ?? 0;
    const questionVariance = getQuestionVariance(
      `${student.classId}-${student.id}-${exam.id}-${question.id}`,
    );
    const ratio = clamp(
      profile.difficulty[difficulty] +
        categoryOffset +
        (examPerformanceOffsets[exam.id] ?? 0) +
        questionVariance,
      0.08,
      1,
    );
    const awardedPoints = getAwardedPoints(question.points, ratio);
    return {
      questionId: question.id,
      awardedPoints,
      isCorrect:
        awardedPoints === question.points
          ? true
          : awardedPoints === 0
            ? false
            : null,
      answer: buildAnswerText(
        awardedPoints,
        question.correctAnswer ?? "",
        question.points,
        question.type,
      ),
      reviewStatus: buildReviewStatus(awardedPoints, question.points),
    };
  });

  const schedule =
    exam.scheduledClasses.find((entry) => entry.classId === student.classId) ??
    exam.scheduledClasses[0];
  const startMinute = Number(schedule.time.split(":")[1]);
  const startHour = Number(schedule.time.split(":")[0]);
  const finalMinuteCount =
    startMinute + 18 + (studentIndex % 8) * 3 + examIndex * 2;
  return {
    examId: exam.id,
    studentId: student.id,
    classId: student.classId,
    score: answers.reduce(
      (sum, answer) => sum + (answer.awardedPoints ?? 0),
      0,
    ),
    totalPoints: exam.questions.reduce(
      (sum, question) => sum + question.points,
      0,
    ),
    submittedAt: `${schedule.date}T${String(startHour + Math.floor(finalMinuteCount / 60)).padStart(2, "0")}:${String(finalMinuteCount % 60).padStart(2, "0")}:00`,
    answers,
  };
}

export const teacherClassAnalyticsMockExams: TeacherExam[] = analyticsExams.map(
  mapLegacyExamToTeacherExam,
);
export const teacherClassAnalyticsMockResults: ExamResult[] =
  analyticsExams.flatMap((exam, examIndex) =>
    analyticsStudents.map((student, studentIndex) =>
      buildCompletedExamResult(exam, examIndex, student, studentIndex),
    ),
  );
