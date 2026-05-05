import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { ViewMessageResponse, ApiError } from '@/types'

export function useViewMessage(id: string): {
  message: Ref<ViewMessageResponse | null>
  error: Ref<ApiError | null>
  isLoading: Ref<boolean>
  isBurned: ComputedRef<boolean>
  isExpired: ComputedRef<boolean>
  isNotFound: ComputedRef<boolean>
  fetchMessage: () => Promise<void>
} {
  const message = ref<ViewMessageResponse | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)

  const isBurned = computed(() => error.value?.code === 'ALREADY_BURNED')
  const isExpired = computed(() => error.value?.code === 'EXPIRED')
  const isNotFound = computed(() => error.value?.code === 'NOT_FOUND')

  async function fetchMessage(): Promise<void> {
    isLoading.value = true

    try {
      const res = await fetch(`/api/messages/${id}`)

      if (!res.ok) {
        error.value = await res.json()
        return
      }

      message.value = await res.json()
    } catch {
      error.value = { code: 'SERVER_ERROR', message: 'Network error. Please try again.' }
    } finally {
      isLoading.value = false
    }
  }

  return { message, error, isLoading, isBurned, isExpired, isNotFound, fetchMessage }
}
