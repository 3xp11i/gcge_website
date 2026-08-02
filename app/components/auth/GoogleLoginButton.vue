<template>
  <UButton
    variant="outline"
    color="neutral"
    size="xl"
    class="w-full justify-center gap-3 font-semibold"
    :loading="loading"
    @click="onClick"
  >
    <template #leading>
      <Icon name="logos:google-icon" class="size-5" />
    </template>
    Continue with Google
  </UButton>
</template>

<script lang="ts" setup>
const { loginWithGoogle } = useAuthFlow()
const loading = ref(false)

async function onClick() {
  loading.value = true
  await loginWithGoogle()
  // loading stays true during OAuth redirect
}
</script>
