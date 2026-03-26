import { getBrowserApiBaseUrl, getServerApiBaseUrl } from '@/lib/api-base-url'

const TRANSIENT_STATUSES = new Set([502, 503, 504])
const RETRY_DELAYS_MS = [400, 1200]
const REQUEST_TIMEOUT_MS = 10_000

function getApiBaseUrl() {
  return typeof window === 'undefined' ? getServerApiBaseUrl() : getBrowserApiBaseUrl()
}

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

async function readErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(data.message)) {
      return data.message.join(' ')
    }

    if (data.message) {
      return data.message
    }
  } catch {
    // Ignore non-JSON error bodies.
  }

  return fallbackMessage
}

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

export async function fetchBackendJson<T>(path: string, fallbackMessage: string): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(buildApiUrl(path), {
        cache: 'no-store',
        signal: controller.signal,
      })

      if (response.ok) {
        return (await response.json()) as T
      }

      const message = await readErrorMessage(response, fallbackMessage)
      lastError = new Error(message)

      if (!TRANSIENT_STATUSES.has(response.status) || attempt === RETRY_DELAYS_MS.length) {
        throw lastError
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new Error('The backend took too long to respond. Please try again.')
      } else if (error instanceof Error) {
        lastError = error
      } else {
        lastError = new Error(fallbackMessage)
      }

      if (attempt === RETRY_DELAYS_MS.length) {
        throw lastError
      }
    } finally {
      clearTimeout(timeout)
    }

    await wait(RETRY_DELAYS_MS[attempt])
  }

  throw lastError ?? new Error(fallbackMessage)
}
