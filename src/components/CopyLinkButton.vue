<template>
  <button
    type="button"
    class="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
    @click="copy"
  >
    <span class="transition-all duration-150">{{ copied ? 'Copied!' : 'Copy link' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ link: string }>()
const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(props.link).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>
