<template>
  <NuxtLayout>
    <ClientOnly>
      <NuxtRouteAnnouncer />
    </ClientOnly>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Homepage',
  meta: [
    { name: 'theme-color', content: '#030712' },
  ],
})


</script>
