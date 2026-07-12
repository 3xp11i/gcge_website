<template>
  <nav class="site-navbar relative z-50 mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-12"
       :class="colorTheme ? 'text-white' : 'text-slate-900'">

    <NuxtLink to="/"
               class="flex items-center gap-3">
      <img src="@/assets/images/logo_transparent.png"
           alt="Galactic Gene home"
           width="50"
           height="50" />
      <span class="sr-only">Galactic Gene</span>
    </NuxtLink>

    <div class="hidden items-center gap-10 md:flex">
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/#community">Community</NuxtLink>
      <NuxtLink to="/consultation">Consultation</NuxtLink>
      <NuxtLink to="/courses">Courses</NuxtLink>

      <UColorModeSwitch v-model="colorTheme"
                        title="Toggle Dark/Light Theme"
                        color="secondary"
                        class="cursor-pointer!" />
    </div>

    <button type="button"
          ref="menuButton"
            class="navbar-menu-button inline-flex items-center justify-center rounded-full p-3 text-inherit transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 md:hidden fixed right-4 top-4 z-50"
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
           class="navbar-drawer relative ml-auto flex h-full w-[min(88vw,20rem)] flex-col border-l px-5 py-5 shadow-2xl"
               role="dialog"
               aria-modal="true"
               aria-label="Mobile navigation">
          <div class="flex items-center justify-between gap-4">
            <span class="navbar-muted text-sm uppercase tracking-[0.25em]">Menu</span>
            <button type="button"
                  ref="closeButton"
                    class="navbar-close-button inline-flex items-center justify-center rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                    aria-label="Close navigation menu"
                    @click="menuOpen = false">
              <Icon name="mdi:close" class="text-xl" />
            </button>
          </div>

          <nav class="mt-8 flex flex-col gap-2">
            <NuxtLink v-for="link in links"
                      :key="link.to"
                      :to="link.to"
                      class="navbar-link rounded-2xl px-4 py-3 text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                      @click="menuOpen = false">
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="navbar-footer mt-auto border-t pt-6">
            <UColorModeSwitch v-model="colorTheme"
                              title="Toggle Dark/Light Theme"
                              color="neutral"
                              class="cursor-pointer!" />
          </div>
        </aside>
      </div>
    </Transition>

  </nav>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

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
const colorTheme = computed({
  get: () => colorMode.value === 'dark',
  set: (isDark: boolean) => {
    colorMode.preference = isDark ? 'dark' : 'light'
  }
})

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

<style scoped>

a{
  color: white;
}

.light a {
  color: black;
  text-decoration: none;
}
.light a:hover {
  color: goldenrod;
  text-decoration: none;
}

</style>