import type { Exam } from "@/lib/mock-data-types";

export const exams: Exam[] = [
  {
    id: "e1",
    title: "Математикийн дунд шалгалт",
    questions: [
      { id: "q1", type: "multiple-choice", question: "2 + 3 × 4 = ?", options: ["20", "14", "24", "10"], correctAnswer: "14", points: 10 },
      { id: "q2", type: "true-false", question: "√16 = 5.", correctAnswer: "Худал", points: 5 },
      { id: "q3", type: "short-answer", question: "x + 5 = 12 бол x = ?", correctAnswer: "7", points: 10 },
      {
        id: "q4",
        type: "multiple-choice",
        question: "Тэгш өнцөгт гурвалжинд гипотенуз аль нь вэ?",
        options: ["Хамгийн урт тал", "Хамгийн богино тал", "Өндөр", "Суурь"],
        correctAnswer: "Хамгийн урт тал",
        points: 10,
      },
      { id: "q5", type: "essay", question: "Квадрат тэгшитгэлийг бодох аргуудыг тайлбарлана уу.", points: 15 },
    ],
    duration: 45,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [
      { classId: "10A", date: "2026-03-20", time: "09:00" },
      { classId: "10B", date: "2026-03-20", time: "14:00" },
    ],
    createdAt: "2026-03-15",
    status: "completed",
  },
  {
    id: "e2",
    title: "Нийгмийн ухааны сорил",
    questions: [
      {
        id: "q6",
        type: "multiple-choice",
        question: "Ардчилал гэж юу вэ?",
        options: ["Нэг хүний засаглал", "Ард түмний оролцоотой засаглал", "Цэргийн засаглал", "Хаант засаглал"],
        correctAnswer: "Ард түмний оролцоотой засаглал",
        points: 10,
      },
      { id: "q7", type: "true-false", question: "Монгол улс хаант засаглалтай.", correctAnswer: "Худал", points: 5 },
      { id: "q8", type: "short-answer", question: "Монгол Улсын нийслэл аль хот вэ?", correctAnswer: "Улаанбаатар", points: 10 },
    ],
    duration: 30,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [{ classId: "10A", date: "2026-03-25", time: "10:00" }],
    createdAt: "2026-03-18",
    status: "scheduled",
  },
  {
    id: "e3",
    title: "Физикийн шалгалт",
    questions: [
      {
        id: "q9",
        type: "multiple-choice",
        question: "Хурд = ?",
        options: ["Зам / хугацаа", "Хугацаа / зам", "Масс × хурдатгал", "Хүч / талбай"],
        correctAnswer: "Зам / хугацаа",
        points: 10,
      },
      { id: "q10", type: "true-false", question: "Хүчний нэгж нь Ньютон.", correctAnswer: "Үнэн", points: 5 },
    ],
    duration: 60,
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
