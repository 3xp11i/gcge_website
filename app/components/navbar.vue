<template>
  <nav class="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
       :class="colorTheme ? 'text-white' : ''">

    <NuxtLink to="/"
               class="flex items-center gap-3">
      <img src="@/assets/images/logo_transparent.png"
           alt="Galactic Gene home"
           width="50"
           height="50" />
      <span class="sr-only">Galactic Gene</span>
    </NuxtLink>

    <div class="hidden items-center gap-10 md:flex">
      <NuxtLink to="/#about">About</NuxtLink>
      <NuxtLink to="/#community">Community</NuxtLink>
      <NuxtLink to="/consultation">Consultation</NuxtLink>
      <NuxtLink to="/courses">Courses</NuxtLink>

      <UColorModeSwitch v-model="colorTheme"
                        title="Toggle Dark/Light Theme"
                        color="neutral"
                        default-value
                        @change="colorMode.preference = colorTheme ? 'dark' : 'light'"
                        class="cursor-pointer!" />
    </div>

    <button type="button"
          ref="menuButton"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-3 text-inherit transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 md:hidden fixed right-4 top-4 z-50"
            :aria-expanded="menuOpen"
            aria-controls="mobile-navigation"
            aria-label="Open navigation menu"
            @click="menuOpen = true">
      <Icon name="mdi:menu" class="text-2xl" />
    </button>

    <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
      <div v-if="menuOpen"
           class="fixed inset-0 z-50 md:hidden"
           @click.self="menuOpen = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <aside id="mobile-navigation"
               class="relative ml-auto flex h-full w-[min(85vw,20rem)] flex-col border-l border-white/10 bg-[#071625] px-6 py-5 text-white shadow-2xl"
               role="dialog"
               aria-modal="true"
               aria-label="Mobile navigation">
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm uppercase tracking-[0.25em] text-white/60">Menu</span>
            <button type="button"
                  ref="closeButton"
                    class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                    aria-label="Close navigation menu"
                    @click="menuOpen = false">
              <Icon name="mdi:close" class="text-xl" />
            </button>
          </div>

          <nav class="mt-8 flex flex-col gap-2">
            <NuxtLink v-for="link in links"
                      :key="link.to"
                      :to="link.to"
                      class="rounded-2xl px-4 py-3 text-lg transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                      @click="menuOpen = false">
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="mt-auto border-t border-white/10 pt-6">
            <UColorModeSwitch v-model="colorTheme"
                              title="Toggle Dark/Light Theme"
                              color="neutral"
                              default-value
                              @change="colorMode.preference = colorTheme ? 'dark' : 'light'"
                              class="cursor-pointer!" />
          </div>
        </aside>
      </div>
    </Transition>

  </nav>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const colorTheme = ref(true)
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const links = [
  { label: 'About', to: '/#about' },
  { label: 'Community', to: '/#community' },
  { label: 'Consultation', to: '/consultation' },
  { label: 'Courses', to: '/courses' },
]


const colorMode = useColorMode()

watch(menuOpen, async (isOpen) => {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''

  if (isOpen) {
    await nextTick()
    closeButton.value?.focus()
    return
  }

  menuButton.value?.focus()
})

useEventListener(window, 'keydown', (event) => {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

</script>

<style></style>