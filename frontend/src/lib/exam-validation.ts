import type { NewQuestion, ScheduleEntry } from '@/components/teacher/exam-builder-types'

export function validateExamPayloadInput({
  duration,
  questions,
  scheduleEntries,
  status,
}: {
  duration: number
  questions: NewQuestion[]
  scheduleEntries: ScheduleEntry[]
  status: 'draft' | 'scheduled'
}) {
  const errors: string[] = []

  if (!Number.isInteger(duration) || duration <= 0) {
    errors.push('Duration must be a positive whole number.')
  }

  questions.forEach((question, index) => {
    if (!question.question.trim()) {
      errors.push(`Question ${index + 1} cannot be empty.`)
    }

    if (!Number.isInteger(question.points) || question.points <= 0) {
      errors.push(`Question ${index + 1} must have a positive point value.`)
    }

    if (
      question.type === 'multiple-choice' &&
      (!question.options ||
        question.options.length < 2 ||
        question.options.some((option) => !option.trim()))
    ) {
      errors.push(`Multiple choice question ${index + 1} needs at least two filled options.`)
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
      errors.push(`Schedule ${index + 1} must include class, date, and time.`)
      return
    }

    const scheduleKey = values.join('::')
    if (seenSchedules.has(scheduleKey)) {
      errors.push(`Schedule ${index + 1} duplicates another class/date/time entry.`)
      return
    }

    seenSchedules.add(scheduleKey)
  })

  if (status === 'scheduled' && questions.length === 0) {
    errors.push('Add at least one question before scheduling the exam.')
  }

  if (
    status === 'scheduled' &&
    !scheduleEntries.some((entry) => entry.classId && entry.date && entry.time)
  ) {
    errors.push('Add at least one complete class schedule before creating the exam.')
  }

  return errors
}
