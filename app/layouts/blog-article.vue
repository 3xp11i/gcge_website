<template>
  <div class="relative min-h-screen">
    <Navbar />

    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex gap-10">
        <!-- Article content -->
        <article class="min-w-0 flex-1">
          <slot />
        </article>

        <!-- Table of contents -->
        <aside v-if="toc && toc.links?.length" class="hidden w-56 shrink-0 xl:block">
          <div class="sticky top-10">
            <p class="mb-3 text-xs font-semibold tracking-widest uppercase opacity-50">On this page</p>
            <nav>
              <ul class="space-y-1 border-l border-white/10">
                <template v-for="link in toc.links" :key="link.id">
                  <li>
                    <a
                      :href="`#${link.id}`"
                      class="block border-l-2 border-transparent py-0.5 pl-3 text-sm leading-snug opacity-60 transition-colors hover:border-amber-400/60 hover:opacity-100 -ml-px"
                    >{{ link.text }}</a>
                  </li>
                  <li v-for="child in link.children" :key="child.id">
                    <a
                      :href="`#${child.id}`"
                      class="block border-l-2 border-transparent py-0.5 pl-6 text-xs leading-snug opacity-50 transition-colors hover:border-amber-400/40 hover:opacity-90 -ml-px"
                    >{{ child.text }}</a>
                  </li>
                </template>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </main>

    <Footer class="mt-8" />
  </div>
</template>

<script lang="ts" setup>
const toc = inject<{ links: { id: string; text: string; depth: number; children?: { id: string; text: string }[] }[] } | null>('blog-toc', null)
</script>
