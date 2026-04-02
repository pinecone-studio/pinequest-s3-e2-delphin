import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE6 = createMathCompletedExam({
  id: "e6",
  title: "Өгөгдөл ба магадлал",
  date: "2026-04-24",
  time: "11:10",
  createdAt: "2026-04-17",
  questions: [
    { id: "e6q1", sourceQuestionId: "bank-math-e6-01", categoryName: "Хүснэгт ба график", topicName: "Хүснэгт унших", difficulty: "easy", type: "multiple-choice", question: "Хүснэгтэд хамгийн их давтамжтай утга юу вэ?", options: ["Хамгийн бага тоо", "Хамгийн их тоо", "Хамгийн олон давтагдсан тоо", "Дундаж"], correctAnswer: "Хамгийн олон давтагдсан тоо", points: 4 },
    { id: "e6q2", sourceQuestionId: "bank-math-e6-02", categoryName: "Хүснэгт ба график", topicName: "Баганан график", difficulty: "medium", type: "short-answer", question: "Нийт 28 сурагчийн 7 нь шатар тоглодог бол энэ нь хэдэн хувь вэ?", correctAnswer: "25%", points: 6 },
    { id: "e6q3", sourceQuestionId: "bank-math-e6-03", categoryName: "Хүснэгт ба график", topicName: "Өгөгдөл харьцуулах", difficulty: "hard", type: "short-answer", question: "12, 15, 15, 18, 20 өгөгдөлд хамгийн их ба хамгийн бага утгын зөрүүг ол.", correctAnswer: "8", points: 8 },
    { id: "e6q4", sourceQuestionId: "bank-math-e6-04", categoryName: "Дундаж", topicName: "Арифметик дундаж", difficulty: "easy", type: "true-false", question: "Дундажийг олохын тулд бүх утгыг нэмж гишүүдийн тоонд хуваана.", correctAnswer: "True", points: 4 },
    { id: "e6q5", sourceQuestionId: "bank-math-e6-05", categoryName: "Дундаж", topicName: "Медиан", difficulty: "medium", type: "short-answer", question: "2, 4, 5, 9, 10 өгөгдлийн медианыг ол.", correctAnswer: "5", points: 6 },
    { id: "e6q6", sourceQuestionId: "bank-math-e6-06", categoryName: "Дундаж", topicName: "Моод", difficulty: "hard", type: "multiple-choice", question: "3, 5, 5, 6, 8, 8, 8, 9 өгөгдлийн моод аль нь вэ?", options: ["5", "6", "8", "9"], correctAnswer: "8", points: 8 },
    { id: "e6q7", sourceQuestionId: "bank-math-e6-07", categoryName: "Энгийн магадлал", topicName: "Зоос", difficulty: "easy", type: "multiple-choice", question: "Шударга зоос шидэхэд сүлд гарах магадлал хэд вэ?", options: ["1/4", "1/3", "1/2", "1"], correctAnswer: "1/2", points: 4 },
    { id: "e6q8", sourceQuestionId: "bank-math-e6-08", categoryName: "Энгийн магадлал", topicName: "Шоо", difficulty: "medium", type: "short-answer", question: "Шоог нэг удаа хаяхад тэгш тоо гарах магадлалыг бич.", correctAnswer: "3/6", points: 6 },
    { id: "e6q9", sourceQuestionId: "bank-math-e6-09", categoryName: "Энгийн магадлал", topicName: "Магадлал харьцуулах", difficulty: "hard", type: "matching", question: "Нөхцөл ба магадлалыг тааруул.", options: ["Уутанд 1 улаан, 1 цэнхэр бөмбөг", "Шоонд 6 гарах", "Зоосонд сүлд гарах", "7 хоногт Ням гараг таарах"], correctAnswer: "A-3, B-4, C-2, D-1", points: 8 },
    { id: "e6q10", sourceQuestionId: "bank-math-e6-10", categoryName: "Санамсаргүй үзэгдэл", topicName: "Магадгүй эсэх", difficulty: "easy", type: "true-false", question: "Шоог нэг удаа хаяхад 7 гарах нь боломжгүй үзэгдэл.", correctAnswer: "True", points: 4 },
    { id: "e6q11", sourceQuestionId: "bank-math-e6-11", categoryName: "Санамсаргүй үзэгдэл", topicName: "Илүү магадлалтай", difficulty: "medium", type: "short-answer", question: "Уутанд 3 улаан, 1 цэнхэр бөмбөг байвал аль өнгө нь илүү магадлалтай гарах вэ?", correctAnswer: "улаан", points: 6 },
    { id: "e6q12", sourceQuestionId: "bank-math-e6-12", categoryName: "Санамсаргүй үзэгдэл", topicName: "Үзэгдэл ангилах", difficulty: "hard", type: "multiple-choice", question: "Шоог нэг удаа хаяхад 2 эсвэл 4 гарах магадлал хэд вэ?", options: ["1/6", "2/6", "3/6", "4/6"], correctAnswer: "2/6", points: 8 },
  ],
});
