import 'dotenv/config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { DatabaseService } from '../src/database/database.service'

const database = new DatabaseService()
const bannedTitlePatterns = [
  /^test$/i,
  /^monitor$/i,
  /test to see if i return back to the exam/i,
  /tab block test2/i,
]

function isBannedTitle(title: string) {
  return bannedTitlePatterns.some((pattern) => pattern.test(title))
}

async function removeFromD1() {
  if (!database.isConfigured()) return { deletedIds: [] as string[], mode: 'skipped' as const }

  const exams = await database.query<{ id: string; title: string }>('SELECT id, title FROM exams')
  const deletedIds = exams.filter((exam) => isBannedTitle(exam.title)).map((exam) => exam.id)

  for (const examId of deletedIds) {
    await database.execute('DELETE FROM student_exam_results WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exam_questions WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exam_schedules WHERE exam_id = ?', [examId])
    await database.execute('DELETE FROM exams WHERE id = ?', [examId])
  }

  return { deletedIds, mode: 'seeded' as const }
}

async function removeFromLocalStore(deletedIds: string[]) {
  const examsPath = resolve(process.cwd(), '.data', 'exams.json')
  const resultsPath = resolve(process.cwd(), '.data', 'student-exam-results.json')
  await mkdir(dirname(examsPath), { recursive: true })

  const examStore = JSON.parse(await readFile(examsPath, 'utf8').catch(() => '{"exams":[],"questions":[],"schedules":[]}'))
  const resultStore = JSON.parse(await readFile(resultsPath, 'utf8').catch(() => '{"results":[]}'))

  const nextExamStore = {
    exams: (examStore.exams ?? []).filter((exam: { id: string; title: string }) => !deletedIds.includes(exam.id) && !isBannedTitle(exam.title)),
    questions: (examStore.questions ?? []).filter((question: { examId: string }) => !deletedIds.includes(question.examId)),
    schedules: (examStore.schedules ?? []).filter((schedule: { examId: string }) => !deletedIds.includes(schedule.examId)),
  }
  const nextResultStore = {
    results: (resultStore.results ?? []).filter((result: { examId: string }) => !deletedIds.includes(result.examId)),
  }

  await writeFile(examsPath, JSON.stringify(nextExamStore, null, 2), 'utf8')
  await writeFile(resultsPath, JSON.stringify(nextResultStore, null, 2), 'utf8')
}

async function main() {
  const { deletedIds, mode } = await removeFromD1()
  await removeFromLocalStore(deletedIds)
  console.log(`Removed ${deletedIds.length} unwanted demo exams.`)
  console.log(`D1 status: ${mode}`)
  if (deletedIds.length > 0) {
    console.log(`Deleted IDs: ${deletedIds.join(', ')}`)
  }
}

void main().catch((error) => {
  console.error('Failed to remove unwanted demo exams.', error)
  process.exitCode = 1
})
