<template>
  <div class="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8">
    <section class="mx-auto mb-10 mt-2 w-full max-w-7xl text-center">
      <p class="mb-2 text-sm font-semibold tracking-[0.2em] uppercase text-amber-300">Galactic Gene</p>
      <h1 class="fancy text-5xl sm:text-6xl">Blog</h1>
      <p class="mx-auto mt-3 max-w-2xl text-base opacity-70 sm:text-lg">
        Insights, guides and perspectives on astrology, metaphysics, and the cosmos.
      </p>
    </section>

    <section class="mx-auto w-full max-w-3xl">
      <ul class="space-y-6">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink
            :to="post.path"
            class="block rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition-colors hover:border-amber-300/30 hover:bg-white/8"
          >
            <p v-if="post.date" class="mb-1 text-xs opacity-50">{{ formatDate(post.date) }}</p>
            <h2 class="text-xl font-semibold">{{ post.title }}</h2>
            <p v-if="post.description" class="mt-2 text-sm opacity-60">{{ post.description }}</p>
          </NuxtLink>
        </li>
      </ul>

      <p v-if="!posts?.length" class="text-center opacity-50">No posts yet.</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({ title: 'Blog' })

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .select('path', 'title', 'description', 'date')
    .order('date', 'DESC')
    .all()
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
