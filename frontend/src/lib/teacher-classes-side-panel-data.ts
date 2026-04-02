export type ClassAveragePoint = {
  className: string
  averageScore: number
}

export type StudentExamResult = {
  scorePercent: number
  studentName: string
  className: string
  studentId: string
  email: string
}

// backend integration point: replace mock class averages with API response
export const mockClassAverageData: ClassAveragePoint[] = [
  { className: "10а", averageScore: 44 },
  { className: "10б", averageScore: 58 },
  { className: "10в", averageScore: 74 },
]

export function buildMockStudentExamResults(args: {
  className: string
  students: Array<{ email: string; id: string; name: string }>
}) {
  const { className, students } = args

  // backend integration point: replace student exam result mocks with exam results API
  return students.slice(0, 5).map((student, index) => ({
    className,
    email: student.email,
    scorePercent: [97, 80, 70, 66, 59][index] ?? 72,
    studentId: student.id,
    studentName: student.name,
  })) satisfies StudentExamResult[]
}
