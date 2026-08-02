<template>
  <div class="space-y-6">
    <div class="text-center">
      <p class="text-sm text-white/70">
        We sent a 6-digit code to <span class="font-semibold text-white">{{ meta.email }}</span>
      </p>
    </div>

    <div class="flex justify-center py-2">
      <UPinInput
        v-model="otp"
        :length="6"
        type="number"
        size="xl"
        otp
      />
    </div>

    <UButton
      size="xl"
      class="button w-full justify-center font-semibold"
      :loading="loading"
      :disabled="otp.length < 6"
      @click="submit"
    >
      Verify Code
    </UButton>

    <div class="flex items-center justify-between text-sm text-white/50">
      <span>
        Wrong email?
        <UButton variant="link" color="neutral" size="sm" class="text-white/80 hover:text-white" @click="resetFlow">
          Go back
        </UButton>
      </span>

      <span v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
      <UButton v-else variant="link" color="neutral" size="sm" class="text-white/80 hover:text-white" :loading="resending" @click="resend">
        Resend code
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const meta = useAuthEmailMeta()
const { verifyOtp, resetFlow, sendOtp } = useAuthFlow()
const toast = useToast()
const router = useRouter()
const loading = ref(false)
const resending = ref(false)
const otp = ref<string[]>([])

const RESEND_COOLDOWN_SECS = 60
const otpSentAt = useOtpSentAt()

// Restore remaining cooldown from persisted send-time so reload doesn't reset it
const elapsed = Math.floor((Date.now() - (otpSentAt.value ?? Date.now())) / 1000)
const resendCooldown = ref(Math.max(0, RESEND_COOLDOWN_SECS - elapsed))

const { pause, resume } = useIntervalFn(() => {
  if (resendCooldown.value > 0) resendCooldown.value--
  else pause()
}, 1000)

onMounted(() => resume())
onUnmounted(() => pause())

// Auto-submit when all 6 digits are filled
watch(otp, (val) => {
  if (val.length === 6 && val.every(Boolean)) submit()
})

async function submit() {
  const value = otp.value.join('')
  if (value.length < 6) return
  loading.value = true
  try {
    await verifyOtp(value)
    resetFlow()
    toast.add({ title: 'Signed in successfully!', color: 'success', icon: 'i-lucide-check-circle-2' })
    router.push('/')
  } catch (err: any) {
    toast.add({ title: 'Invalid code', description: 'Please check the code and try again.', color: 'error' })
    otp.value = []
  } finally {
    loading.value = false
  }
}

async function resend() {
  resending.value = true
  try {
    await sendOtp()
    otp.value = []
    otpSentAt.value = Date.now()
    resendCooldown.value = RESEND_COOLDOWN_SECS
    resume()
    toast.add({ title: 'Code resent', description: 'Check your email for the new code.', color: 'info' })
  } catch (err: any) {
    toast.add({ title: 'Failed to resend', description: err.message, color: 'error' })
  } finally {
    resending.value = false
  }
}
</script>
