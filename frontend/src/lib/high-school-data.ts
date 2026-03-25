import { classes, getClassById, getStudentById, students, type Exam, type ExamResult } from "@/lib/mock-data";

export const exams: Exam[] = [
  { id: "e1", title: "Algebra Foundations Test", questions: [{ id: "q1", type: "multiple-choice", question: "Solve: 3x + 5 = 20", options: ["x = 3", "x = 5", "x = 7", "x = 10"], correctAnswer: "x = 5", points: 10 }, { id: "q2", type: "true-false", question: "The square root of 49 is 7.", correctAnswer: "True", points: 5 }, { id: "q3", type: "short-answer", question: "Write the slope-intercept form of a linear equation.", correctAnswer: "y = mx + b", points: 10 }, { id: "q4", type: "multiple-choice", question: "Which expression is equivalent to 4(a + 2)?", options: ["4a + 2", "4a + 8", "a + 8", "8a + 2"], correctAnswer: "4a + 8", points: 10 }, { id: "q5", type: "essay", question: "Explain one reliable way to check whether a solution to an equation is correct.", points: 15 }], duration: 45, scheduledClasses: [{ classId: "10A", date: "2026-03-20", time: "09:00" }, { classId: "10B", date: "2026-03-20", time: "14:00" }], createdAt: "2026-03-15", status: "completed" },
  { id: "e2", title: "Geometry Reasoning Quiz", questions: [{ id: "q6", type: "multiple-choice", question: "What is the sum of the interior angles in a triangle?", options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"], correctAnswer: "180 degrees", points: 10 }, { id: "q7", type: "true-false", question: "A square is always a rectangle.", correctAnswer: "True", points: 5 }, { id: "q8", type: "short-answer", question: "Write the formula for the area of a circle.", correctAnswer: "A = pi r^2", points: 10 }], duration: 30, scheduledClasses: [{ classId: "10A", date: "2026-03-25", time: "10:00" }], createdAt: "2026-03-18", status: "scheduled" },
  { id: "e3", title: "English Reading Assessment", questions: [{ id: "q9", type: "multiple-choice", question: "What does the term main idea mean in a reading passage?", options: ["A supporting detail", "The central message", "A new vocabulary word", "The author's signature"], correctAnswer: "The central message", points: 10 }, { id: "q10", type: "true-false", question: "A claim in an essay should be supported with evidence.", correctAnswer: "True", points: 5 }, { id: "q11", type: "short-answer", question: "Name one clue that helps a reader identify tone.", correctAnswer: "Word choice", points: 10 }], duration: 60, scheduledClasses: [{ classId: "10A", date: "2026-03-27", time: "11:00" }, { classId: "10B", date: "2026-03-27", time: "13:00" }, { classId: "10C", date: "2026-03-27", time: "15:00" }], createdAt: "2026-03-20", status: "scheduled" },
];

export const examResults: ExamResult[] = [
  { examId: "e1", studentId: "s1", score: 45, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "True", isCorrect: true }, { questionId: "q3", answer: "y = mx + b", isCorrect: true }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Substitute the value back into the equation.", isCorrect: true }], submittedAt: "2026-03-20T09:40:00" },
  { examId: "e1", studentId: "s2", score: 35, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "False", isCorrect: false }, { questionId: "q3", answer: "y = b + m", isCorrect: false }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Check the equation again.", isCorrect: true }], submittedAt: "2026-03-20T09:38:00" },
  { examId: "e1", studentId: "s3", score: 40, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "True", isCorrect: true }, { questionId: "q3", answer: "mx + b", isCorrect: false }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Replace x and verify both sides are equal.", isCorrect: true }], submittedAt: "2026-03-20T09:42:00" },
  { examId: "e1", studentId: "s4", score: 30, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 7", isCorrect: false }, { questionId: "q2", answer: "False", isCorrect: false }, { questionId: "q3", answer: "y = mx + b", isCorrect: true }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Test the answer in the original equation.", isCorrect: true }], submittedAt: "2026-03-20T09:44:00" },
  { examId: "e1", studentId: "s5", score: 50, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "True", isCorrect: true }, { questionId: "q3", answer: "y = mx + b", isCorrect: true }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Substitute the solution and compare both sides.", isCorrect: true }], submittedAt: "2026-03-20T09:35:00" },
  { examId: "e1", studentId: "s6", score: 38, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "True", isCorrect: true }, { questionId: "q3", answer: "mx + b", isCorrect: false }, { questionId: "q4", answer: "4a + 2", isCorrect: false }, { questionId: "q5", answer: "Check by substitution.", isCorrect: true }], submittedAt: "2026-03-20T14:40:00" },
  { examId: "e1", studentId: "s7", score: 42, totalPoints: 50, answers: [{ questionId: "q1", answer: "x = 5", isCorrect: true }, { questionId: "q2", answer: "True", isCorrect: true }, { questionId: "q3", answer: "y = mx + b", isCorrect: true }, { questionId: "q4", answer: "4a + 8", isCorrect: true }, { questionId: "q5", answer: "Plug the value into the starting equation.", isCorrect: false }], submittedAt: "2026-03-20T14:38:00" },
];

export const classSchedule = [
  { classId: "10A", day: "Monday", time: "09:00-10:30", subject: "Mathematics" },
  { classId: "10A", day: "Wednesday", time: "09:00-10:30", subject: "English Language" },
  { classId: "10B", day: "Monday", time: "14:00-15:30", subject: "Mathematics" },
  { classId: "10B", day: "Thursday", time: "14:00-15:30", subject: "English Language" },
  { classId: "10C", day: "Tuesday", time: "11:00-12:30", subject: "Mathematics" },
  { classId: "10C", day: "Friday", time: "11:00-12:30", subject: "English Literature" },
];

export { classes, getClassById, getStudentById };

export function getExamsForClass(classId: string) {
  return exams.filter((exam) => exam.scheduledClasses.some((scheduledClass) => scheduledClass.classId === classId));
}

export function getExamResults(examId: string, classId?: string) {
  const results = examResults.filter((result) => result.examId === examId);
  if (!classId) return results;
  const classStudentIds = students.filter((student) => student.classId === classId).map((student) => student.id);
  return results.filter((result) => classStudentIds.includes(result.studentId));
}

export function getQuestionStats(examId: string) {
  const exam = exams.find((item) => item.id === examId);
  if (!exam) return [];
  return exam.questions.map((question) => {
    const answers = examResults.flatMap((result) => result.examId === examId ? result.answers.filter((answer) => answer.questionId === question.id) : []);
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    return { questionId: question.id, question: question.question, type: question.type, correctCount, totalCount: answers.length, failRate: answers.length > 0 ? ((answers.length - correctCount) / answers.length) * 100 : 0 };
  }).sort((left, right) => right.failRate - left.failRate);
}
