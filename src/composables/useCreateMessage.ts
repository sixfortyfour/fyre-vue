import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { MessageTtl, CreateMessageResponse, ApiError } from '@/types'
import { MAX_MESSAGE_LENGTH } from '@/constants'
import { generateKey, exportKey, encrypt } from '@/utils/crypto'

export function useCreateMessage(): {
  content: Ref<string>
  ttl: Ref<MessageTtl>
  generatedLink: Ref<string | null>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  charCount: ComputedRef<number>
  isOverLimit: ComputedRef<boolean>
  submit: () => Promise<void>
  reset: () => void
} {
  const content = ref('')
  const ttl = ref<MessageTtl>('view-once')
  const generatedLink = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const charCount = computed(() => content.value.length)
  const isOverLimit = computed(() => charCount.value > MAX_MESSAGE_LENGTH)

  async function submit(): Promise<void> {
    if (!content.value.trim()) return
    if (isOverLimit.value) return

    isLoading.value = true
    error.value = null

    try {
      const key = await generateKey()
      const ciphertext = await encrypt(content.value, key)

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: ciphertext, ttl: ttl.value }),
      })

      if (!res.ok) {
        const apiError: ApiError = await res.json()
        error.value = apiError.message
        return
      }

      const data: CreateMessageResponse = await res.json()
      const keyB64 = await exportKey(key)
      generatedLink.value = `${window.location.origin}/view/${data.id}#${keyB64}`
    } catch {
      error.value = 'Network error. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function reset(): void {
    content.value = ''
    generatedLink.value = null
    error.value = null
  }

  return { content, ttl, generatedLink, isLoading, error, charCount, isOverLimit, submit, reset }
}
