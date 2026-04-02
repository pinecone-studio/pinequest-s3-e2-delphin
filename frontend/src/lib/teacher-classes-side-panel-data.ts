import type { Class, ExamResult } from "@/lib/mock-data-types";
import type { TeacherExam } from "@/lib/teacher-exams";
import {
  getAwardedPoints,
  isMatchingDemoClassId,
  normalizeDemoClassId,
  normalizeExamDifficulty,
} from "@/lib/teacher-class-detail";

export type ClassDifficultyChartPoint = {
  classId: string;
  classLabel: string;
  easyRatio: number | null;
  mediumRatio: number | null;
  hardRatio: number | null;
  easyEarned: number;
  easyPossible: number;
  mediumEarned: number;
  mediumPossible: number;
  hardEarned: number;
  hardPossible: number;
};

export type StudentExamResult = {
  scorePercent: number;
  studentName: string;
  className: string;
  studentId: string;
  email: string;
};

type DifficultyTotals = Record<"easy" | "medium" | "hard", { earned: number; possible: number }>;

function createDifficultyTotals(): DifficultyTotals {
  return {
    easy: { earned: 0, possible: 0 },
    medium: { earned: 0, possible: 0 },
    hard: { earned: 0, possible: 0 },
  };
}

function toPercent(earned: number, possible: number) {
  if (possible <= 0) return null;
  return Math.round((earned / possible) * 100);
}

export function buildClassDifficultyChartData(args: {
  classOptions: Class[];
  exam: TeacherExam | null;
  examResults: ExamResult[];
}) {
  const { classOptions, exam, examResults } = args;
  if (!exam) return [] as ClassDifficultyChartPoint[];

  return classOptions.map((classItem) => {
    const totals = createDifficultyTotals();
    const classStudentIds = new Set(classItem.students.map((student) => student.id));
    const classResults = examResults.filter(
      (result) =>
        result.examId === exam.id &&
        (isMatchingDemoClassId(result.classId, classItem.id) ||
          classStudentIds.has(result.studentId)),
    );

    classResults.forEach((result) => {
      const answerMap = new Map(
        result.answers.map((answer) => [answer.questionId, answer]),
      );
      exam.questions.forEach((question) => {
        const difficulty = normalizeExamDifficulty(question.difficulty);
        const awardedPoints = getAwardedPoints(
          question.points,
          answerMap.get(question.id),
        );
        totals[difficulty].earned += awardedPoints;
        totals[difficulty].possible += question.points;
      });
    });

    return {
      classId: normalizeDemoClassId(classItem.id),
      classLabel: classItem.name.replace(" анги", ""),
      easyRatio: toPercent(totals.easy.earned, totals.easy.possible),
      mediumRatio: toPercent(totals.medium.earned, totals.medium.possible),
      hardRatio: toPercent(totals.hard.earned, totals.hard.possible),
      easyEarned: totals.easy.earned,
      easyPossible: totals.easy.possible,
      mediumEarned: totals.medium.earned,
      mediumPossible: totals.medium.possible,
      hardEarned: totals.hard.earned,
      hardPossible: totals.hard.possible,
    };
  });
}

export function buildMockStudentExamResults(args: {
  className: string;
  results: ExamResult[];
  students: Array<{ email: string; id: string; name: string }>;
}) {
  const { className, results, students } = args;
  const studentLookup = new Map(
    students.map((student) => [student.id, student]),
  );

  return results
    .map((result) => {
      const student = studentLookup.get(result.studentId);
      if (!student) return null;
      return {
        className,
        email: student.email,
        scorePercent:
          result.totalPoints > 0
            ? Math.round((result.score / result.totalPoints) * 100)
            : 0,
        studentId: student.id,
        studentName: student.name,
      } satisfies StudentExamResult;
    })
    .filter((result): result is StudentExamResult => Boolean(result))
    .sort((left, right) => right.scorePercent - left.scorePercent)
    .slice(0, 5);
}
