<template>
  <UForm :state="form" :validate="validate" class="space-y-4" @submit="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="First name" name="firstName" required>
        <UInput v-model="form.firstName" placeholder="Jane" size="lg" class="w-full" />
      </UFormField>

      <UFormField label="Last name" name="lastName" required>
        <UInput v-model="form.lastName" placeholder="Doe" size="lg" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Email address" name="email" required>
      <UInput v-model="form.email" type="email" placeholder="jane@example.com" size="lg" class="w-full" />
    </UFormField>

    <UButton type="submit" size="xl" class="button w-full justify-center font-semibold" :loading="loading">
      Continue with Email
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { FormError } from '@nuxt/ui'

const meta = useAuthEmailMeta()
const { sendOtp } = useAuthFlow()
const toast = useToast()
const loading = ref(false)

const form = reactive({
  firstName: meta.value.firstName,
  lastName: meta.value.lastName,
  email: meta.value.email
})

const validate = (state: typeof form): FormError[] => {
  const errors: FormError[] = []
  if (!state.firstName) errors.push({ name: 'firstName', message: 'First name is required.' })
  if (!state.lastName) errors.push({ name: 'lastName', message: 'Last name is required.' })
  if (!state.email) errors.push({ name: 'email', message: 'Email is required.' })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errors.push({ name: 'email', message: 'Enter a valid email.' })
  return errors
}

async function onSubmit() {
  meta.value = { ...form }
  loading.value = true
  try {
    await sendOtp()
  } catch (err: any) {
    toast.add({ title: 'Failed to send OTP', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
