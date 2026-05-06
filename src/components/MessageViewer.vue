<template>
  <div class="mx-auto w-full max-w-xl">

    <div v-if="isLoading" class="flex flex-col items-center gap-3 py-12 text-slate-400">
      <svg
        class="h-6 w-6 animate-spin text-blue-500"
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
      <div class="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <p class="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{{ message.content }}</p>
      </div>
      <p class="text-center text-xs text-slate-500">
        This message has now been deleted and cannot be viewed again.
      </p>
    </div>

    <div v-else-if="isBurned" class="rounded-xl border border-amber-800 bg-amber-950 px-6 py-10 text-center">
      <p class="text-sm font-medium text-amber-400">This message has already been read.</p>
    </div>

    <div v-else-if="isExpired" class="rounded-xl border border-slate-700 bg-slate-900 px-6 py-10 text-center">
      <p class="text-sm font-medium text-slate-400">This message has expired.</p>
    </div>

    <div v-else-if="isNotFound" class="rounded-xl border border-slate-700 bg-slate-900 px-6 py-10 text-center">
      <p class="text-sm font-medium text-slate-400">This message does not exist.</p>
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-800 bg-red-950 px-6 py-10 text-center">
      <p class="text-sm font-medium text-red-400">Something went wrong. Please try again.</p>
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
