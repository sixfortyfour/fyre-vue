import { describe, it, expect, vi, afterEach } from 'vitest'
import { useCreateMessage } from '../useCreateMessage'
import { MAX_MESSAGE_LENGTH } from '@/constants'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useCreateMessage', () => {
  it('sets generatedLink on successful POST', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { id: 'abc123', expiresAt: '2024-01-01T00:00:00Z' }))
    vi.stubGlobal('location', { origin: 'https://fyre.app' })

    const { content, submit, generatedLink } = useCreateMessage()
    content.value = 'hello world'

    await submit()

    expect(generatedLink.value).toMatch(/^https:\/\/fyre\.app\/view\/abc123#.+/)
  })

  it('sets error when API returns 500', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { code: 'SERVER_ERROR', message: 'Internal error' }))

    const { content, submit, error } = useCreateMessage()
    content.value = 'hello world'

    await submit()

    expect(error.value).toBe('Internal error')
  })

  it('isOverLimit is true when content exceeds MAX_MESSAGE_LENGTH', () => {
    const { content, isOverLimit } = useCreateMessage()
    content.value = 'a'.repeat(MAX_MESSAGE_LENGTH + 1)

    expect(isOverLimit.value).toBe(true)
  })

  it('submit does nothing if content is empty', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const { submit } = useCreateMessage()
    await submit()

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
