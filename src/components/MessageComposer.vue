<template>
  <div class="mx-auto w-full max-w-xl">
    <div class="mb-8">
      <AppLogo />
    </div>

    <template v-if="!generatedLink">
      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <textarea
            v-model="content"
            rows="7"
            placeholder="Write your secret message..."
            class="w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          <p
            class="text-right text-xs"
            :class="isOverLimit ? 'text-red-500' : 'text-gray-400'"
          >
            {{ charCount }} / {{ MAX_MESSAGE_LENGTH }}
          </p>
        </div>

        <ExpirySelector v-model="ttl" />

        <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="isLoading || isOverLimit || !content.trim()"
          class="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isLoading ? 'Encrypting...' : 'Create link' }}
        </button>
      </form>
    </template>

    <template v-else>
      <div class="flex flex-col items-center gap-6 text-center">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-900">Your link is ready</h2>
          <p class="text-sm text-gray-500">Share it once. It will self-destruct after reading.</p>
        </div>

        <div class="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <span class="flex-1 truncate text-sm text-gray-700">{{ generatedLink }}</span>
          <CopyLinkButton :link="generatedLink" />
        </div>

        <button
          type="button"
          class="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
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
