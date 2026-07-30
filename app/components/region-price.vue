<template>
  <USkeleton v-if="!regionInitialized" class="h-6 w-20 rounded-md" />
  <span v-else>{{ text ? ` ${text}` : selectedRegion === 'India' ? inr : usd }}</span>
</template>

<script setup lang="ts">
defineProps<{
  inr?: string
  usd?: string
  text?: string
}>()

const { selectedRegion, regionInitialized } = useRegionSelection()
</script>
