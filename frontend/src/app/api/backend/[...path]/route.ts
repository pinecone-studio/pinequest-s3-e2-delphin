import { getServerApiBaseUrl } from '@/lib/api-base-url'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const TRANSIENT_STATUSES = new Set([502, 503, 504])
const RETRY_DELAYS_MS = [400, 1200]
const UPSTREAM_TIMEOUT_MS = 10_000

function buildUpstreamUrl(pathSegments: string[], requestUrl: string) {
  const upstreamPath = pathSegments.join('/')
  const search = new URL(requestUrl).search
  return `${getServerApiBaseUrl()}/${upstreamPath}${search}`
}

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params
  const upstreamUrl = buildUpstreamUrl(path, request.url)
  const headers = new Headers(request.headers)

  headers.delete('host')

  const requestBody =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer()

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        body: requestBody,
        cache: 'no-store',
        signal: controller.signal,
      })

      if (!TRANSIENT_STATUSES.has(upstreamResponse.status) || attempt === RETRY_DELAYS_MS.length) {
        const responseHeaders = new Headers(upstreamResponse.headers)
        responseHeaders.delete('content-length')

        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          statusText: upstreamResponse.statusText,
          headers: responseHeaders,
        })
      }
    } catch {
      if (attempt === RETRY_DELAYS_MS.length) {
        return Response.json(
          {
            message:
              'The backend is temporarily unavailable. Please try again in a moment.',
          },
          { status: 503 },
        )
      }
    } finally {
      clearTimeout(timeout)
    }

    await wait(RETRY_DELAYS_MS[attempt])
  }

  return Response.json(
    {
      message: 'The backend is temporarily unavailable. Please try again in a moment.',
    },
    { status: 503 },
  )
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context)
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context)
}
