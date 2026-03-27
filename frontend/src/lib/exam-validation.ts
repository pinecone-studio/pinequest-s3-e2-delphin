import type { NewQuestion, ScheduleEntry } from '@/components/teacher/exam-builder-types'
import { ALL_CLASSES_OPTION } from '@/lib/exams-api'

export type ExamValidationSection = 'title' | 'questions' | 'settings' | 'schedule'

export type ExamValidationIssue = {
  message: string
  section: ExamValidationSection
}

export function validateExamPayloadInput({
  examTitle,
  duration,
  questions,
  scheduleEntries,
  status,
}: {
  examTitle?: string
  duration: number
  questions: NewQuestion[]
  scheduleEntries: ScheduleEntry[]
  status: 'draft' | 'scheduled'
}) {
  const errors: ExamValidationIssue[] = []

  if ((examTitle ?? '').trim().length === 0) {
    errors.push({ message: 'Шалгалтын нэр оруулна уу.', section: 'title' })
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    errors.push({
      message: 'Шалгалтын хугацаа 0-ээс их бүхэл тоо байх ёстой.',
      section: 'settings',
    })
  }

  questions.forEach((question, index) => {
    if (!question.question.trim()) {
      errors.push({
        message: `${index + 1}-р асуултын текст хоосон байна.`,
        section: 'questions',
      })
    }

    if (!Number.isInteger(question.points) || question.points <= 0) {
      errors.push({
        message: `${index + 1}-р асуултын оноо 0-ээс их байх ёстой.`,
        section: 'questions',
      })
    }

    if (
      question.type === 'multiple-choice' &&
      (!question.options ||
        question.options.length < 2 ||
        question.options.some((option) => !option.trim()))
    ) {
      errors.push({
        message: `${index + 1}-р сонгох асуултад дор хаяж 2 бөглөсөн сонголт хэрэгтэй.`,
        section: 'questions',
      })
    }
  })

  const seenSchedules = new Set<string>()
  scheduleEntries.forEach((entry, index) => {
    const values = [entry.classId.trim(), entry.date.trim(), entry.time.trim()]
    const filledCount = values.filter(Boolean).length

    if (filledCount === 0) {
      return
    }

    if (filledCount < values.length) {
      errors.push({
        message: `${index + 1}-р хуваарьт анги, огноо, цагийг бүрэн оруулна уу.`,
        section: 'schedule',
      })
      return
    }

    const scheduleKey = values.join('::')
    if (seenSchedules.has(scheduleKey)) {
      errors.push({
        message: `${index + 1}-р хуваарь давхардсан байна.`,
        section: 'schedule',
      })
      return
    }

    seenSchedules.add(scheduleKey)
  })

  const allClassesEntries = scheduleEntries.filter(
    (entry) => entry.classId.trim() === ALL_CLASSES_OPTION && entry.date.trim() && entry.time.trim(),
  )
  const explicitEntries = scheduleEntries.filter(
    (entry) =>
      entry.classId.trim() !== ALL_CLASSES_OPTION &&
      entry.classId.trim() &&
      entry.date.trim() &&
      entry.time.trim(),
  )

  allClassesEntries.forEach((entry, index) => {
    const overlapsExplicit = explicitEntries.some(
      (explicitEntry) =>
        explicitEntry.date.trim() === entry.date.trim() &&
        explicitEntry.time.trim() === entry.time.trim(),
    )

    if (overlapsExplicit) {
      errors.push({
        message: `Бүх анги гэсэн ${index + 1}-р хуваарь өөр ангитай ижил өдөр, цаг дээр давхцаж байна.`,
        section: 'schedule',
      })
    }
  })

  if (status === 'scheduled' && questions.length === 0) {
    errors.push({
      message: 'Шалгалт үүсгэхийн өмнө дор хаяж нэг асуулт нэмнэ үү.',
      section: 'questions',
    })
  }

  if (
    status === 'scheduled' &&
    !scheduleEntries.some((entry) => entry.classId && entry.date && entry.time)
  ) {
    errors.push({
      message: 'Шалгалт үүсгэхийн өмнө дор хаяж нэг бүрэн хуваарь оруулна уу.',
      section: 'schedule',
    })
  }

  return errors
}
