<template>
  <main class="flex flex-col items-center justify-center gap-4 p-8">
    <p class="text-xs tracking-widest uppercase text-sky-400">End-to-end encrypted</p>
    <MessageComposer />
  </main>
</template>

<script setup lang="ts">
import MessageComposer from '@/components/MessageComposer.vue'
</script>
