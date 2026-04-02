import { redirect } from "next/navigation"

export default async function ExamStatsPage({
  params,
}: {
  params: Promise<{ classId: string; examId: string }>
}) {
  const { classId, examId } = await params
  redirect(`/teacher/classes?classId=${classId}&examId=${examId}`)
}
