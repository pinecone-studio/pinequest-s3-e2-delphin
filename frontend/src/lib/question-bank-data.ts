import { type MockTest } from "@/lib/mock-data";

export const questionBankTests: MockTest[] = [
  { id: "mt1", name: "Algebra Foundations Mock", fileName: "algebra-foundations.pdf", fileType: "pdf", uploadedAt: "2026-03-10", teacherId: "teacher-math" },
  { id: "mt2", name: "Functions Practice Pack", fileName: "functions-practice.pdf", fileType: "pdf", uploadedAt: "2026-03-12", teacherId: "teacher-math" },
  { id: "mt3", name: "Reading Comprehension Quiz", fileName: "reading-comprehension.pdf", fileType: "pdf", uploadedAt: "2026-03-15", teacherId: "teacher-english" },
  { id: "mt4", name: "Essay Structure Mock", fileName: "essay-structure.pdf", fileType: "pdf", uploadedAt: "2026-03-18", teacherId: "teacher-english" },
];

export function getQuestionBankTestById(testId: string) {
  return questionBankTests.find((test) => test.id === testId);
}
