import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { ViewMessageResponse, ApiError } from '@/types'
import { importKey, decrypt } from '@/utils/crypto'

export function useViewMessage(id: string, encryptionKey: string): {
  message: Ref<ViewMessageResponse | null>
  error: Ref<ApiError | null>
  isLoading: Ref<boolean>
  isBurned: ComputedRef<boolean>
  isExpired: ComputedRef<boolean>
  isNotFound: ComputedRef<boolean>
  isDecryptionError: ComputedRef<boolean>
  fetchMessage: () => Promise<void>
} {
  const message = ref<ViewMessageResponse | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)

  const isBurned = computed(() => error.value?.code === 'ALREADY_BURNED')
  const isExpired = computed(() => error.value?.code === 'EXPIRED')
  const isNotFound = computed(() => error.value?.code === 'NOT_FOUND')
  const isDecryptionError = computed(() => error.value?.code === 'DECRYPTION_ERROR')

  async function fetchMessage(): Promise<void> {
    isLoading.value = true

    try {
      const res = await fetch(`/api/messages/${id}`)

      if (!res.ok) {
        error.value = await res.json()
        return
      }

      const data: ViewMessageResponse = await res.json()

      if (!encryptionKey) {
        error.value = { code: 'DECRYPTION_ERROR', message: 'Missing decryption key.' }
        return
      }

      try {
        const cryptoKey = await importKey(encryptionKey)
        const plaintext = await decrypt(data.content, cryptoKey)
        message.value = { ...data, content: plaintext }
      } catch {
        error.value = { code: 'DECRYPTION_ERROR', message: 'Failed to decrypt message.' }
      }
    } catch {
      error.value = { code: 'SERVER_ERROR', message: 'Network error. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  return { message, error, isLoading, isBurned, isExpired, isNotFound, isDecryptionError, fetchMessage }
}
