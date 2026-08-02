<!-- components/PurchaseButton.vue -->
<template>
  <div class="flex flex-col gap-3 mt-3">
    <UButton type="button"
             class="button rounded-xl! cursor-pointer w-full justify-center"
             size="lg"
             :loading="loading"
             @click="$emit('click')">
      {{ label }}
    </UButton>
    <p v-if="statusMessage"
       class="text-sm leading-6 text-white/70">{{ statusMessage }}</p>
    <p v-if="errorMessage"
       class="text-sm leading-6 text-red-300">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  loading: boolean
  statusMessage: string
  errorMessage: string
}>()
defineEmits<{ click: [] }>()
</script>