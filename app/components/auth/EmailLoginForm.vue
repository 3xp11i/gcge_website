<template>
  <!-- Stage 1: email only -->
  <UForm v-if="stage === 'email'" :state="emailForm" :validate="validateEmail" class="space-y-4" @submit="onEmailSubmit">
    <UFormField label="Email address" name="email" required>
      <UInput v-model="emailForm.email" type="email" placeholder="jane@example.com" size="lg" class="w-full" />
    </UFormField>
    <UButton type="submit" size="xl" class="button w-full justify-center font-semibold" :loading="loading">
      Continue
    </UButton>
  </UForm>

  <!-- Stage 2: new user — collect name then send OTP -->
  <UForm v-else :state="nameForm" :validate="validateName" class="space-y-4" @submit="onNameSubmit">
    <button type="button" class="flex items-center gap-1 text-xs text-white/50 hover:text-white/80" @click="stage = 'email'">
      ← {{ emailForm.email }}
    </button>
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="First name" name="firstName" required>
        <UInput v-model="nameForm.firstName" placeholder="Jane" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Last name" name="lastName" required>
        <UInput v-model="nameForm.lastName" placeholder="Doe" size="lg" class="w-full" />
      </UFormField>
    </div>
    <UButton type="submit" size="xl" class="button w-full justify-center font-semibold" :loading="loading">
      Continue with Email
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import type { FormError } from '@nuxt/ui'

const meta = useAuthEmailMeta()
const isNewUser = useAuthIsNewUser()
const { checkEmail, sendOtp } = useAuthFlow()
const toast = useToast()
const loading = ref(false)

// 'email' = first stage; 'name' = new-user name collection
const stage = ref<'email' | 'name'>('email')

const emailForm = reactive({ email: meta.value.email })
const nameForm = reactive({ firstName: meta.value.firstName, lastName: meta.value.lastName })

const validateEmail = (state: typeof emailForm): FormError[] => {
  if (!state.email) return [{ name: 'email', message: 'Email is required.' }]
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return [{ name: 'email', message: 'Enter a valid email.' }]
  return []
}

const validateName = (state: typeof nameForm): FormError[] => {
  const errors: FormError[] = []
  if (!state.firstName) errors.push({ name: 'firstName', message: 'First name is required.' })
  if (!state.lastName) errors.push({ name: 'lastName', message: 'Last name is required.' })
  return errors
}

async function onEmailSubmit() {
  loading.value = true
  try {
    const exists = await checkEmail(emailForm.email)
    isNewUser.value = !exists
    if (exists) {
      // Existing user — send OTP immediately
      meta.value = { email: emailForm.email, firstName: '', lastName: '' }
      await sendOtp(false)
    } else {
      // New user — collect name first
      stage.value = 'name'
    }
  } catch (err: any) {
    toast.add({ title: 'Something went wrong', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function onNameSubmit() {
  meta.value = { email: emailForm.email, firstName: nameForm.firstName, lastName: nameForm.lastName }
  loading.value = true
  try {
    await sendOtp(true)
  } catch (err: any) {
    toast.add({ title: 'Failed to send OTP', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
