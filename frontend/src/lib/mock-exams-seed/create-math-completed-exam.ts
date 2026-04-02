import type { Exam } from "@/lib/mock-data-types";

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = Exam["questions"][number]["type"];

export type SeedQuestionInput = {
  id: string;
  sourceQuestionId: string;
  categoryName: string;
  topicName: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
};

export function createMathCompletedExam(args: {
  id: string;
  title: string;
  date: string;
  time: string;
  createdAt: string;
  questions: SeedQuestionInput[];
}): Exam {
  return {
    id: args.id,
    title: args.title,
    questions: args.questions,
    duration: 60,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [
      { classId: "10A", date: args.date, time: args.time },
      { classId: "10B", date: args.date, time: args.time },
      { classId: "10C", date: args.date, time: args.time },
    ],
    createdAt: args.createdAt,
    status: "completed",
  };
}
