import type { CreatedExam } from "@/lib/exams-api"

export async function requestExam(url: string, init: RequestInit): Promise<CreatedExam> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(await getExamRequestError(response))
  }

  return (await response.json()) as CreatedExam
}

async function getExamRequestError(response: Response) {
  const message = "Шалгалтын хүсэлтийг backend дээр боловсруулах үед алдаа гарлаа."

  try {
    const data = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(data.message)) return data.message.join(" ")
    if (data.message) return data.message
  } catch {
    return message
  }

  return message
}
