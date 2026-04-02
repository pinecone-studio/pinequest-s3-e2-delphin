export interface Student {
  id: string
  name: string
  email: string
  password: string
  classId: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  password: string
  subject: string
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
  type:
    | "multiple-choice"
    | "true-false"
    | "matching"
    | "ordering"
    | "short-answer"
    | "fill"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

export interface Exam {
  id: string
  title: string
  questions: ExamQuestion[]
  duration: number
  reportReleaseMode: "after-all-classes-complete" | "immediately"
  scheduledClasses: {
    classId: string
    date: string
    time: string
  }[]
  createdAt: string
  status: "draft" | "scheduled" | "completed"
}

export interface ExamResult {
  examId: string
  studentId: string
  classId?: string
  score: number
  totalPoints: number
  answers: {
    questionId: string
    answer: string
    isCorrect: boolean | null
    awardedPoints?: number | null
    reviewStatus?: "auto-correct" | "auto-wrong" | "pending" | "graded"
  }[]
  submittedAt: string
}
