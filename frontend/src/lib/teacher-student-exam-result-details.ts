import type { ExamResult } from "@/lib/mock-data-types";
import { getAwardedPoints } from "@/lib/teacher-class-detail";
import type { TeacherExam } from "@/lib/teacher-exams";

export function getAiScorePercent(exam: TeacherExam | null, result: ExamResult) {
  if (!exam) {
    return result.totalPoints > 0 ? (result.score / result.totalPoints) * 100 : 0;
  }

  const autoQuestionIds = new Set(exam.questions.filter((question) => question.type !== "short-answer").map((question) => question.id));
  const possiblePoints = exam.questions.filter((question) => autoQuestionIds.has(question.id)).reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = result.answers.reduce((sum, answer) => {
    if (!autoQuestionIds.has(answer.questionId)) return sum;
    return sum + (typeof answer.awardedPoints === "number" ? answer.awardedPoints : 0);
  }, 0);

  if (possiblePoints <= 0) {
    return result.totalPoints > 0 ? (result.score / result.totalPoints) * 100 : 0;
  }

  return (earnedPoints / possiblePoints) * 100;
}

export function getTeacherScorePercent(exam: TeacherExam | null, result: ExamResult) {
  if (!exam) {
    return result.totalPoints > 0 ? (result.score / result.totalPoints) * 100 : 0;
  }

  const manualQuestionIds = new Set(exam.questions.filter((question) => question.type === "short-answer").map((question) => question.id));
  const possiblePoints = exam.questions.filter((question) => manualQuestionIds.has(question.id)).reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = result.answers.reduce((sum, answer) => {
    if (!manualQuestionIds.has(answer.questionId)) return sum;
    return sum + (typeof answer.awardedPoints === "number" ? answer.awardedPoints : 0);
  }, 0);

  if (possiblePoints <= 0) {
    return result.totalPoints > 0 ? (result.score / result.totalPoints) * 100 : 0;
  }

  return (earnedPoints / possiblePoints) * 100;
}

export function buildPerformanceLabel(exam: TeacherExam | null) {
  if (!exam || exam.questions.length === 0) {
    return "Бүлэг, сэдвийн мэдээлэл алга";
  }

  const firstQuestion = exam.questions[0];
  const categoryName = firstQuestion.categoryName?.trim();
  const topicName = firstQuestion.topicName?.trim();

  if (categoryName && topicName) return `I-бүлэг: ${categoryName} / ${topicName} сэдэв`;
  if (categoryName) return `I-бүлэг: ${categoryName}`;
  if (topicName) return `${topicName} сэдэв`;
  return exam.title;
}

export function buildTeacherNote(exam: TeacherExam | null, result: ExamResult) {
  if (!exam || exam.questions.length === 0) {
    return "Шалгалтын үнэлгээний тайлбар хараахан бэлэн биш байна.";
  }

  const weakestQuestion = exam.questions.reduce<{ categoryName: string; topicName: string; ratio: number } | null>((lowest, question) => {
    const answer = result.answers.find((entry) => entry.questionId === question.id);
    const ratio = question.points > 0 ? getAwardedPoints(question.points, answer) / question.points : 0;
    const candidate = {
      categoryName: question.categoryName?.trim() || "Ерөнхий чадвар",
      topicName: question.topicName?.trim() || exam.title,
      ratio,
    };
    return !lowest || candidate.ratio < lowest.ratio ? candidate : lowest;
  }, null);

  if (!weakestQuestion) return `${exam.title}-ийн үнэлгээ хэвийн байна.`;
  if (weakestQuestion.ratio < 0.5) {
    return `Үр дүн: ${weakestQuestion.categoryName} бүлгийн ${weakestQuestion.topicName} сэдэв дээр анхаарах хэрэгтэй.`;
  }
  if (weakestQuestion.ratio < 0.75) {
    return `Үр дүн: ${weakestQuestion.topicName} сэдвийн ойлголтоо бататгавал дараагийн шалгалтад ахиц гарна.`;
  }
  return `Үр дүн: ${exam.title}-ийн даалгаврууд дээр тогтвортой сайн ажилласан байна.`;
}
