<template>
  <div class="min-h-screen bg-gray-950 text-slate-100 antialiased">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Galactic Gene by Sid',
  meta: [
    { name: 'theme-color', content: '#030712' },
  ],
})
</script>
