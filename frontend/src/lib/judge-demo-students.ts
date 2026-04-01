import { students } from "@/lib/mock-data"

const judgeDemoNames = [
  "Бат-Оргил.Э",
  "Эрдэнэгомбо.М",
  "Анар.Т",
  "Болор.Э",
  "Буяндэлгэр.Т",
  "Өсөхбаяр.Ж",
  "Түвшин.О",
  "Өгөөмөр.Л",
]

export const judgeDemoStudents = judgeDemoNames
  .map((name) => students.find((student) => student.name === name))
  .filter((student): student is (typeof students)[number] => Boolean(student))
