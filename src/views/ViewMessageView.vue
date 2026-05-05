<template>
  <main class="min-h-screen flex items-center justify-center p-4">
    <MessageViewer :id="id" />
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import MessageViewer from '@/components/MessageViewer.vue'

const id = useRoute().params.id as string
</script>
