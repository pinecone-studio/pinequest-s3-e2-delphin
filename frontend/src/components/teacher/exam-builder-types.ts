import type { ExamQuestion } from "@/lib/mock-data";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "essay";

export type ScheduleEntry = {
  classId: string;
  date: string;
  time: string;
};

export type NewQuestion = Omit<ExamQuestion, "id"> & {
  id: string;
};
