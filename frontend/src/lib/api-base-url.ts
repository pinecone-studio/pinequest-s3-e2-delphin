const LOCAL_API_BASE_URL = 'http://localhost:3001/api'

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/g, '')
}

export function getBrowserApiBaseUrl() {
  return '/api/backend'
}

export function getServerApiBaseUrl() {
  const configuredApiBaseUrl =
    process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (configuredApiBaseUrl) {
    return trimTrailingSlashes(configuredApiBaseUrl)
  }

  if (process.env.NODE_ENV !== 'production') {
    return LOCAL_API_BASE_URL
  }

  throw new Error(
    'Missing API_BASE_URL for server-side requests in production. Set it to your deployed backend URL, including /api.',
  )
}
