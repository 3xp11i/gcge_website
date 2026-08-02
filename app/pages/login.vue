<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-6">

      <!-- Header -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-block">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">Galactic Gene</p>
        </NuxtLink>
        <h3 class="mt-3 text-3xl font-semibold text-white">
          {{ step === 'otp' ? 'Check your email' : 'Welcome back' }}
        </h3>
        <p class="mt-2 text-sm text-white/60">
          {{ step === 'otp' ? 'Enter the code we sent to verify your identity.' : 'Sign in or create your account.' }}
        </p>
      </div>

      <!-- Card -->
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">

        <Transition name="slide" mode="out-in">
          <AuthOtpVerifyForm v-if="step === 'otp'" key="otp" />
          <div v-else key="email" class="space-y-5">
            <AuthEmailLoginForm />

            <div class="flex items-center gap-3">
              <div class="h-px flex-1 bg-white/10" />
              <span class="text-xs text-white/40">or</span>
              <div class="h-px flex-1 bg-white/10" />
            </div>

            <AuthGoogleLoginButton />
          </div>
        </Transition>

      </div>

      <p class="text-center text-xs text-white/40">
        By continuing, you agree to our
        <NuxtLink to="/terms-and-conditions" class="underline hover:text-white/70">Terms</NuxtLink>
        and
        <NuxtLink to="/privacy-policy" class="underline hover:text-white/70">Privacy Policy</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'default' })

const user = useSupabaseUser()
// Redirect already-authenticated users away from the login page
watchEffect(() => { if (user.value) navigateTo('/') })

const step = useAuthStep()
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>