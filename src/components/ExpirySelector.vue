<template>
  <div class="flex gap-2">
    <button
      v-for="option in TTL_OPTIONS"
      :key="option.value"
      type="button"
      :class="[
        'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        modelValue === option.value
          ? 'bg-orange-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { MessageTtl } from '@/types'
import { TTL_OPTIONS } from '@/constants'

defineProps<{ modelValue: MessageTtl }>()
defineEmits<{ 'update:modelValue': [value: MessageTtl] }>()
</script>
