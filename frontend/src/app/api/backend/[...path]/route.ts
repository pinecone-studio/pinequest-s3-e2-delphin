import { getServerApiBaseUrl } from '@/lib/api-base-url'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function buildUpstreamUrl(pathSegments: string[], requestUrl: string) {
  const upstreamPath = pathSegments.join('/')
  const search = new URL(requestUrl).search
  return `${getServerApiBaseUrl()}/${upstreamPath}${search}`
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params
  const upstreamUrl = buildUpstreamUrl(path, request.url)
  const headers = new Headers(request.headers)

  headers.delete('host')

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body:
      request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.arrayBuffer(),
    cache: 'no-store',
  })

  const responseHeaders = new Headers(upstreamResponse.headers)
  responseHeaders.delete('content-length')

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  })
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
