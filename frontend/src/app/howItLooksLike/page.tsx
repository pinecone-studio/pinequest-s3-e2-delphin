"use client";

import { useMemo, useState } from "react";
import { StudentShellFrame } from "@/components/student/student-shell-frame";
import { StudentExamHtmlCanvas } from "@/components/student/student-exam-html-canvas";
import { exams as legacyExams, type Exam } from "@/lib/mock-data";

function getPreviewExam() {
  return (
    legacyExams.find((exam) => {
      const questionTypes = new Set(
        exam.questions.map((question) => question.type),
      );
      return (
        questionTypes.has("multiple-choice") &&
        questionTypes.has("true-false") &&
        questionTypes.has("matching") &&
        questionTypes.has("fill") &&
        questionTypes.has("short-answer")
      );
    }) ?? legacyExams[0]
  );
}

export default function HowItLooksLikePage() {
  const exam = useMemo<Exam>(() => getPreviewExam(), []);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answeredCount = Object.values(answers).filter(
    (value) => value.trim().length > 0,
  ).length;
  const totalQuestions = exam.questions.length;
  const completionPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);

  return (
    <StudentShellFrame pathname="/student/exams">
      <StudentExamHtmlCanvas
        exam={exam}
        schedule={{ date: "2026-03-20", time: "09:00" }}
        studentClass="7A"
        studentName="Demo Student"
        answers={answers}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        completionPercent={completionPercent}
        unansweredCount={unansweredCount}
        isSubmitting={false}
        onAnswerChange={(questionId, value) =>
          setAnswers((current) => ({ ...current, [questionId]: value }))
        }
        onSubmit={() => {}}
        onBack={() => {}}
      />
    </StudentShellFrame>
  );
}
