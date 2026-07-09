<template>
  <div class="relative min-h-screen overflow-hidden">
    <Navbar />

    <main class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <slot />
    </main>

    <Footer class="mt-8" />
  </div>
</template>

<script setup lang="ts">
</script>
