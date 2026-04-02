import type { Student } from "@/lib/mock-data-types"

export const classHomeroomTeachers: Record<string, { name: string; subject: string }> = {
  "10A": { name: "Э. Наранцацралт", subject: "Математикийн багш" },
  "10B": { name: "Б. Тэмүүлэн", subject: "Математикийн багш" },
  "10C": { name: "С. Оюунгэрэл", subject: "Математикийн багш" },
}

export const studentSeedData: Student[] = [
  { id: "s1", name: "Бат-Эрдэнэ", email: "baterdene@school.com", password: "baterdene123", classId: "10B" },
  { id: "s2", name: "Сарангэрэл", email: "sarangerel@school.com", password: "sarangerel123", classId: "10B" },
  { id: "s3", name: "Тэмүүлэн", email: "temuulen@school.com", password: "temuulen123", classId: "10B" },
  { id: "s4", name: "Номин", email: "nomin@school.com", password: "nomin123", classId: "10C" },
  { id: "s5", name: "Энхжин", email: "enkhjin@school.com", password: "enkhjin123", classId: "10C" },
  { id: "judge1", name: "Бат-Оргил.Э", email: "bat-orgil.e@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge2", name: "Эрдэнэгомбо.М", email: "erdenegombo.m@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge3", name: "Анар.Т", email: "anar.t@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge4", name: "Болор.Э", email: "bolor.e@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge5", name: "Буяндэлгэр.Т", email: "buyndelger.t@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge6", name: "Өсөхбаяр.Ж", email: "usukhbayar.g@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge7", name: "Түвшин.О", email: "tuvshin.o@demo.local", password: "judge-demo", classId: "10A" },
  { id: "judge8", name: "Өгөөмөр.Л", email: "uguumur.l@demo.local", password: "judge-demo", classId: "10A" },
  { id: "s6", name: "Мөнх-Оргил", email: "munkhorgil@school.com", password: "munkhorgil123", classId: "10B" },
  { id: "s7", name: "Анударь", email: "anudari@school.com", password: "anudari123", classId: "10B" },
  { id: "s8", name: "Билгүүн", email: "bilguun@school.com", password: "bilguun123", classId: "10B" },
  { id: "s9", name: "Гэрэлмаа", email: "gerelmaa@school.com", password: "gerelmaa123", classId: "10C" },
  { id: "s10", name: "Дөлгөөн", email: "dulguun@school.com", password: "dulguun123", classId: "10C" },
  { id: "s11", name: "Төгөлдөр", email: "tuguldur@school.com", password: "tuguldur123", classId: "10C" },
  { id: "s12", name: "Хулан", email: "khulan@school.com", password: "khulan123", classId: "10C" },
  { id: "s13", name: "Отгонбаяр", email: "otgonbayar@school.com", password: "otgonbayar123", classId: "10C" },
  { id: "s14", name: "Баярмаа", email: "bayarmaa@school.com", password: "bayarmaa123", classId: "10C" },
  { id: "s15", name: "Сүхбат", email: "sukhbat@school.com", password: "sukhbat123", classId: "10C" },
  { id: "s16", name: "Нандин", email: "nandin@school.com", password: "nandin123", classId: "10B" },
]
