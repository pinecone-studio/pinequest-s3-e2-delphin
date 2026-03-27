import { exams } from "@/lib/mock-exams";
import type { Exam } from "@/lib/mock-data-types";

export const teacherDashboardExams: Exam[] = [
  exams[0],
  {
    id: "teacher-dashboard-math-exam",
    title: "Математикийн шалгалт",
    questions: [
      {
        id: "tdq1",
        type: "multiple-choice",
        question: "3x + 7 = 19 бол x = ?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        points: 10,
      },
      {
        id: "tdq2",
        type: "short-answer",
        question: "5, 10, 20, 40 дарааллын дараагийн гишүүнийг олно уу.",
        correctAnswer: "80",
        points: 10,
      },
      {
        id: "tdq3",
        type: "true-false",
        question: "Пифагорын теорем зөвхөн тэгш өнцөгт гурвалжинд хэрэглэгддэг.",
        correctAnswer: "Үнэн",
        points: 5,
      },
    ],
    duration: 40,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [
      { classId: "10A", date: "2026-03-24", time: "11:00" },
      { classId: "10B", date: "2026-03-24", time: "13:00" },
      { classId: "10C", date: "2026-03-24", time: "15:00" },
    ],
    createdAt: "2026-03-20",
    status: "scheduled",
  },
];
