<template>
  <div v-if="page">
    <header class="mb-8">
      <p v-if="page.date" class="mb-2 text-xs opacity-50">{{ formatDate(page.date) }}</p>
      <h1 class="text-3xl font-bold sm:text-4xl">{{ page.title }}</h1>
      <p v-if="page.description" class="mt-3 text-base opacity-60">{{ page.description }}</p>
    </header>

    <ContentRenderer :value="page" class="blog-prose" />
  </div>

  <div v-else class="py-20 text-center opacity-50">
    <p>Post not found.</p>
    <NuxtLink to="/blog" class="mt-4 inline-block text-sm underline">Back to blog</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'blog-article' })

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (page.value) {
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
  })
}

// Provide TOC to the layout
provide('blog-toc', computed(() => page.value?.body?.toc ?? null))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
