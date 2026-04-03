const LOCAL_API_BASE_URL = 'http://localhost:3001/api'

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/g, '')
}

export function getBrowserApiBaseUrl() {
  // Keep browser requests on the Next.js origin so client-side and server-side
  // fetches use the same backend target through the proxy route.
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
    'Сервер талын хүсэлт хийхэд `API_BASE_URL` тохируулагдаагүй байна. Production орчинд backend-ийн бүрэн URL-ийг `/api` төгсгөлтэйгээр env дээр заавал тохируулна уу.',
  )
}
