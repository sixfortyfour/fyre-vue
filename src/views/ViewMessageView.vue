<template>
  <main class="flex min-h-screen items-start justify-center px-4 pt-20">
    <MessageViewer :id="id" />
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import MessageViewer from '@/components/MessageViewer.vue'

const route = useRoute()
const id = route.params.id as string
</script>
