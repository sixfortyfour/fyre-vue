<template>
  <header class="border-b border-gray-200 bg-white">
    <nav class="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
      <RouterLink to="/">
        <AppLogo />
      </RouterLink>
      <RouterLink
        to="/about"
        class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >About</RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>
