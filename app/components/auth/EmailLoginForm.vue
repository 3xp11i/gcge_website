<template>
  <!-- Skeleton while we wait for client mount / meta hydration, or while transitioning stages -->
  <div v-if="!ready" class="space-y-4">
    <div class="h-4 w-24 rounded bg-white/10 animate-pulse" />
    <div class="h-12 w-full rounded-lg bg-white/10 animate-pulse" />
    <div class="h-12 w-full rounded-lg bg-white/10 animate-pulse" />
  </div>

  <!-- Stage 1: email only -->
  <UForm v-else-if="stage === 'email'" :state="emailForm" :validate="validateEmail" class="space-y-4" @submit="onEmailSubmit">
    <UFormField label="Email address" name="email" required>
      <UInput v-model="emailForm.email" type="email" placeholder="jane@example.com" size="lg" class="w-full" />
    </UFormField>
    <UButton type="submit" size="xl" class="button w-full justify-center font-semibold" :loading="loading">
      Continue
    </UButton>
  </UForm>

  <!-- Stage 2: new user — collect name then send OTP -->
  <UForm v-else :state="nameForm" :validate="validateName" class="space-y-4" @submit="onNameSubmit">
    <button type="button" class="flex items-center gap-1 text-xs text-white/50 hover:text-white/80" @click="goBackToEmail">
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
    <UButton type="submit" size="xl" class="button w-full justify-center font-semibold" :loading="loading || !stageReady">
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

// Gate interaction until we're mounted on the client and meta has settled.
const ready = ref(false)

// Gate submission during a stage transition, separate from initial `ready`.
// Stays false for one tick whenever we switch stages, so a fast Enter-key
// or autofocus-triggered submit can't fire before the new form + meta write
// have actually settled.
const stageReady = ref(true)

// 'email' = first stage; 'name' = new-user name collection
const stage = ref<'email' | 'name'>('email')

const emailForm = reactive({ email: meta.value.email ?? '' })
const nameForm = reactive({ firstName: meta.value.firstName ?? '', lastName: meta.value.lastName ?? '' })

watch(meta, (newMeta) => {
  if (!emailForm.email && newMeta.email) emailForm.email = newMeta.email
  if (!nameForm.firstName && newMeta.firstName) nameForm.firstName = newMeta.firstName
  if (!nameForm.lastName && newMeta.lastName) nameForm.lastName = newMeta.lastName
}, { deep: true })

// Re-arm stageReady any time the stage changes (covers both the
// email->name transition and the back button below).
watch(stage, async () => {
  stageReady.value = false
  await nextTick()
  stageReady.value = true
})

onMounted(() => {
  if (!emailForm.email && meta.value.email) emailForm.email = meta.value.email
  ready.value = true
})

function goBackToEmail() {
  stage.value = 'email'
}

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
  const email = emailForm.email?.trim()
  if (!email) {
    toast.add({ title: 'Email required', description: 'Please enter your email address.', color: 'error' })
    return
  }
  emailForm.email = email

  loading.value = true
  try {
    const exists = await checkEmail(email)
    isNewUser.value = !exists
    if (exists) {
      meta.value = { email, firstName: '', lastName: '' }
      await sendOtp(false)
    } else {
      stage.value = 'name'
    }
  } catch (err: any) {
    toast.add({ title: 'Something went wrong', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function onNameSubmit() {
  // Guard against a submit sneaking in mid-transition (e.g. double Enter,
  // or the previous stage's submit handler still resolving).
  if (!stageReady.value) return

  const email = emailForm.email?.trim()
  const firstName = nameForm.firstName?.trim()
  const lastName = nameForm.lastName?.trim()

  if (!email || !firstName || !lastName) {
    toast.add({ title: 'Missing details', description: 'Please fill in all fields before continuing.', color: 'error' })
    return
  }

  loading.value = true
  try {
    // Write meta and WAIT for the reactive write to flush before calling
    // sendOtp, in case sendOtp (or something it depends on) reads meta
    // via a watcher/computed rather than receiving it as an argument.
    meta.value = { email, firstName, lastName }
    await nextTick()

    await sendOtp(true)
  } catch (err: any) {
    toast.add({ title: 'Failed to send OTP', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>