<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <AppHeader />
    <RouterView class="flex-1" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
