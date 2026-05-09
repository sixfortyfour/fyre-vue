import { describe, it, expect, vi, afterEach } from 'vitest'
import { useViewMessage } from '../useViewMessage'
import { generateKey, exportKey, encrypt } from '@/utils/crypto'

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useViewMessage', () => {
  it('decrypts and sets message content on successful GET', async () => {
    const plaintext = 'secret message'
    const key = await generateKey()
    const ciphertext = await encrypt(plaintext, key)
    const keyB64 = await exportKey(key)
    const payload = { content: ciphertext, burnedAt: '2024-01-01T00:00:00Z' }

    vi.stubGlobal('fetch', mockFetch(200, payload))

    const { fetchMessage, message } = useViewMessage('abc123', keyB64)
    await fetchMessage()

    expect(message.value?.content).toBe(plaintext)
    expect(message.value?.burnedAt).toBe(payload.burnedAt)
  })

  it('sets isDecryptionError when no key is provided', async () => {
    const payload = { content: 'encrypted-blob', burnedAt: '2024-01-01T00:00:00Z' }
    vi.stubGlobal('fetch', mockFetch(200, payload))

    const { fetchMessage, isDecryptionError } = useViewMessage('abc123', '')
    await fetchMessage()

    expect(isDecryptionError.value).toBe(true)
  })

  it('sets isBurned when API returns ALREADY_BURNED', async () => {
    vi.stubGlobal('fetch', mockFetch(410, { code: 'ALREADY_BURNED', message: 'Already burned' }))

    const { fetchMessage, isBurned } = useViewMessage('abc123', 'dummy-key')
    await fetchMessage()

    expect(isBurned.value).toBe(true)
  })

  it('sets isExpired when API returns EXPIRED', async () => {
    vi.stubGlobal('fetch', mockFetch(410, { code: 'EXPIRED', message: 'Message expired' }))

    const { fetchMessage, isExpired } = useViewMessage('abc123', 'dummy-key')
    await fetchMessage()

    expect(isExpired.value).toBe(true)
  })

  it('sets isNotFound on 404', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { code: 'NOT_FOUND', message: 'Not found' }))

    const { fetchMessage, isNotFound } = useViewMessage('abc123', 'dummy-key')
    await fetchMessage()

    expect(isNotFound.value).toBe(true)
  })
})
