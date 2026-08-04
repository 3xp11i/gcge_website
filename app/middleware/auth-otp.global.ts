const OTP_EXPIRY_MS = 3 * 60 * 1000 // 3 minutes

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (to.path === '/login') return

  const user = useSupabaseUser()
  const step = useAuthStep()
  const otpSentAt = useOtpSentAt()

  // Clear stale OTP state if the user is already authenticated
  if (user.value) {
    if (step.value === 'otp') step.value = 'email'
    return
  }

  if (step.value === 'otp') {
    const expired = !otpSentAt.value || Date.now() - otpSentAt.value > OTP_EXPIRY_MS
    if (expired) {
      step.value = 'email'
      otpSentAt.value = null
      return
    }
    // return navigateTo('/login')
  }
})
