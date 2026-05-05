<template>
  <div class="mx-auto w-full max-w-xl">
    <div class="mb-8">
      <AppLogo />
    </div>

    <div v-if="isLoading" class="flex flex-col items-center gap-3 py-12 text-gray-500">
      <svg
        class="h-6 w-6 animate-spin text-orange-500"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <span class="text-sm">Retrieving message...</span>
    </div>

    <div v-else-if="message" class="flex flex-col gap-4">
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <p class="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">{{ message.content }}</p>
      </div>
      <p class="text-center text-xs text-gray-400">
        This message has now been deleted and cannot be viewed again.
      </p>
    </div>

    <div v-else-if="isBurned" class="rounded-xl bg-amber-50 px-6 py-10 text-center">
      <p class="text-sm font-medium text-amber-700">This message has already been read.</p>
    </div>

    <div v-else-if="isExpired" class="rounded-xl bg-gray-50 px-6 py-10 text-center">
      <p class="text-sm font-medium text-gray-600">This message has expired.</p>
    </div>

    <div v-else-if="isNotFound" class="rounded-xl bg-gray-50 px-6 py-10 text-center">
      <p class="text-sm font-medium text-gray-600">This message does not exist.</p>
    </div>

    <div v-else-if="error" class="rounded-xl bg-red-50 px-6 py-10 text-center">
      <p class="text-sm font-medium text-red-600">Something went wrong. Please try again.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useViewMessage } from '@/composables/useViewMessage'
import AppLogo from './AppLogo.vue'

const props = defineProps<{ id: string }>()

const { message, error, isLoading, isBurned, isExpired, isNotFound, fetchMessage } =
  useViewMessage(props.id)

onMounted(fetchMessage)
</script>
