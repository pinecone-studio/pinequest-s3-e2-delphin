import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE4 = createMathCompletedExam({
  id: "e4",
  title: "Илэрхийлэл ба тэгшитгэл",
  date: "2026-02-28",
  time: "13:40",
  createdAt: "2026-02-22",
  questions: [
    { id: "e4q1", sourceQuestionId: "bank-math-e4-01", categoryName: "Илэрхийлэл", topicName: "Ижил гишүүн", difficulty: "easy", type: "multiple-choice", question: "3x + 2x хэдтэй тэнцүү вэ?", options: ["5x", "6x", "x²", "3x²"], correctAnswer: "5x", points: 4 },
    { id: "e4q2", sourceQuestionId: "bank-math-e4-02", categoryName: "Илэрхийлэл", topicName: "Орлуулах", difficulty: "medium", type: "short-answer", question: "x = 4 бол 2x + 3 илэрхийллийн утгыг ол.", correctAnswer: "11", points: 6 },
    { id: "e4q3", sourceQuestionId: "bank-math-e4-03", categoryName: "Илэрхийлэл", topicName: "Хаалт задлах", difficulty: "hard", type: "short-answer", question: "3(a + 2) илэрхийллийг задлан бич.", correctAnswer: "3a + 6", points: 8 },
    { id: "e4q4", sourceQuestionId: "bank-math-e4-04", categoryName: "Нэг хувьсагчтай тэгшитгэл", topicName: "Нэмэх хасах", difficulty: "easy", type: "true-false", question: "x + 5 = 12 тэгшитгэлийн шийд нь 7.", correctAnswer: "True", points: 4 },
    { id: "e4q5", sourceQuestionId: "bank-math-e4-05", categoryName: "Нэг хувьсагчтай тэгшитгэл", topicName: "Үржүүлэх хуваах", difficulty: "medium", type: "short-answer", question: "3x = 21 бол x хэд вэ?", correctAnswer: "7", points: 6 },
    { id: "e4q6", sourceQuestionId: "bank-math-e4-06", categoryName: "Нэг хувьсагчтай тэгшитгэл", topicName: "Хаалттай тэгшитгэл", difficulty: "hard", type: "multiple-choice", question: "2(x + 1) = 10 бол x хэд вэ?", options: ["3", "4", "5", "6"], correctAnswer: "4", points: 8 },
    { id: "e4q7", sourceQuestionId: "bank-math-e4-07", categoryName: "Текст бодлого", topicName: "Насны бодлого", difficulty: "easy", type: "multiple-choice", question: "Болормаа 9 настай, дүү нь түүнээс 2 насаар бага. Дүү хэдэн настай вэ?", options: ["6", "7", "8", "11"], correctAnswer: "7", points: 4 },
    { id: "e4q8", sourceQuestionId: "bank-math-e4-08", categoryName: "Текст бодлого", topicName: "Мөнгөний бодлого", difficulty: "medium", type: "short-answer", question: "Нэг харандаа 500 төгрөг. 6 ширхэг авбал нийт хэд болох вэ?", correctAnswer: "3000", points: 6 },
    { id: "e4q9", sourceQuestionId: "bank-math-e4-09", categoryName: "Текст бодлого", topicName: "Тэгшитгэл байгуулах", difficulty: "hard", type: "ordering", question: "Текст бодлогыг тэгшитгэлээр бодох дарааллыг сонго.", options: ["Шийдийг шалгана", "Тэгшитгэл байгуулна", "Өгөгдлөө уншина", "Тэгшитгэлээ бодно"], correctAnswer: "3,2,4,1", points: 8 },
    { id: "e4q10", sourceQuestionId: "bank-math-e4-10", categoryName: "Шалгалт", topicName: "Орлуулж шалгах", difficulty: "easy", type: "true-false", question: "x=3 утгыг x+4=7 тэгшитгэлд орлуулбал зөв болно.", correctAnswer: "True", points: 4 },
    { id: "e4q11", sourceQuestionId: "bank-math-e4-11", categoryName: "Шалгалт", topicName: "Шийд олох", difficulty: "medium", type: "short-answer", question: "y-8=15 тэгшитгэлийн шийдийг ол.", correctAnswer: "23", points: 6 },
    { id: "e4q12", sourceQuestionId: "bank-math-e4-12", categoryName: "Шалгалт", topicName: "Эсрэг шалгалт", difficulty: "hard", type: "multiple-choice", question: "Доорх аль нь 2x+1=11 тэгшитгэлийн зөв шийд вэ?", options: ["x=4", "x=5", "x=6", "x=10"], correctAnswer: "x=5", points: 8 },
  ],
});
