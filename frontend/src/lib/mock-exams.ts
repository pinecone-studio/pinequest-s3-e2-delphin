import type { Exam } from "@/lib/mock-data-types";
import { examE1 } from "@/lib/mock-exams-seed/exam-e1";
import { examE2 } from "@/lib/mock-exams-seed/exam-e2";
import { examE3 } from "@/lib/mock-exams-seed/exam-e3";
import { examE4 } from "@/lib/mock-exams-seed/exam-e4";
import { examE5 } from "@/lib/mock-exams-seed/exam-e5";
import { examE6 } from "@/lib/mock-exams-seed/exam-e6";

function getRelativeDate(daysFromToday: number) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]!
}

const notificationTestExam: Exam = {
  id: "notification-test",
  title: "Notification test",
  questions: [
    {
      id: "q14",
      type: "multiple-choice",
      question: "This exam exists to test the student notification bell.",
      options: ["True", "False"],
      correctAnswer: "True",
      points: 5,
    },
  ],
  duration: 15,
  availableIndefinitely: true,
  reportReleaseMode: "immediately",
  scheduledClasses: [{ classId: "10B", date: getRelativeDate(1), time: "16:00" }],
  createdAt: new Date().toISOString(),
  status: "scheduled",
};

export const exams: Exam[] = [
  examE1,
  examE2,
  examE3,
  examE4,
  examE5,
  examE6,
  notificationTestExam,
];
