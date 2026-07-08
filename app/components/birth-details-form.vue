<template>
	<UForm :state="state" :validate="validate" class="space-y-5" @submit="$emit('submit', state)">
		<div class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
			We will contact you on your email address for the chosen date & timing of your consultation. You can ask any
			follow-up questions within 48 hours, including by email.
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<UFormField label="Name of the person" name="fullName">
				<UInput v-model="state.fullName" placeholder="Full name" />
			</UFormField>

			<UFormField label="Email address" name="email">
				<UInput v-model="state.email" type="email" placeholder="name@example.com" />
			</UFormField>

			<UFormField label="Date of birth" name="dateOfBirth">
				<UInput v-model="state.dateOfBirth" type="date" />
			</UFormField>

			<UFormField label="Time of birth" name="timeOfBirth">
				<UInput v-model="state.timeOfBirth" type="time" />
			</UFormField>

			<UFormField label="Location" name="location" class="sm:col-span-2">
				<UInput v-model="state.location" placeholder="City, state, and country" />
			</UFormField>

			<UFormField label="How would you like your consultation?" name="consultationMethod" class="sm:col-span-2">
				<USelectMenu v-model="state.consultationMethod"
							 :items="consultationMethodOptions"
							 placeholder="Choose a consultation format" />
			</UFormField>

			<UFormField v-if="state.consultationMethod === 'Text at your Instagram ID'" label="Instagram username" name="instagramUsername" class="sm:col-span-2">
				<UInput v-model="state.instagramUsername" placeholder="your.instagram.username" />
			</UFormField>

			<div class="sm:col-span-2 rounded-2xl border border-white/10 bg-black/10 p-4">
				<UCheckbox v-model="state.needsBtr" label="My birth details may be inaccurate and I need BTR (Birth Time Rectification)." />
			</div>
		</div>

		<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
			<UButton type="button" color="neutral" variant="outline" @click="$emit('cancel')">
				Cancel
			</UButton>
			<UButton type="submit" class="button justify-center" :loading="loading">
				{{ submitLabel }}
			</UButton>
		</div>
	</UForm>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

export type BirthDetails = {
	fullName: string
	email: string
	dateOfBirth: string
	timeOfBirth: string
	location: string
	consultationMethod: 'Call over Google Meet' | 'Text at your email' | 'Text at your Instagram ID'
	instagramUsername: string
	needsBtr: boolean
}

defineProps<{
	loading?: boolean
	submitLabel?: string
}>(
)

defineEmits<{
	submit: [details: BirthDetails]
	cancel: []
}>(
)

const state = reactive<BirthDetails>({
	fullName: '',
	email: '',
	dateOfBirth: '',
	timeOfBirth: '',
	location: '',
	consultationMethod: 'Call over Google Meet',
	instagramUsername: '',
	needsBtr: false,
})

const consultationMethodOptions = [
	'Call over Google Meet',
	'Text at your email',
	'Text at your Instagram ID',
]

const validate = (formState: Partial<BirthDetails>): FormError[] => {
	const errors: FormError[] = []

	if (!formState.fullName) {
		errors.push({ name: 'fullName', message: 'Name is required.' })
	}

	if (!formState.email) {
		errors.push({ name: 'email', message: 'Email address is required.' })
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
		errors.push({ name: 'email', message: 'Enter a valid email address.' })
	}

	if (!formState.dateOfBirth) {
		errors.push({ name: 'dateOfBirth', message: 'Date of birth is required.' })
	}

	if (!formState.timeOfBirth) {
		errors.push({ name: 'timeOfBirth', message: 'Time of birth is required.' })
	}

	if (!formState.location) {
		errors.push({ name: 'location', message: 'Location is required.' })
	}

	if (!formState.consultationMethod) {
		errors.push({ name: 'consultationMethod', message: 'Choose how you want your consultation.' })
	}

	if (formState.consultationMethod === 'Text at your Instagram ID' && !formState.instagramUsername) {
		errors.push({ name: 'instagramUsername', message: 'Instagram username is required for Instagram consultations.' })
	}

	return errors
}
</script>
