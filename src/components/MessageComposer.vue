<template>
  <div class="mx-auto w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6">

    <template v-if="!generatedLink">
      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <textarea
            v-model="content"
            rows="7"
            placeholder="Write your secret message..."
            class="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
          />
          <p
            class="text-right text-xs"
            :class="isOverLimit ? 'text-red-400' : 'text-slate-500'"
          >
            {{ charCount }} / {{ MAX_MESSAGE_LENGTH }}
          </p>
        </div>

        <ExpirySelector v-model="ttl" />

        <p v-if="error" class="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="isLoading || isOverLimit || !content.trim()"
          class="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isLoading ? 'Encrypting...' : 'Create link' }}
        </button>
      </form>
    </template>

    <template v-else>
      <div class="flex flex-col items-center gap-6 text-center">
        <div class="flex flex-col gap-2">
          <h2 class="font-display text-2xl font-bold text-white">Your link is ready</h2>
          <p class="text-xs tracking-widest uppercase text-sky-400">Share it once. It will self-destruct after reading.</p>
        </div>

        <div class="flex w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
          <span class="flex-1 truncate text-sm text-slate-300">{{ generatedLink }}</span>
          <CopyLinkButton :link="generatedLink" />
        </div>

        <button
          type="button"
          class="text-sm text-slate-400 underline underline-offset-2 hover:text-slate-200"
          @click="reset"
        >
          Create another
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCreateMessage } from '@/composables/useCreateMessage'
import { MAX_MESSAGE_LENGTH } from '@/constants'
import AppLogo from './AppLogo.vue'
import ExpirySelector from './ExpirySelector.vue'
import CopyLinkButton from './CopyLinkButton.vue'

const { content, ttl, generatedLink, isLoading, error, charCount, isOverLimit, submit, reset } =
  useCreateMessage()
</script>
