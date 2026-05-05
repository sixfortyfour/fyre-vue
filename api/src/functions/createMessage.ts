import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { nanoid } from 'nanoid'
import { redis } from '../redis'

const VALID_TTLS = new Set(['view-once', '1h'])
const MAX_CONTENT_LENGTH = 10_000

interface StoredMessage {
  content: string
  ttl: string
  createdAt: string
}

export async function createMessage(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('createMessage invoked')

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return { status: 400, jsonBody: { code: 'BAD_REQUEST', message: 'Invalid JSON body.' } }
  }

  const { content, ttl } = body as { content?: unknown; ttl?: unknown }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return { status: 400, jsonBody: { code: 'BAD_REQUEST', message: 'content is required.' } }
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: 400, jsonBody: { code: 'BAD_REQUEST', message: 'content exceeds 10 000 characters.' } }
  }
  if (!ttl || typeof ttl !== 'string' || !VALID_TTLS.has(ttl)) {
    return { status: 400, jsonBody: { code: 'BAD_REQUEST', message: "ttl must be 'view-once' or '1h'." } }
  }

  const id = nanoid(12)
  const ttlSeconds = ttl === '1h' ? 3600 : 86400
  const ttlMs = ttl === '1h' ? 3_600_000 : 86_400_000

  const stored: StoredMessage = {
    content,
    ttl,
    createdAt: new Date().toISOString(),
  }

  await redis.set(`message:${id}`, JSON.stringify(stored), { ex: ttlSeconds })

  return {
    status: 201,
    jsonBody: {
      id,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    },
  }
}
