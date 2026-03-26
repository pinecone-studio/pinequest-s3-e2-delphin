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
  reportReleaseMode: 'after-all-classes-complete' | 'immediately'
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
{ id: 's1', name: 'Бат-Эрдэнэ', email: 'baterdene@school.com', password: 'baterdene123', classId: '10A' },
{ id: 's2', name: 'Сарангэрэл', email: 'sarangerel@school.com', password: 'sarangerel123', classId: '10A' },
{ id: 's3', name: 'Тэмүүлэн', email: 'temuulen@school.com', password: 'temuulen123', classId: '10A' },
{ id: 's4', name: 'Номин', email: 'nomin@school.com', password: 'nomin123', classId: '10A' },
{ id: 's5', name: 'Энхжин', email: 'enkhjin@school.com', password: 'enkhjin123', classId: '10A' },

// Class 10B
{ id: 's6', name: 'Мөнх-Оргил', email: 'munkhorgil@school.com', password: 'munkhorgil123', classId: '10B' },
{ id: 's7', name: 'Анударь', email: 'anudari@school.com', password: 'anudari123', classId: '10B' },
{ id: 's8', name: 'Билгүүн', email: 'bilguun@school.com', password: 'bilguun123', classId: '10B' },
{ id: 's9', name: 'Гэрэлмаа', email: 'gerelmaa@school.com', password: 'gerelmaa123', classId: '10B' },
{ id: 's10', name: 'Дөлгөөн', email: 'dulguun@school.com', password: 'dulguun123', classId: '10B' },

// Class 10C
{ id: 's11', name: 'Төгөлдөр', email: 'tuguldur@school.com', password: 'tuguldur123', classId: '10C' },
{ id: 's12', name: 'Хулан', email: 'khulan@school.com', password: 'khulan123', classId: '10C' },
{ id: 's13', name: 'Отгонбаяр', email: 'otgonbayar@school.com', password: 'otgonbayar123', classId: '10C' },
{ id: 's14', name: 'Баярмаа', email: 'bayarmaa@school.com', password: 'bayarmaa123', classId: '10C' },
{ id: 's15', name: 'Сүхбат', email: 'sukhbat@school.com', password: 'sukhbat123', classId: '10C' },
]

// Mock Classes
export const classes: Class[] = [
  { id: '10A', name: 'Class 10A', students: students.filter(s => s.classId === '10A') },
  { id: '10B', name: 'Class 10B', students: students.filter(s => s.classId === '10B') },
  { id: '10C', name: 'Class 10C', students: students.filter(s => s.classId === '10C') },
]

// Mock Tests (Question Bank)
export const mockTests: MockTest[] = [
  { id: 'mt1', name: 'Математикийн дасгал', fileName: 'mathematics-test.pdf', fileType: 'pdf', uploadedAt: '2026-03-10', teacherId: 'teacher1' },
  { id: 'mt2', name: 'Нийгмийн ухааны шалгалт', fileName: 'social-studies-test.pdf', fileType: 'pdf', uploadedAt: '2026-03-12', teacherId: 'teacher1' },
  { id: 'mt3', name: 'Физикийн сорил', fileName: 'physics-quiz.pdf', fileType: 'pdf', uploadedAt: '2026-03-15', teacherId: 'teacher1' },
  { id: 'mt4', name: 'Нэгдсэн жишиг шалгалт', fileName: 'combined-mock-exam.pdf', fileType: 'pdf', uploadedAt: '2026-03-18', teacherId: 'teacher1' },
]

// Mock Exams
export const exams: Exam[] = [
  {
    id: 'e1',
    title: 'Математикийн дунд шалгалт',
    questions: [
      { id: 'q1', type: 'multiple-choice', question: '2 + 3 × 4 = ?', options: ['20', '14', '24', '10'], correctAnswer: '14', points: 10 },
      { id: 'q2', type: 'true-false', question: '√16 = 5.', correctAnswer: 'Худал', points: 5 },
      { id: 'q3', type: 'short-answer', question: 'x + 5 = 12 бол x = ?', correctAnswer: '7', points: 10 },
      { id: 'q4', type: 'multiple-choice', question: 'Тэгш өнцөгт гурвалжинд гипотенуз аль нь вэ?', options: ['Хамгийн урт тал', 'Хамгийн богино тал', 'Өндөр', 'Суурь'], correctAnswer: 'Хамгийн урт тал', points: 10 },
      { id: 'q5', type: 'essay', question: 'Квадрат тэгшитгэлийг бодох аргуудыг тайлбарлана уу.', points: 15 },
    ],
    duration: 45,
    reportReleaseMode: 'after-all-classes-complete',
    scheduledClasses: [
      { classId: '10A', date: '2026-03-20', time: '09:00' },
      { classId: '10B', date: '2026-03-20', time: '14:00' },
    ],
    createdAt: '2026-03-15',
    status: 'completed',
  },
  {
    id: 'e2',
    title: 'Нийгмийн ухааны сорил',
    questions: [
      { id: 'q6', type: 'multiple-choice', question: 'Ардчилал гэж юу вэ?', options: ['Нэг хүний засаглал', 'Ард түмний оролцоотой засаглал', 'Цэргийн засаглал', 'Хаант засаглал'], correctAnswer: 'Ард түмний оролцоотой засаглал', points: 10 },
      { id: 'q7', type: 'true-false', question: 'Монгол улс хаант засаглалтай.', correctAnswer: 'Худал', points: 5 },
      { id: 'q8', type: 'short-answer', question: 'Монгол Улсын нийслэл аль хот вэ?', correctAnswer: 'Улаанбаатар', points: 10 },
    ],
    duration: 30,
    reportReleaseMode: 'after-all-classes-complete',
    scheduledClasses: [
      { classId: '10A', date: '2026-03-25', time: '10:00' },
    ],
    createdAt: '2026-03-18',
    status: 'scheduled',
  },
  {
    id: 'e3',
    title: 'Физикийн шалгалт',
    questions: [
      { id: 'q9', type: 'multiple-choice', question: 'Хурд = ?', options: ['Зам / хугацаа', 'Хугацаа / зам', 'Масс × хурдатгал', 'Хүч / талбай'], correctAnswer: 'Зам / хугацаа', points: 10 },
      { id: 'q10', type: 'true-false', question: 'Хүчний нэгж нь Ньютон.', correctAnswer: 'Үнэн', points: 5 },
    ],
    duration: 60,
    reportReleaseMode: 'after-all-classes-complete',
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

function getScheduleEndTime(date: string, time: string, duration: number) {
  const start = new Date(`${date}T${time}:00`)
  return new Date(start.getTime() + duration * 60 * 1000)
}

export function getExamReportReleaseDate(exam: Exam) {
  if (exam.reportReleaseMode === 'immediately') {
    return null
  }

  return exam.scheduledClasses.reduce<Date | null>((latest, schedule) => {
    const endTime = getScheduleEndTime(schedule.date, schedule.time, exam.duration)
    if (!latest || endTime > latest) {
      return endTime
    }
    return latest
  }, null)
}

export function isExamReportAvailable(examId: string) {
  const exam = exams.find((entry) => entry.id === examId)
  if (!exam) {
    return false
  }

  if (exam.reportReleaseMode === 'immediately') {
    return true
  }

  const releaseDate = getExamReportReleaseDate(exam)
  if (!releaseDate) {
    return false
  }

  return new Date() >= releaseDate
}
