import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE2 = createMathCompletedExam({
  id: "e2",
  title: "Хувь ба хэрэглээ",
  date: "2026-03-20",
  time: "09:00",
  createdAt: "2026-03-15",
  questions: [
    { id: "e2q1", sourceQuestionId: "bank-math-e2-01", categoryName: "Хувь", topicName: "100-аас олох", difficulty: "easy", type: "multiple-choice", question: "100-ийн 25% хэд вэ?", options: ["20", "25", "30", "40"], correctAnswer: "25", points: 4 },
    { id: "e2q2", sourceQuestionId: "bank-math-e2-02", categoryName: "Хувь", topicName: "Хувь тооцоолох", difficulty: "medium", type: "short-answer", question: "60-ийн 15%-ийг ол.", correctAnswer: "9", points: 6 },
    { id: "e2q3", sourceQuestionId: "bank-math-e2-03", categoryName: "Хувь", topicName: "Нийт тоо олох", difficulty: "hard", type: "short-answer", question: "Нэг тооны 20% нь 14 бол тэр тоог ол.", correctAnswer: "70", points: 8 },
    { id: "e2q4", sourceQuestionId: "bank-math-e2-04", categoryName: "Хөнгөлөлт", topicName: "Үнэ бууралт", difficulty: "easy", type: "true-false", question: "10% хямдрал гэдэг нь үнийн аравны нэгийг хасна гэсэн үг.", correctAnswer: "True", points: 4 },
    { id: "e2q5", sourceQuestionId: "bank-math-e2-05", categoryName: "Хөнгөлөлт", topicName: "Шинэ үнэ", difficulty: "medium", type: "multiple-choice", question: "20000 төгрөгийн бараа 25% хямдарвал шинэ үнэ хэд вэ?", options: ["15000", "16000", "17000", "18000"], correctAnswer: "15000", points: 6 },
    { id: "e2q6", sourceQuestionId: "bank-math-e2-06", categoryName: "Хөнгөлөлт", topicName: "Нэмэлт өсөлт", difficulty: "hard", type: "short-answer", question: "8000 төгрөгийн дэвтрийн үнэ 10% өсөөд дараа нь 10% буув. Эцсийн үнэ хэд вэ?", correctAnswer: "7920", points: 8 },
    { id: "e2q7", sourceQuestionId: "bank-math-e2-07", categoryName: "Диаграмм", topicName: "Баганан диаграмм", difficulty: "easy", type: "multiple-choice", question: "Диаграммаас хамгийн өндөр багана юу илэрхийлэх вэ?", options: ["Хамгийн бага утга", "Хамгийн их утга", "Дундаж", "Тэнцүү утга"], correctAnswer: "Хамгийн их утга", points: 4 },
    { id: "e2q8", sourceQuestionId: "bank-math-e2-08", categoryName: "Диаграмм", topicName: "Өгөгдөл унших", difficulty: "medium", type: "short-answer", question: "Нийт 40 сурагчийн 25% нь сагс тоглодог бол хэдэн сурагч вэ?", correctAnswer: "10", points: 6 },
    { id: "e2q9", sourceQuestionId: "bank-math-e2-09", categoryName: "Диаграмм", topicName: "Харьцуулалт", difficulty: "hard", type: "matching", question: "Хувь ба тайлбарыг тааруул.", options: ["50%", "25%", "75%", "10%"], correctAnswer: "A-2, B-4, C-1, D-3", points: 8 },
    { id: "e2q10", sourceQuestionId: "bank-math-e2-10", categoryName: "Хувьсал", topicName: "Өсөлт", difficulty: "easy", type: "true-false", question: "Үнэ 5%-иар өсөхөд шинэ үнэ хуучнаасаа их болно.", correctAnswer: "True", points: 4 },
    { id: "e2q11", sourceQuestionId: "bank-math-e2-11", categoryName: "Хувьсал", topicName: "Өсөлт бууралт", difficulty: "medium", type: "short-answer", question: "5000 төгрөг 20%-иар өсвөл хэд болох вэ?", correctAnswer: "6000", points: 6 },
    { id: "e2q12", sourceQuestionId: "bank-math-e2-12", categoryName: "Хувьсал", topicName: "Хос өөрчлөлт", difficulty: "hard", type: "multiple-choice", question: "12000 төгрөгийн бараа 50% хямдарч, дараа нь 2000 төгрөгөөр нэмэгдвэл эцсийн үнэ хэд вэ?", options: ["6000", "7000", "8000", "10000"], correctAnswer: "8000", points: 8 },
  ],
});
