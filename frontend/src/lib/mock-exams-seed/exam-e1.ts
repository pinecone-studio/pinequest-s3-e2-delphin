import { createMathCompletedExam } from "@/lib/mock-exams-seed/create-math-completed-exam";

export const examE1 = createMathCompletedExam({
  id: "e1",
  title: "Бутархай ба харьцаа",
  date: "2026-01-18",
  time: "09:00",
  createdAt: "2026-01-11",
  questions: [
    { id: "e1q1", sourceQuestionId: "bank-math-e1-01", categoryName: "Бутархай", topicName: "Энгийн бутархай", difficulty: "easy", type: "multiple-choice", question: "1/4 ба 2/4 хоёрын ихийг сонго.", options: ["1/4", "2/4", "Тэнцүү", "Мэдэхгүй"], correctAnswer: "2/4", points: 4 },
    { id: "e1q2", sourceQuestionId: "bank-math-e1-02", categoryName: "Бутархай", topicName: "Адил нэртэй бутархай", difficulty: "medium", type: "short-answer", question: "3/8 + 2/8 хэд вэ?", correctAnswer: "5/8", points: 6 },
    { id: "e1q3", sourceQuestionId: "bank-math-e1-03", categoryName: "Бутархай", topicName: "Холимог тоо", difficulty: "hard", type: "short-answer", question: "11/4 бутархайг холимог тоо болго.", correctAnswer: "2 3/4", points: 8 },
    { id: "e1q4", sourceQuestionId: "bank-math-e1-04", categoryName: "Харьцаа", topicName: "Харьцааны ойлголт", difficulty: "easy", type: "true-false", question: "2:3 гэдэг нь 2-ыг 3-тай харьцуулж буйг илэрхийлнэ.", correctAnswer: "True", points: 4 },
    { id: "e1q5", sourceQuestionId: "bank-math-e1-05", categoryName: "Харьцаа", topicName: "Тэнцүү харьцаа", difficulty: "medium", type: "multiple-choice", question: "1:2-той тэнцүү харьцааг сонго.", options: ["2:3", "2:4", "3:4", "4:6"], correctAnswer: "2:4", points: 6 },
    { id: "e1q6", sourceQuestionId: "bank-math-e1-06", categoryName: "Харьцаа", topicName: "Харьцаа хялбаршуулах", difficulty: "hard", type: "short-answer", question: "12:18 харьцааг хамгийн энгийн хэлбэрт бич.", correctAnswer: "2:3", points: 8 },
    { id: "e1q7", sourceQuestionId: "bank-math-e1-07", categoryName: "Тоон шулуун", topicName: "Байрлал тодорхойлох", difficulty: "easy", type: "multiple-choice", question: "0 ба 1-ийн яг дунд ямар бутархай байрлах вэ?", options: ["1/4", "1/2", "3/4", "2/3"], correctAnswer: "1/2", points: 4 },
    { id: "e1q8", sourceQuestionId: "bank-math-e1-08", categoryName: "Тоон шулуун", topicName: "Бутархай тэмдэглэх", difficulty: "medium", type: "short-answer", question: "0-1 хооронд 4 тэнцүү хэсэгт хуваавал хоёр дахь цэг ямар бутархай вэ?", correctAnswer: "2/4", points: 6 },
    { id: "e1q9", sourceQuestionId: "bank-math-e1-09", categoryName: "Тоон шулуун", topicName: "Хэмжээ харьцуулах", difficulty: "hard", type: "matching", question: "Бутархайг тайлбартай нь тааруул.", options: ["1/2", "3/4", "1/4", "4/4"], correctAnswer: "A-2, B-3, C-1, D-4", points: 8 },
    { id: "e1q10", sourceQuestionId: "bank-math-e1-10", categoryName: "Эквивалент бутархай", topicName: "Тэнцүү бутархай", difficulty: "easy", type: "true-false", question: "1/2 ба 2/4 нь тэнцүү бутархай мөн.", correctAnswer: "True", points: 4 },
    { id: "e1q11", sourceQuestionId: "bank-math-e1-11", categoryName: "Эквивалент бутархай", topicName: "Өргөтгөх", difficulty: "medium", type: "short-answer", question: "2/3 бутархайг 6 нэртэй болго.", correctAnswer: "4/6", points: 6 },
    { id: "e1q12", sourceQuestionId: "bank-math-e1-12", categoryName: "Эквивалент бутархай", topicName: "Хураах", difficulty: "hard", type: "short-answer", question: "18/24 бутархайг хамгийн энгийн хэлбэрт оруул.", correctAnswer: "3/4", points: 8 },
  ],
});
