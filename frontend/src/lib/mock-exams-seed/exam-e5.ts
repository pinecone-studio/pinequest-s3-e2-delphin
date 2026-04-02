import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE5 = createMathCompletedExam({
  id: "e5",
  title: "Пропорц ба масштаб",
  date: "2026-04-10",
  time: "08:30",
  createdAt: "2026-04-03",
  questions: [
    { id: "e5q1", sourceQuestionId: "bank-math-e5-01", categoryName: "Пропорц", topicName: "Тэнцүү харьцаа", difficulty: "easy", type: "multiple-choice", question: "2/3 = 4/x бол x хэд вэ?", options: ["5", "6", "7", "8"], correctAnswer: "6", points: 4 },
    { id: "e5q2", sourceQuestionId: "bank-math-e5-02", categoryName: "Пропорц", topicName: "Хувийн өсөлт", difficulty: "medium", type: "short-answer", question: "5 дэвтрийн үнэ 15000 төгрөг бол 1 дэвтэр хэд вэ?", correctAnswer: "3000", points: 6 },
    { id: "e5q3", sourceQuestionId: "bank-math-e5-03", categoryName: "Пропорц", topicName: "Пропорц бодлого", difficulty: "hard", type: "short-answer", question: "3 кг алим 12000 төгрөг бол 7 кг нь хэд вэ?", correctAnswer: "28000", points: 8 },
    { id: "e5q4", sourceQuestionId: "bank-math-e5-04", categoryName: "Масштаб", topicName: "Газрын зураг", difficulty: "easy", type: "true-false", question: "1:1000 масштаб гэдэг нь зураг дээрх 1 см бодит 1000 см-тэй тэнцүү.", correctAnswer: "True", points: 4 },
    { id: "e5q5", sourceQuestionId: "bank-math-e5-05", categoryName: "Масштаб", topicName: "Зураг унших", difficulty: "medium", type: "multiple-choice", question: "1:100 масштабтай зураг дээр 5 см байвал бодит урт хэд вэ?", options: ["50 см", "5 м", "500 см", "100 см"], correctAnswer: "500 см", points: 6 },
    { id: "e5q6", sourceQuestionId: "bank-math-e5-06", categoryName: "Масштаб", topicName: "Масштаб байгуулах", difficulty: "hard", type: "short-answer", question: "Бодит 8 м уртыг зураг дээр 4 см-ээр дүрсэлбэл масштаб хэд вэ?", correctAnswer: "1:200", points: 8 },
    { id: "e5q7", sourceQuestionId: "bank-math-e5-07", categoryName: "Нэгж хувиргалт", topicName: "Урт", difficulty: "easy", type: "multiple-choice", question: "3 м хэдэн см вэ?", options: ["30", "300", "3000", "3"], correctAnswer: "300", points: 4 },
    { id: "e5q8", sourceQuestionId: "bank-math-e5-08", categoryName: "Нэгж хувиргалт", topicName: "Жин", difficulty: "medium", type: "short-answer", question: "2 кг 500 г хэдэн грамм вэ?", correctAnswer: "2500", points: 6 },
    { id: "e5q9", sourceQuestionId: "bank-math-e5-09", categoryName: "Нэгж хувиргалт", topicName: "Хос бодлого", difficulty: "hard", type: "matching", question: "Хэмжээг нэгжтэй нь тааруул.", options: ["1.5 л", "2500 г", "120 см", "0.5 кг"], correctAnswer: "A-3, B-4, C-1, D-2", points: 8 },
    { id: "e5q10", sourceQuestionId: "bank-math-e5-10", categoryName: "Шууд хамаарал", topicName: "Хүснэгт", difficulty: "easy", type: "true-false", question: "Нэг дэвтэр 2000 төгрөг бол 2 дэвтэр 4000 төгрөг байна.", correctAnswer: "True", points: 4 },
    { id: "e5q11", sourceQuestionId: "bank-math-e5-11", categoryName: "Шууд хамаарал", topicName: "Үнэ тооцох", difficulty: "medium", type: "short-answer", question: "1 кг будаа 4500 төгрөг бол 4 кг нь хэд вэ?", correctAnswer: "18000", points: 6 },
    { id: "e5q12", sourceQuestionId: "bank-math-e5-12", categoryName: "Шууд хамаарал", topicName: "Харьцаат хүснэгт", difficulty: "hard", type: "multiple-choice", question: "3 сав ус 9 литр бол 7 сав ус хэдэн литр вэ?", options: ["18", "20", "21", "24"], correctAnswer: "21", points: 8 },
  ],
});
