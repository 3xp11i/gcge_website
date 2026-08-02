export type AuthStep = 'email' | 'otp'
// Whether the email-step UI is in the name-collection sub-stage
export const useAuthIsNewUser = () => useLocalStorage<boolean>('gg-auth-is-new', false)

export type AuthEmailMeta = {
  firstName: string
  lastName: string
  email: string
}

// useLocalStorage keeps state alive across tab closes/refreshes
export const useAuthStep = () => useLocalStorage<AuthStep>('gg-auth-step', 'email')
export const useAuthEmailMeta = () => useLocalStorage<AuthEmailMeta>('gg-auth-meta', {
  firstName: '',
  lastName: '',
  email: ''
})
// timestamp (ms) of when the last OTP was sent — used to restore the resend cooldown
export const useOtpSentAt = () => useLocalStorage<number | null>('gg-auth-otp-sent-at', null)

export function useAuthFlow() {
  const supabase = useSupabaseClient()
  const step = useAuthStep()
  const meta = useAuthEmailMeta()
  const toast = useToast()

  const otpSentAt = useOtpSentAt()

  async function checkEmail(email: string): Promise<boolean> {
    const data = await $fetch<{ exists: boolean }>('/api/check-email', {
      method: 'POST',
      body: { email }
    })
    return data.exists
  }

  async function sendOtp(isNewUser: boolean) {
    const { error } = await supabase.auth.signInWithOtp({
      email: meta.value.email,
      options: {
        shouldCreateUser: isNewUser,
        data: isNewUser
          ? { first_name: meta.value.firstName, last_name: meta.value.lastName }
          : undefined
      }
    })
    if (error) throw error
    otpSentAt.value = Date.now()
    step.value = 'otp'
  }

  async function verifyOtp(token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email: meta.value.email,
      token,
      type: 'email'
    })
    if (error) throw error
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`
      }
    })
    if (error) {
      toast.add({ title: 'Google login failed', description: error.message, color: 'error' })
    }
  }

  function resetFlow() {
    step.value = 'email'
    meta.value = { firstName: '', lastName: '', email: '' }
    otpSentAt.value = null
    useAuthIsNewUser().value = false
  }

  return { checkEmail, sendOtp, verifyOtp, loginWithGoogle, resetFlow, meta }
}
