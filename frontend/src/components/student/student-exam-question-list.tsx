"use client";

import type { ExamQuestion } from "@/lib/mock-data";
import { StudentExamQuestionContent } from "@/components/student/student-exam-question-content";

export function StudentExamQuestionList(props: {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  const { questions, answers, onAnswerChange } = props;

  return (
    <div className="w-full max-w-[1023px] space-y-6">
      {questions.map((question, index) => (
        <StudentExamQuestionContent
          key={question.id}
          index={index}
          question={question}
          value={answers[question.id] ?? ""}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  );
}
