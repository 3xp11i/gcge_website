<template>
  <nav class="flex items-center justify-between p-4 m-5 w-full"
       :class="colorTheme ? 'text-white' : ''">

    <div>

      <img src="@/assets/images/logo_transparent.png"
           alt="Galactic Gene Logo"
           width="50"
           height="50" />
    </div>

    <div class="flex justify-between gap-12">
      <NuxtLink to="/#about">About</NuxtLink>
      <NuxtLink to="/#community">Community</NuxtLink>
      <NuxtLink to="/consultation">Consultation</NuxtLink>
      <NuxtLink to="/courses">Courses</NuxtLink>
      <!-- <button title="Change Theme" class="ml-4 mr-2">
        <Icon name="mdi:theme-light-dark" />
      </button> -->

      <UColorModeSwitch ref="colorSwitch"
                        v-model="colorTheme"
                        title="Toggle Dark/Light Theme"
                        color="neutral"
                        default-value
                        @change="colorMode.preference = colorTheme ? 'dark' : 'light'"
                        class="cursor-pointer!" />

    </div>

  </nav>
</template>

<script lang="ts" setup>

const colorTheme = ref(true)


const colorMode = useColorMode()

</script>

<style></style>