<template>
  <div class="relative min-h-screen overflow-hidden">
    <Navbar />

    <main class="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 lg:py-16">
      <div class="overflow-hidden rounded-3xl border border-amber-300/20 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm">
        <slot />
      </div>
    </main>

    <Footer class="mt-8" />
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
section{
    align-items: start !important;
    justify-content: flex-start !important;
}
</style>