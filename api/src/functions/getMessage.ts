import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { redis } from '../redis'

interface StoredMessage {
  content: string
  ttl: string
  createdAt: string
}

export async function getMessage(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('getMessage invoked')

  const id = req.params.id

  const raw = await redis.get<string>(`message:${id}`)

  if (!raw) {
    return {
      status: 404,
      jsonBody: { code: 'NOT_FOUND', message: 'Message not found.' },
    }
  }

  const stored: StoredMessage = typeof raw === 'string' ? JSON.parse(raw) : (raw as StoredMessage)

  if (stored.ttl === 'view-once') {
    await redis.del(`message:${id}`)
  }

  return {
    status: 200,
    jsonBody: {
      content: stored.content,
      burnedAt: new Date().toISOString(),
    },
  }
}
