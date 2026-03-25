// Mock data for the LMS

export interface Student {
  id: string
  name: string
  email: string
  password: string
  classId: string
}

export interface Class {
  id: string
  name: string
  students: Student[]
}

export interface MockTest {
  id: string
  name: string
  fileName: string
  fileType: string
  uploadedAt: string
  teacherId: string
}

export interface ExamQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

export interface Exam {
  id: string
  title: string
  questions: ExamQuestion[]
  duration: number // in minutes
  scheduledClasses: {
    classId: string
    date: string
    time: string
  }[]
  createdAt: string
  status: 'draft' | 'scheduled' | 'completed'
}

export interface ExamResult {
  examId: string
  studentId: string
  score: number
  totalPoints: number
  answers: {
    questionId: string
    answer: string
    isCorrect: boolean
  }[]
  submittedAt: string
}

// Mock Students
export const students: Student[] = [
  // Class 10A
  { id: 's1', name: 'Alice Johnson', email: 'alice@school.com', password: 'alice123', classId: '10A' },
  { id: 's2', name: 'Bob Smith', email: 'bob@school.com', password: 'bob123', classId: '10A' },
  { id: 's3', name: 'Charlie Brown', email: 'charlie@school.com', password: 'charlie123', classId: '10A' },
  { id: 's4', name: 'Diana Ross', email: 'diana@school.com', password: 'diana123', classId: '10A' },
  { id: 's5', name: 'Edward Lee', email: 'edward@school.com', password: 'edward123', classId: '10A' },
  // Class 10B
  { id: 's6', name: 'Fiona Green', email: 'fiona@school.com', password: 'fiona123', classId: '10B' },
  { id: 's7', name: 'George White', email: 'george@school.com', password: 'george123', classId: '10B' },
  { id: 's8', name: 'Hannah Black', email: 'hannah@school.com', password: 'hannah123', classId: '10B' },
  { id: 's9', name: 'Ivan Grey', email: 'ivan@school.com', password: 'ivan123', classId: '10B' },
  { id: 's10', name: 'Julia Red', email: 'julia@school.com', password: 'julia123', classId: '10B' },
  // Class 10C
  { id: 's11', name: 'Kevin Blue', email: 'kevin@school.com', password: 'kevin123', classId: '10C' },
  { id: 's12', name: 'Laura Pink', email: 'laura@school.com', password: 'laura123', classId: '10C' },
  { id: 's13', name: 'Mike Yellow', email: 'mike@school.com', password: 'mike123', classId: '10C' },
  { id: 's14', name: 'Nina Orange', email: 'nina@school.com', password: 'nina123', classId: '10C' },
  { id: 's15', name: 'Oscar Purple', email: 'oscar@school.com', password: 'oscar123', classId: '10C' },
]

// Mock Classes
export const classes: Class[] = [
  { id: '10A', name: 'Class 10A', students: students.filter(s => s.classId === '10A') },
  { id: '10B', name: 'Class 10B', students: students.filter(s => s.classId === '10B') },
  { id: '10C', name: 'Class 10C', students: students.filter(s => s.classId === '10C') },
]

// Mock Tests (Question Bank)
export const mockTests: MockTest[] = [
  { id: 'mt1', name: 'HTML Basics Test', fileName: 'html-basics.pdf', fileType: 'pdf', uploadedAt: '2026-03-10', teacherId: 'teacher1' },
  { id: 'mt2', name: 'CSS Fundamentals', fileName: 'css-fundamentals.pdf', fileType: 'pdf', uploadedAt: '2026-03-12', teacherId: 'teacher1' },
  { id: 'mt3', name: 'JavaScript Quiz', fileName: 'js-quiz.pdf', fileType: 'pdf', uploadedAt: '2026-03-15', teacherId: 'teacher1' },
  { id: 'mt4', name: 'Semester 1 Mock Exam', fileName: 'semester1-mock.pdf', fileType: 'pdf', uploadedAt: '2026-03-18', teacherId: 'teacher1' },
]

// Mock Exams
export const exams: Exam[] = [
  {
    id: 'e1',
    title: 'HTML Midterm Exam',
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language'], correctAnswer: 'Hyper Text Markup Language', points: 10 },
      { id: 'q2', type: 'true-false', question: 'HTML is a programming language.', correctAnswer: 'False', points: 5 },
      { id: 'q3', type: 'short-answer', question: 'What tag is used to create a hyperlink?', correctAnswer: '<a>', points: 10 },
      { id: 'q4', type: 'multiple-choice', question: 'Which tag is used for the largest heading?', options: ['<h6>', '<h1>', '<heading>', '<head>'], correctAnswer: '<h1>', points: 10 },
      { id: 'q5', type: 'essay', question: 'Explain the difference between block and inline elements.', points: 15 },
    ],
    duration: 45,
    scheduledClasses: [
      { classId: '10A', date: '2026-03-20', time: '09:00' },
      { classId: '10B', date: '2026-03-20', time: '14:00' },
    ],
    createdAt: '2026-03-15',
    status: 'completed',
  },
  {
    id: 'e2',
    title: 'CSS Styling Quiz',
    questions: [
      { id: 'q6', type: 'multiple-choice', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets', points: 10 },
      { id: 'q7', type: 'true-false', question: 'CSS can change the content of HTML elements.', correctAnswer: 'False', points: 5 },
      { id: 'q8', type: 'short-answer', question: 'What property is used to change text color?', correctAnswer: 'color', points: 10 },
    ],
    duration: 30,
    scheduledClasses: [
      { classId: '10A', date: '2026-03-25', time: '10:00' },
    ],
    createdAt: '2026-03-18',
    status: 'scheduled',
  },
  {
    id: 'e3',
    title: 'JavaScript Fundamentals',
    questions: [
      { id: 'q9', type: 'multiple-choice', question: 'Which keyword declares a constant?', options: ['var', 'let', 'const', 'constant'], correctAnswer: 'const', points: 10 },
      { id: 'q10', type: 'true-false', question: 'JavaScript is case-sensitive.', correctAnswer: 'True', points: 5 },
    ],
    duration: 60,
    scheduledClasses: [
      { classId: '10A', date: '2026-03-24', time: '11:00' },
      { classId: '10B', date: '2026-03-24', time: '13:00' },
      { classId: '10C', date: '2026-03-24', time: '15:00' },
    ],
    createdAt: '2026-03-20',
    status: 'scheduled',
  },
]

// Mock Exam Results (for completed exams)
export const examResults: ExamResult[] = [
  // 10A results for HTML Midterm
  { examId: 'e1', studentId: 's1', score: 45, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'False', isCorrect: true }, { questionId: 'q3', answer: '<a>', isCorrect: true }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Block elements take full width...', isCorrect: true }], submittedAt: '2026-03-20T09:40:00' },
  { examId: 'e1', studentId: 's2', score: 35, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'True', isCorrect: false }, { questionId: 'q3', answer: '<link>', isCorrect: false }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Block elements...', isCorrect: true }], submittedAt: '2026-03-20T09:38:00' },
  { examId: 'e1', studentId: 's3', score: 40, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'False', isCorrect: true }, { questionId: 'q3', answer: '<href>', isCorrect: false }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Block vs inline...', isCorrect: true }], submittedAt: '2026-03-20T09:42:00' },
  { examId: 'e1', studentId: 's4', score: 30, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'High Tech Modern Language', isCorrect: false }, { questionId: 'q2', answer: 'True', isCorrect: false }, { questionId: 'q3', answer: '<a>', isCorrect: true }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Explanation...', isCorrect: true }], submittedAt: '2026-03-20T09:44:00' },
  { examId: 'e1', studentId: 's5', score: 50, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'False', isCorrect: true }, { questionId: 'q3', answer: '<a>', isCorrect: true }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Perfect answer...', isCorrect: true }], submittedAt: '2026-03-20T09:35:00' },
  // 10B results for HTML Midterm
  { examId: 'e1', studentId: 's6', score: 38, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'True', isCorrect: false }, { questionId: 'q3', answer: '<a>', isCorrect: true }, { questionId: 'q4', answer: '<h1>', isCorrect: true }, { questionId: 'q5', answer: 'Block elements...', isCorrect: true }], submittedAt: '2026-03-20T14:40:00' },
  { examId: 'e1', studentId: 's7', score: 42, totalPoints: 50, answers: [{ questionId: 'q1', answer: 'Hyper Text Markup Language', isCorrect: true }, { questionId: 'q2', answer: 'False', isCorrect: true }, { questionId: 'q3', answer: '<a>', isCorrect: true }, { questionId: 'q4', answer: '<heading>', isCorrect: false }, { questionId: 'q5', answer: 'Explanation...', isCorrect: true }], submittedAt: '2026-03-20T14:38:00' },
]

// Class schedule (for teacher dashboard calendar)
export const classSchedule = [
  { classId: '10A', day: 'Monday', time: '09:00-10:30', subject: 'Web Development' },
  { classId: '10A', day: 'Wednesday', time: '09:00-10:30', subject: 'Web Development' },
  { classId: '10B', day: 'Monday', time: '14:00-15:30', subject: 'Web Development' },
  { classId: '10B', day: 'Thursday', time: '14:00-15:30', subject: 'Web Development' },
  { classId: '10C', day: 'Tuesday', time: '11:00-12:30', subject: 'Web Development' },
  { classId: '10C', day: 'Friday', time: '11:00-12:30', subject: 'Web Development' },
]

// Teacher info
export const teacher = {
  id: 'teacher1',
  name: 'Mr. Anderson',
  email: 'anderson@school.com',
  subject: 'Web Development',
}

// Helper functions
export function getClassById(id: string) {
  return classes.find(c => c.id === id)
}

export function getStudentById(id: string) {
  return students.find(s => s.id === id)
}

export function getExamsForClass(classId: string) {
  return exams.filter(e => e.scheduledClasses.some(sc => sc.classId === classId))
}

export function getExamResults(examId: string, classId?: string) {
  const results = examResults.filter(r => r.examId === examId)
  if (classId) {
    const classStudentIds = students.filter(s => s.classId === classId).map(s => s.id)
    return results.filter(r => classStudentIds.includes(r.studentId))
  }
  return results
}

export function getQuestionStats(examId: string) {
  const exam = exams.find(e => e.id === examId)
  if (!exam) return []
  
  const results = examResults.filter(r => r.examId === examId)
  
  return exam.questions.map(q => {
    const answers = results.flatMap(r => r.answers.filter(a => a.questionId === q.id))
    const correctCount = answers.filter(a => a.isCorrect).length
    const totalCount = answers.length
    return {
      questionId: q.id,
      question: q.question,
      type: q.type,
      correctCount,
      totalCount,
      failRate: totalCount > 0 ? ((totalCount - correctCount) / totalCount) * 100 : 0,
    }
  }).sort((a, b) => b.failRate - a.failRate)
}
