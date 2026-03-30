import { getBrowserApiBaseUrl } from '@/lib/api-base-url'

export type UploadRecord = {
  id: string
  key: string
  bucket: string
  folder: string
  originalName: string
  contentType: string
  size: number
  uploadedAt: string
  publicUrl: string | null
}

type PaginatedUploadRecords = {
  items: UploadRecord[]
  page: number
  limit: number
  total: number
  totalPages: number
}

function buildUploadUrl(path: string) {
  return `${getBrowserApiBaseUrl()}${path}`
}

async function readUploadError(response: Response, fallbackMessage: string) {
  try {
    const data = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(data.message)) {
      return data.message.join(' ')
    }

    if (data.message) {
      return data.message
    }
  } catch {
    // Ignore non-JSON responses.
  }

  return fallbackMessage
}

export async function listUploads(folder?: string): Promise<UploadRecord[]> {
  const query = folder ? `?folder=${encodeURIComponent(folder)}` : ''
  const response = await fetch(buildUploadUrl(`/uploads${query}`), {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(await readUploadError(response, 'Файлуудыг ачаалж чадсангүй.'))
  }

  const data = (await response.json()) as PaginatedUploadRecords
  return data.items
}

export async function uploadFile({
  file,
  fileName,
  folder,
}: {
  file: File
  fileName: string
  folder: string
}): Promise<UploadRecord> {
  const formData = new FormData()
  formData.append('file', file, fileName.trim())

  const response = await fetch(
    buildUploadUrl(`/uploads?folder=${encodeURIComponent(folder)}`),
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error(await readUploadError(response, 'Файл хуулахад алдаа гарлаа.'))
  }

  return (await response.json()) as UploadRecord
}

export async function deleteUpload(id: string): Promise<void> {
  const response = await fetch(buildUploadUrl(`/uploads/${id}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await readUploadError(response, 'Файл устгаж чадсангүй.'))
  }
}
