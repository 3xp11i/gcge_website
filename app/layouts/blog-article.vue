<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center">
    <Navbar />

    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex gap-10">
        <!-- Article content -->
        <article class="min-w-0 flex-1">
          <slot />
        </article>

        <!-- Table of contents -->

      <!-- <aside v-if="toc?.links?.length" class="mb-8 lg:sticky lg:top-6 lg:order-2 lg:mb-0 lg:self-start">
        <div class="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5">
          <p class="text-sm font-semibold uppercase tracking-wide opacity-60">
            Table of Contents
          </p>
          <nav class="mt-4">
            <ul class="space-y-3 text-base">
              <li v-for="link in toc.links" :key="link.id">
                
                  :href="`#${link.id}`"
                  class="opacity-70 transition-colors hover:text-amber-300 hover:opacity-100">
                  {{ link.text }}
                </a>
                <ul
                  v-if="link.children?.length"
                  class="mt-2 space-y-2 border-l border-white/10 pl-3">
                  <li v-for="child in link.children" :key="child.id">
                    
                      :href="`#${child.id}`"
                      class="text-sm opacity-60 transition-colors hover:text-amber-300 hover:opacity-100">
                      {{ child.text }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside> -->
      </div>
    </main>

    <Footer class="mt-8" />
  </div>
</template>

<script lang="ts" setup>
const toc = inject<{ links: { id: string; text: string; depth: number; children?: { id: string; text: string }[] }[] } | null>('blog-toc', null)
</script>