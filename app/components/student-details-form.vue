<template>
  <UForm :state="state"
         :validate="validate"
         class="space-y-6"
         @submit="$emit('submit', state)">
    <UFormField label="First Name"
                name="firstName">
      <UInput v-model="state.firstName"
              type="text"
              placeholder="John"
              class="w-full" />
    </UFormField>

    <UFormField label="Last Name"
                name="lastName">
      <UInput v-model="state.lastName"
              type="text"
              placeholder="Doe"
              class="w-full" />
    </UFormField>

    <UFormField label="Email Address"
                name="email">
      <UInput v-model="state.email"
              type="email"
              placeholder="john.doe@example.com"
              class="w-full" />
    </UFormField>

    <UFormField label="Experience Level"
                name="experience">
      <USelectMenu v-model="state.experience"
                   :items="[
                    { label: 'Beginner (~1-2 years)', value: 'beginner' },
                    { label: 'Intermediate (~3-5 years)', value: 'intermediate' },
                    { label: 'Advanced (5+ years)', value: 'advanced' }
                  ]"
                   value-key="value"
                   placeholder="Select your experience level"
                   class="w-full" />
    </UFormField>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <UButton type="button"
               color="neutral"
               variant="outline"
               class="button justify-center bg-transparent! text-mist-200!"
               @click="$emit('cancel')">
        Cancel
      </UButton>
      <UButton type="submit"
               class="button justify-center"
               :loading="loading">
        {{ submitLabel || 'Submit' }}
      </UButton>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { FormError } from '@nuxt/ui'
import type { StudentDetails } from '~/shared/types/form.types'

defineProps<{
  loading?: boolean
  submitLabel?: string
}>()

defineEmits<{
  submit: [details: StudentDetails]
  cancel: []
}>()

const state = reactive<StudentDetails>({
  firstName: '',
  lastName: '',
  email: '',
  experience: '',
})

const validate = (formState: Partial<StudentDetails>): FormError[] => {
  const errors: FormError[] = []

  if (!formState.firstName) errors.push({ name: 'firstName', message: 'First name is required.' })
  if (!formState.lastName) errors.push({ name: 'lastName', message: 'Last name is required.' })

  if (!formState.email) {
    errors.push({ name: 'email', message: 'Email address is required.' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
    errors.push({ name: 'email', message: 'Enter a valid email address.' })
  }

  if (!formState.experience) errors.push({ name: 'experience', message: 'Select your experience level.' })

  return errors
}
</script>