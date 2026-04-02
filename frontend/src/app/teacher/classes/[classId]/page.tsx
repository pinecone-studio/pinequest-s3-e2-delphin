import { redirect } from "next/navigation"

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  redirect(`/teacher/classes?classId=${classId}`)
}
