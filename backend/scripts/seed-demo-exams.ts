import 'dotenv/config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { DatabaseService } from '../src/database/database.service'

type DemoExamSeed = {
  id: string
  title: string
  classId: '10A' | '10B' | '10C'
  date: string
  time: string
  createdAt: string
  topic: keyof typeof questionBank
}

const questionBank = {
  fractions: [
    ['multiple-choice', '3/4 ба 2/4 хоёрын ихийг сонго.', ['3/4', '2/4', 'Тэнцүү', 'Мэдэхгүй'], '3/4', 4],
    ['short-answer', '1/2 + 1/4 хэд вэ?', undefined, '3/4', 6],
    ['true-false', '2/6 ба 1/3 нь тэнцүү бутархай мөн.', undefined, 'True', 4],
    ['short-answer', '12:18 харьцааг хамгийн энгийн хэлбэрт оруул.', undefined, '2:3', 6],
  ],
  percent: [
    ['multiple-choice', '80-ийн 25% хэд вэ?', ['10', '15', '20', '25'], '20', 4],
    ['short-answer', '5000 төгрөгийн 10%-ийг ол.', undefined, '500', 6],
    ['true-false', '20% хямдрал гэдэг нь үнийн тавны нэгийг хасна гэсэн үг.', undefined, 'True', 4],
    ['short-answer', '20000 төгрөгийн бараа 15% хямдарвал шинэ үнэ хэд вэ?', undefined, '17000', 6],
  ],
  shapes: [
    ['multiple-choice', 'Урт 8 см, өргөн 3 см тэгш өнцөгтийн периметр хэд вэ?', ['11', '16', '22', '24'], '22', 4],
    ['short-answer', 'Суурь 6, өндөр 5 бол тэгш өнцөгтийн талбай хэд вэ?', undefined, '30', 6],
    ['true-false', '180° нь шулуун өнцөг мөн.', undefined, 'True', 4],
    ['short-answer', 'Талууд нь 4, 4, 5 см гурвалжны периметрийг ол.', undefined, '13', 6],
  ],
  equations: [
    ['multiple-choice', '3x = 18 бол x хэд вэ?', ['3', '5', '6', '9'], '6', 4],
    ['short-answer', 'x + 7 = 19 тэгшитгэлийн шийдийг ол.', undefined, '12', 6],
    ['true-false', '2(x + 3) = 2x + 6 гэж задлаж болно.', undefined, 'True', 4],
    ['short-answer', 'x = 5 бол 2x + 4 илэрхийллийн утгыг ол.', undefined, '14', 6],
  ],
  scale: [
    ['multiple-choice', '1:100 масштабтай зураг дээр 3 см байвал бодит урт хэд вэ?', ['30 см', '300 см', '3 м', '30 м'], '300 см', 4],
    ['short-answer', '4 дэвтэр 12000 төгрөг бол 1 дэвтэр хэд вэ?', undefined, '3000', 6],
    ['true-false', '1 м = 100 см.', undefined, 'True', 4],
    ['short-answer', '2 кг 500 г хэдэн граммтай тэнцүү вэ?', undefined, '2500', 6],
  ],
  data: [
    ['multiple-choice', '2, 3, 3, 5, 7 өгөгдлийн моод аль нь вэ?', ['2', '3', '5', '7'], '3', 4],
    ['short-answer', '4, 6, 8 тоонуудын дунджийг ол.', undefined, '6', 6],
    ['true-false', 'Шоог нэг удаа хаяхад 7 гарах нь боломжгүй үзэгдэл.', undefined, 'True', 4],
    ['short-answer', 'Шоог нэг удаа хаяхад тэгш тоо гарах магадлалыг бутархайгаар бич.', undefined, '3/6', 6],
  ],
} as const

const demoExams: DemoExamSeed[] = [
  { id: '7a-math-fractions', title: '7А Бутархай ба харьцааны сорил', classId: '10A', date: '2026-03-30', time: '09:00', createdAt: '2026-03-24T08:00:00.000Z', topic: 'fractions' },
  { id: '7a-math-percent', title: '7А Хувь, хямдралын бодлого', classId: '10A', date: '2026-04-01', time: '10:10', createdAt: '2026-03-27T08:00:00.000Z', topic: 'percent' },
  { id: '7a-math-shapes', title: '7А Дүрс, периметр, талбай', classId: '10A', date: '2026-04-03', time: '13:20', createdAt: '2026-03-29T08:00:00.000Z', topic: 'shapes' },
  { id: '7b-math-equations', title: '7Б Илэрхийлэл ба тэгшитгэл', classId: '10B', date: '2026-03-31', time: '09:20', createdAt: '2026-03-25T08:00:00.000Z', topic: 'equations' },
  { id: '7b-math-scale', title: '7Б Пропорц ба масштаб', classId: '10B', date: '2026-04-02', time: '08:30', createdAt: '2026-03-28T08:00:00.000Z', topic: 'scale' },
  { id: '7b-math-data', title: '7Б Өгөгдөл ба магадлал', classId: '10B', date: '2026-04-04', time: '11:10', createdAt: '2026-03-30T08:00:00.000Z', topic: 'data' },
  { id: '7v-math-fractions', title: '7В Тэнцүү бутархай ба тоон шулуун', classId: '10C', date: '2026-03-30', time: '14:00', createdAt: '2026-03-24T08:00:00.000Z', topic: 'fractions' },
  { id: '7v-math-word-problems', title: '7В Тэгшитгэлтэй текст бодлого', classId: '10C', date: '2026-04-02', time: '12:40', createdAt: '2026-03-28T08:00:00.000Z', topic: 'equations' },
  { id: '7v-math-logic-data', title: '7В Диаграмм ба магадлалын сорил', classId: '10C', date: '2026-04-05', time: '10:30', createdAt: '2026-03-31T08:00:00.000Z', topic: 'data' },
]

const students = [
  ['judge1', 'Бат-Оргил.Э', '10A'], ['judge2', 'Эрдэнэгомбо.М', '10A'], ['judge3', 'Анар.Т', '10A'], ['judge4', 'Билгүүндөл.Б', '10A'],
  ['judge5', 'Буяндэлгэр.Т', '10A'], ['judge6', 'Өсөхбаяр.Ж', '10A'], ['judge7', 'Түвшин.О', '10A'], ['judge8', 'Өгөөмөр.Л', '10A'],
  ['s1', 'Бат-Эрдэнэ', '10B'], ['s2', 'Сарангэрэл', '10B'], ['s3', 'Тэмүүлэн', '10B'], ['s6', 'Мөнх-Оргил', '10B'],
  ['s7', 'Анударь', '10B'], ['s8', 'Билгүүн', '10B'], ['s16', 'Нандин', '10B'],
  ['s4', 'Номин', '10C'], ['s5', 'Энхжин', '10C'], ['s9', 'Гэрэлмаа', '10C'], ['s10', 'Дөлгөөн', '10C'],
  ['s11', 'Төгөлдөр', '10C'], ['s12', 'Хулан', '10C'], ['s13', 'Отгонбаяр', '10C'], ['s14', 'Баярмаа', '10C'], ['s15', 'Сүхбат', '10C'],
].map(([id, name, classId]) => ({ id, name, classId }))

const examIds = demoExams.map((exam) => exam.id)
const database = new DatabaseService()

function buildQuestions(exam: DemoExamSeed) {
  return questionBank[exam.topic].map(([type, question, options, correctAnswer, points], index) => ({
    id: `${exam.id}-q${index + 1}`,
    examId: exam.id,
    type,
    prompt: question,
    optionsJson: options ? JSON.stringify(options) : null,
    correctAnswer,
    iconKey: 'analysis',
    points,
    displayOrder: index + 1,
  }))
}

function buildResults(exam: DemoExamSeed) {
  const questions = buildQuestions(exam)
  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0)
  return students.filter((student) => student.classId === exam.classId).map((student, index) => {
    const answers = questions.map((question, questionIndex) => {
      const fullCredit = (index + questionIndex) % 4 !== 0
      const awardedPoints = fullCredit ? question.points : Math.max(question.points - 2, 0)
      return {
        questionId: question.id,
        answer: fullCredit ? question.correctAnswer : 'Оролдсон',
        isCorrect: fullCredit ? true : null,
        awardedPoints,
        reviewStatus: fullCredit ? 'auto-correct' : 'graded',
      }
    })
    const submittedAt = `${exam.date}T${String(Number(exam.time.slice(0, 2)) + 1).padStart(2, '0')}:${String((Number(exam.time.slice(3, 5)) + index * 3) % 60).padStart(2, '0')}:00.000Z`
    return {
      id: `${exam.id}-${student.id}`,
      examId: exam.id,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      answersJson: JSON.stringify(answers),
      score: answers.reduce((sum, answer) => sum + answer.awardedPoints, 0),
      totalPoints,
      status: 'submitted',
      submittedAt,
      createdAt: submittedAt,
      updatedAt: submittedAt,
    }
  })
}

async function seedD1() {
  if (!database.isConfigured()) return 'skipped'
  for (const examId of examIds) {
    await database.execute('DELETE FROM student_exam_results WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exam_questions WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exam_schedules WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exams WHERE id = ?', [examId])
  }
  for (const exam of demoExams) {
    await database.execute('INSERT INTO exams (id, title, duration_minutes, report_release_mode, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [exam.id, exam.title, 60, 'after-all-classes-complete', 'completed', exam.createdAt, exam.createdAt])
    await database.execute('INSERT INTO exam_schedules (id, exam_id, class_id, scheduled_date, scheduled_time) VALUES (?, ?, ?, ?, ?)', [randomUUID(), exam.id, exam.classId, exam.date, exam.time])
    for (const question of buildQuestions(exam)) {
      await database.execute('INSERT INTO exam_questions (id, exam_id, type, prompt, options_json, correct_answer, icon_key, points, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [question.id, question.examId, question.type, question.prompt, question.optionsJson, question.correctAnswer, question.iconKey, question.points, question.displayOrder])
    }
    for (const result of buildResults(exam)) {
      await database.execute('INSERT INTO student_exam_results (id, exam_id, student_id, student_name, class_id, answers_json, score, total_points, status, submitted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [result.id, result.examId, result.studentId, result.studentName, result.classId, result.answersJson, result.score, result.totalPoints, result.status, result.submittedAt, result.createdAt, result.updatedAt])
    }
  }
  return 'seeded'
}

async function writeLocalStores() {
  const examsPath = resolve(process.cwd(), '.data', 'exams.json')
  const resultsPath = resolve(process.cwd(), '.data', 'student-exam-results.json')
  await mkdir(dirname(examsPath), { recursive: true })
  const existingExamStore = JSON.parse(await readFile(examsPath, 'utf8').catch(() => '{"exams":[],"questions":[],"schedules":[]}'))
  const existingResultStore = JSON.parse(await readFile(resultsPath, 'utf8').catch(() => '{"results":[]}'))
  const examStore = {
    exams: [
      ...(existingExamStore.exams ?? []).filter((exam: { id: string }) => !examIds.includes(exam.id)),
      ...demoExams.map((exam) => ({ id: exam.id, title: exam.title, durationMinutes: 60, reportReleaseMode: 'after-all-classes-complete', status: 'completed', createdAt: exam.createdAt, updatedAt: exam.createdAt })),
    ],
    questions: [
      ...(existingExamStore.questions ?? []).filter((question: { examId: string }) => !examIds.includes(question.examId)),
      ...demoExams.flatMap(buildQuestions),
    ],
    schedules: [
      ...(existingExamStore.schedules ?? []).filter((schedule: { examId: string }) => !examIds.includes(schedule.examId)),
      ...demoExams.map((exam) => ({ id: randomUUID(), examId: exam.id, classId: exam.classId, scheduledDate: exam.date, scheduledTime: exam.time })),
    ],
  }
  const resultStore = {
    results: [
      ...(existingResultStore.results ?? []).filter((result: { examId: string }) => !examIds.includes(result.examId)),
      ...demoExams.flatMap(buildResults),
    ],
  }
  await writeFile(examsPath, JSON.stringify(examStore, null, 2), 'utf8')
  await writeFile(resultsPath, JSON.stringify(resultStore, null, 2), 'utf8')
}

async function main() {
  await writeLocalStores()
  const d1Status = await seedD1()
  const previous = await readFile(resolve(process.cwd(), '.data', 'exams.json'), 'utf8')
  console.log(`Seeded ${demoExams.length} demo exams for March 30-April 5.`)
  console.log(`D1 status: ${d1Status}`)
  console.log(`Local fallback bytes: ${previous.length}`)
}

void main().catch((error) => {
  console.error('Failed to seed demo exams.', error)
  process.exitCode = 1
})
