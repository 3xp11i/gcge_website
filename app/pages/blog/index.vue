<template>
  <div class="min-h-screen w-full px-4 pb-10 sm:px-6 lg:px-8">
    <!-- <section class="mx-auto mb-3 mt-2 w-full max-w-7xl text-center">
      <h1 class="fancy text-5xl sm:text-8xl"></h1>
      <p class="mx-auto mt-3 max-w-2xl text-base opacity-70 sm:text-lg">
        Knowledge packed articles that help you in the learning journey of Astrology.
      </p>
    </section> -->

    <section class="mx-auto w-full max-w-7xl">
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink
            :to="post.path"
            class="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 transition-colors hover:border-amber-300/30 hover:bg-white/8"
          >
            <div class="w-full flex-shrink-0 overflow-hidden bg-white/5">
              <img
                v-if="post.thumbnail"
                :src="post.thumbnail"
                :alt="post.title"
                loading="lazy"
                class="aspect-[16/10] w-full object-cover"
              />
              <div
                v-else
                class="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-amber-300/10 to-white/5 text-2xl opacity-40"
              >
                ✨
              </div>
            </div>

            <div class="flex min-w-0 flex-1 flex-col p-5">
              <p v-if="post.date" class="mb-1 text-xs opacity-50">{{ formatDate(post.date) }}</p>
              <span class="text-xl! font-semibold">{{ post.title }}</span>
              <p v-if="post.description" class="mt-2 line-clamp-3 text-sm opacity-60">{{ post.description }}</p>
            </div>
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
    .select('path', 'title', 'description', 'date', 'thumbnail')
    .order('date', 'DESC')
    .all()
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>