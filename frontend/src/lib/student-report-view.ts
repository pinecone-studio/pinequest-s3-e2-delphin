import type { Exam, ExamResult } from "@/lib/mock-data";

export const questionTypeLabels = {
  "multiple-choice": "Сонгох хариулттай",
  "true-false": "Үнэн / худал",
  fill: "Нөхөх",
  matching: "Харгалзуулах",
  ordering: "Дараалуулах",
  "short-answer": "Богино хариулт",
} as const;

export function getStudentExamSchedule(exam: Exam, studentClass: string) {
  return (
    exam.scheduledClasses.find((entry) => entry.classId === studentClass) ??
    exam.scheduledClasses[0]
  );
}

export function getResultPercentage(result: ExamResult) {
  return Math.round((result.score / result.totalPoints) * 100);
}

export function getExamTotalPoints(exam: Exam) {
  return exam.questions.reduce((sum, question) => sum + question.points, 0);
}

export function getNormalizedStudentExamResult(exam: Exam, result: ExamResult) {
  const questionMap = new Map(exam.questions.map((question) => [question.id, question]));
  const earnedPointsFromAnswers = result.answers.reduce((sum, answer) => {
    const question = questionMap.get(answer.questionId);
    if (!question || typeof answer.awardedPoints !== "number") {
      return sum;
    }

    return sum + Math.max(0, Math.min(answer.awardedPoints, question.points));
  }, 0);
  const totalPoints = Math.max(getExamTotalPoints(exam), 0);
  const hasSubmittedAnswers = result.answers.some((answer) => {
    const hasAnswerText = Boolean(answer.answer?.trim());
    const hasAwardedPoints = typeof answer.awardedPoints === "number";
    const hasReviewOutcome =
      typeof answer.isCorrect === "boolean" ||
      typeof answer.reviewStatus === "string";

    return hasAnswerText || hasAwardedPoints || hasReviewOutcome;
  });
  const hasMatchedAnswers = result.answers.some((answer) => questionMap.has(answer.questionId));
  const score = Math.max(
    0,
    Math.min(
      hasMatchedAnswers || !hasSubmittedAnswers ? earnedPointsFromAnswers : result.score,
      totalPoints,
    ),
  );

  return {
    score,
    totalPoints,
    percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
  };
}

function isFullyCorrectByPoints(
  question: Exam["questions"][number],
  answer: ExamResult["answers"][number] | undefined,
) {
  if (answer?.isCorrect === true) return true;
  if (typeof answer?.awardedPoints === "number") {
    return answer.awardedPoints >= question.points;
  }
  return false;
}

export function isManualReviewQuestionType(type: Exam["questions"][number]["type"]) {
  return type === "short-answer";
}

export function getAnswerReviewState(
  question: Exam["questions"][number],
  answer: ExamResult["answers"][number] | undefined,
) {
  const hasAnswer = Boolean(answer?.answer?.trim());

  if (!hasAnswer) return "unanswered" as const;
  if (answer?.reviewStatus === "auto-correct") return "correct" as const;
  if (answer?.reviewStatus === "auto-wrong") return "wrong" as const;
  if (answer?.reviewStatus === "pending") return "pending" as const;
  if (answer?.reviewStatus === "graded") return "graded" as const;
  if (isManualReviewQuestionType(question.type)) {
    return answer?.reviewStatus === "graded" ||
      typeof answer?.awardedPoints === "number" ||
      typeof answer?.isCorrect === "boolean"
      ? "graded"
      : "pending";
  }

  return answer?.isCorrect ? "correct" : "wrong";
}

export function getReportMetrics(exam: Exam, result: ExamResult) {
  const answerMap = new Map(result.answers.map((entry) => [entry.questionId, entry]));
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let pendingReviewCount = 0;
  let unansweredPoints = 0;
  let pendingPoints = 0;
  const normalized = getNormalizedStudentExamResult(exam, result);

  exam.questions.forEach((question) => {
    const answer = answerMap.get(question.id);
    const reviewState = getAnswerReviewState(question, answer);

    if (reviewState === "unanswered") {
      unansweredCount += 1;
      unansweredPoints += question.points;
    }
    else if (reviewState === "pending") {
      pendingReviewCount += 1;
      pendingPoints += question.points;
    }
    else if (reviewState === "correct") correctCount += 1;
    else if (reviewState === "wrong") wrongCount += 1;
    else if (reviewState === "graded") {
      if (isFullyCorrectByPoints(question, answer)) correctCount += 1;
      else wrongCount += 1;
    }
  });

  const totalPoints = normalized.totalPoints;
  const score = normalized.score;
  const finalizedPoints = Math.max(totalPoints - unansweredPoints - pendingPoints, 0);
  const earnedPoints = Math.min(score, finalizedPoints);
  const missedPoints = Math.max(finalizedPoints - earnedPoints, 0);

  return {
    totalQuestions: exam.questions.length,
    correctCount,
    wrongCount,
    unansweredCount,
    unansweredPoints: unansweredPoints + pendingPoints,
    pendingReviewCount,
    percentage: normalized.percentage,
    score,
    totalPoints,
    earnedPoints,
    missedPoints,
  };
}

export function getExamLetterGrade(percentage: number) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "F";
}

export function getStudentInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
