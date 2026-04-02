import type { ExamResult } from "@/lib/mock-data-types"

export const examPerformanceOffsets: Record<string, number> = {
  e1: 0.02,
  e2: -0.01,
  e3: 0.01,
  e4: -0.02,
  e5: -0.03,
  e6: -0.01,
}

const strongStudents = new Set(["judge1", "judge3", "s7", "s16", "s11", "s13"])
const weakStudents = new Set(["judge5", "judge8", "s2", "s8", "s4", "s14"])

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
export const getAwardedPoints = (points: number, ratio: number) => clamp(Math.round(points * ratio), 0, points)
export const getStudentVariance = (studentId: string) =>
  ((studentId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7) - 3) * 0.01
export const getQuestionVariance = (seed: string) =>
  ((seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9) - 4) * 0.01

export function buildReviewStatus(
  awardedPoints: number,
  points: number,
): NonNullable<ExamResult["answers"][number]["reviewStatus"]> {
  return awardedPoints === points ? "auto-correct" : awardedPoints === 0 ? "auto-wrong" : "graded"
}

export function buildAnswerText(awardedPoints: number, correctAnswer: string, points: number, type: string) {
  if (awardedPoints === points) return correctAnswer
  if (awardedPoints === 0) {
    if (type === "true-false") return correctAnswer === "True" ? "False" : "True"
    if (type === "multiple-choice") return "Буруу сонголт"
    if (type === "ordering") return "1,3,2,4"
    if (type === "matching") return "A-4, B-3, C-2, D-1"
    return "Бодож эхэлсэн ч буруу гаргасан."
  }
  if (type === "short-answer") return `${correctAnswer} орчим гэж бодсон.`
  return type === "matching"
    ? "Хэсэгчлэн зөв тааруулсан."
    : type === "ordering"
      ? "Алхамын дарааллын нэг хэсгийг зөв тавьсан."
      : correctAnswer
}

export function getStudentProfile(studentId: string, classId: string) {
  const tier = strongStudents.has(studentId)
    ? { easy: 0.88, medium: 0.76, hard: 0.62 }
    : weakStudents.has(studentId)
      ? { easy: 0.52, medium: 0.34, hard: 0.18 }
      : { easy: 0.7, medium: 0.52, hard: 0.34 }
  const classOffset = classId === "10A" ? 0.02 : classId === "10C" ? -0.01 : 0
  const studentVariance = getStudentVariance(studentId)

  return {
    difficulty: {
      easy: clamp(tier.easy + classOffset + studentVariance, 0.08, 1),
      medium: clamp(tier.medium + classOffset + studentVariance * 0.8, 0.08, 1),
      hard: clamp(tier.hard + classOffset + studentVariance * 1.2, 0.08, 1),
    },
    categories: buildCategoryOffsets(studentId, classId, studentVariance),
  }
}

function buildCategoryOffsets(studentId: string, classId: string, studentVariance: number) {
  return {
    Бутархай: (studentId.endsWith("1") || studentId.endsWith("6") ? 0.03 : 0) + studentVariance,
    Харьцаа: (studentId.endsWith("2") || studentId.endsWith("7") ? 0.02 : -0.01) - studentVariance * 0.4,
    "Тоон шулуун": (studentId.endsWith("3") ? 0.02 : 0) + studentVariance * 0.2,
    Хувь: (studentId.endsWith("4") || studentId.endsWith("9") ? 0.03 : 0) + studentVariance * 0.3,
    Хөнгөлөлт: (studentId.endsWith("5") ? -0.02 : 0.01) - studentVariance * 0.2,
    Диаграмм: (classId === "10A" ? 0.01 : 0) + studentVariance * 0.4,
    Периметр: (studentId.endsWith("8") ? -0.02 : 0.01) + studentVariance * 0.2,
    Талбай: (classId === "10C" ? -0.01 : 0.01) + studentVariance * 0.5,
    "Дүрс байгуулалт": (studentId.endsWith("7") ? 0.02 : 0) - studentVariance * 0.1,
    Илэрхийлэл: (studentId.endsWith("1") || studentId.endsWith("3") ? 0.03 : 0) + studentVariance * 0.4,
    "Нэг хувьсагчтай тэгшитгэл": (studentId.endsWith("6") ? 0.02 : 0) + studentVariance * 0.3,
    "Текст бодлого": (studentId.endsWith("4") ? -0.02 : 0.01) - studentVariance * 0.2,
    Пропорц: (studentId.endsWith("2") || studentId.endsWith("9") ? 0.02 : 0) + studentVariance * 0.5,
    Масштаб: (classId === "10B" ? 0.01 : 0) + studentVariance * 0.4,
    "Нэгж хувиргалт": (classId === "10C" ? -0.01 : 0.01) + studentVariance * 0.3,
    "Хүснэгт ба график": (studentId.endsWith("5") ? 0.02 : 0) + studentVariance * 0.2,
    Дундаж: (studentId.endsWith("8") ? -0.02 : 0.01) - studentVariance * 0.3,
    "Энгийн магадлал": (studentId.endsWith("2") || studentId.endsWith("7") ? 0.02 : 0) + studentVariance * 0.5,
  }
}
