import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE3 = createMathCompletedExam({
  id: "e3",
  title: "Периметр, талбай ба дүрс",
  date: "2026-02-14",
  time: "10:20",
  createdAt: "2026-02-08",
  questions: [
    { id: "e3q1", sourceQuestionId: "bank-math-e3-01", categoryName: "Периметр", topicName: "Тэгш өнцөгт", difficulty: "easy", type: "multiple-choice", question: "Урт 6, өргөн 3 бол периметр хэд вэ?", options: ["9", "18", "12", "24"], correctAnswer: "18", points: 4 },
    { id: "e3q2", sourceQuestionId: "bank-math-e3-02", categoryName: "Периметр", topicName: "Олон өнцөгт", difficulty: "medium", type: "short-answer", question: "Талууд нь 4, 5, 6 см гурвалжны периметрийг ол.", correctAnswer: "15", points: 6 },
    { id: "e3q3", sourceQuestionId: "bank-math-e3-03", categoryName: "Периметр", topicName: "Нийлмэл дүрс", difficulty: "hard", type: "short-answer", question: "Талууд нь 3, 3, 4, 4, 5, 5 см нийлмэл дүрсний периметр хэд вэ?", correctAnswer: "24", points: 8 },
    { id: "e3q4", sourceQuestionId: "bank-math-e3-04", categoryName: "Талбай", topicName: "Тэгш өнцөгт", difficulty: "easy", type: "true-false", question: "Талбайг олохдоо уртыг өргөнөөр үржүүлдэг.", correctAnswer: "True", points: 4 },
    { id: "e3q5", sourceQuestionId: "bank-math-e3-05", categoryName: "Талбай", topicName: "Параллелограмм", difficulty: "medium", type: "short-answer", question: "Суурь 8, өндөр 5 бол талбай хэд вэ?", correctAnswer: "40", points: 6 },
    { id: "e3q6", sourceQuestionId: "bank-math-e3-06", categoryName: "Талбай", topicName: "Нэгж квадрат", difficulty: "hard", type: "multiple-choice", question: "24 см² талбайтай, урт нь 8 см дүрсний өргөн хэд вэ?", options: ["2", "3", "4", "6"], correctAnswer: "3", points: 8 },
    { id: "e3q7", sourceQuestionId: "bank-math-e3-07", categoryName: "Дүрс байгуулалт", topicName: "Өнцөг таних", difficulty: "easy", type: "multiple-choice", question: "90° өнцгийг юу гэдэг вэ?", options: ["Хурц", "Мохоо", "Тэгш", "Шулуун"], correctAnswer: "Тэгш", points: 4 },
    { id: "e3q8", sourceQuestionId: "bank-math-e3-08", categoryName: "Дүрс байгуулалт", topicName: "Дүрсийн шинж", difficulty: "medium", type: "matching", question: "Дүрсийг шинжтэй нь тааруул.", options: ["Квадрат", "Тэгш өнцөгт", "Гурвалжин", "Тойрог"], correctAnswer: "A-2, B-1, C-3, D-4", points: 6 },
    { id: "e3q9", sourceQuestionId: "bank-math-e3-09", categoryName: "Дүрс байгуулалт", topicName: "Тор дээр байгуулах", difficulty: "hard", type: "short-answer", question: "Тор дээр 3 нэгж өргөн, 4 нэгж урт дүрс байгуулав. Периметр хэд вэ?", correctAnswer: "14", points: 8 },
    { id: "e3q10", sourceQuestionId: "bank-math-e3-10", categoryName: "Өнцөг", topicName: "Өнцөг хэмжих", difficulty: "easy", type: "true-false", question: "180° нь шулуун өнцөг мөн.", correctAnswer: "True", points: 4 },
    { id: "e3q11", sourceQuestionId: "bank-math-e3-11", categoryName: "Өнцөг", topicName: "Нийлбэр", difficulty: "medium", type: "short-answer", question: "Нэг шулуун дээрх хөрш хоёр өнцгийн нийлбэр хэд вэ?", correctAnswer: "180", points: 6 },
    { id: "e3q12", sourceQuestionId: "bank-math-e3-12", categoryName: "Өнцөг", topicName: "Тайлбар бодлого", difficulty: "hard", type: "multiple-choice", question: "Нэг өнцөг нь 35° бол түүнд хөрш шулуун өнцөг хэд байх вэ?", options: ["55°", "135°", "145°", "215°"], correctAnswer: "145°", points: 8 },
  ],
});
