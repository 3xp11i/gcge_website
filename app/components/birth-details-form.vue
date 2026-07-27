<template>
	<UForm :state="state"
		   :validate="validate"
		   class="space-y-10"
		   :ui="{}"
		   @submit="$emit('submit', state)">
		<!-- <div class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
			We will contact you on your email address for the chosen date & timing of your consultation.
		</div> -->

		<div class="grid gap-5 sm:grid-cols-2"
			 v-show="formStep === 'birthDetails'">
			<UFormField label="Name of the person"
						name="fullName"
						class="sm:col-span-2 w-full">
				<UInput v-model="state.fullName"
						class="w-full"
						placeholder="Full name" />
			</UFormField>

			<UFormField label="Email address"
						name="email">
				<UInput v-model="state.email"
						type="email"
						placeholder="name@example.com" />
			</UFormField>

			<UFormField label="Mobile Number"
						name="phone">
				<UFieldGroup>
					<USelectMenu v-model="countryCode"
								 :disabled="selectedRegion === 'India'"
								 :items="phoneCodes"
								 value-key="code"
								 :search-input="{
									placeholder: 'Search country...',
									icon: 'i-lucide-search',
									loading: false
								}"
								 :filter-fields="['name', 'code', 'dialCode']"
								 :content="{ align: 'start' }"
								 :ui="{
									base: 'pe-8',
									content: 'w-48',
									placeholder: 'hidden',
									trailingIcon: 'size-4'
								}"
								 trailing-icon="i-lucide-chevrons-up-down"
								 @update:open="onOpen">
						<span class="size-5 flex items-center text-lg">
							{{ country?.emoji || '\u{1F1EE}\u{1F1F3}' }}
						</span>

						<template #item-leading="{ item }">
							<span class="size-5 flex items-center text-lg">
								{{ item.emoji }}
							</span>
						</template>

						<template #item-label="{ item }">
							{{ item.name }} ({{ item.dialCode }})
						</template>
					</USelectMenu>

					<UInput v-model="phone"
							required
							v-maska="mask"
							class="w-full"
							:placeholder="mask.replaceAll('#', '_')"
							:style="{ '--dial-code-length': `${dialCode.length + 1.5}ch` }"
							:ui="{
								base: 'ps-(--dial-code-length)',
								leading: 'pointer-events-none text-base md:text-sm text-muted'
							}">
						<template #leading>
							{{ dialCode }}
						</template>
					</UInput>
				</UFieldGroup>
			</UFormField>


			<UFormField label="Date of birth"
						name="dateOfBirth">
				<UInputDate ref="inputDate"
							required
							v-model="state.dateOfBirth">
					<template #trailing>
						<UPopover :reference="inputDate?.inputsRef[3]?.$el">
							<UButton color="neutral"
									 variant="link"
									 size="sm"
									 icon="i-lucide-calendar"
									 aria-label="Select a date"
									 class="px-0" />

							<template #content>
								<UCalendar v-model="state.dateOfBirth"
										   class="p-2" />
							</template>
						</UPopover>
					</template>
				</UInputDate>
			</UFormField>

			<UFormField label="Time of birth"
						name="timeOfBirth">
				<UInputTime v-model="state.timeOfBirth"
							type="time"
							required
							granularity="second" />
			</UFormField>

			<UFormField label="Birth Location"
						name="birthLocation"
						class="">
				<UInput v-model="state.location"
						required
						placeholder="City, state, and country"
						class="w-full" />
			</UFormField>
			<UFormField label="Zipcode"
						name="zipcode"
						class="">
				<UInput v-model="state.zipcode"
						required
						placeholder="Birth location zipcode"
						class="w-full" />
			</UFormField>

			<UFormField label="How would you like your consultation?"
						name="consultationMethod"
						class="sm:col-span-2 w-full">
				<USelectMenu v-model="state.consultationMethod"
							 :items="Object.entries(consultationMethodOptions).map(([value, label]) => ({ value, label }))"
							 value-key="value"
							 required
							 class=" w-full"
							 placeholder="Choose a consultation format" />
			</UFormField>

			<UFormField v-if="state.consultationMethod === 'instagram'"
						label="Instagram username"
						name="instagramUsername"
						class="sm:col-span-2">
				<UInput v-model="state.instagramUsername"
						placeholder="your.instagram.username" />
			</UFormField>

			<!-- <UTooltip text="Tick this if you are unsure about the birth time"
					  arrow
					  :ui="{
						content: 'max-w-xs sm:max-w-sm bg-amber-200',
						text: 'text-black'
					}"> -->
			<UFormField name="needsBtr"
						class="sm:col-span-2 rounded-2xl border border-white/10 bg-black/10 p-4">
				<UCheckbox v-model="state.needsBtr"
						   label="Requires Birth Time Rectification"
						   description="Tick this if you are unsure about the birth time" />
			</UFormField>
			<!-- </UTooltip> -->


			<UFormField label="Share anything you want to address in the consultation"
						name="message"
						class="w-full sm:col-span-2">
				<UTextarea v-model="state.message"
						   placeholder="Write your question here..."
						   class="w-full"
						   maxlength="500" />

			</UFormField>

		</div>




		<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
			<UButton type="button"
					 color="neutral"
					 variant="outline"
					 class="button justify-center bg-transparent! text-mist-200!"
					 @click="$emit('cancel')"
					 v-if="formStep === 'birthDetails'">
				Cancel
			</UButton>
			<UButton type="button"
					 v-if="formStep === 'birthDetails'"
					 @click="continueToNextStep"
					 class="button justify-center">
				{{ 'Next' }}
			</UButton>
			<!-- TODO: Slot booking step - temporarily skipped
			<UButton type="button"
					 color="neutral"
					 variant="outline"
					 class="button justify-center bg-transparent! text-mist-200!"
					 @click="() => { formStep = 'birthDetails'; $emit('slotBookingFormActive', false) }"
					 v-if="formStep === 'slotBooking'">
				Back
			</UButton>
			<UButton type="submit"
					 v-if="formStep === 'slotBooking'"
					 class="button justify-center"
					 :loading="loading">
				{{ submitLabel || 'Submit' }}
			</UButton>
			-->
		</div>
	</UForm>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { CalendarDate, Time } from '@internationalized/date'
import type { BirthDetails } from '~/shared/types/form.types';

import { vMaska } from 'maska/vue'


defineProps<{
	loading?: boolean
	submitLabel?: string
}>()

const emits = defineEmits<{
  (e: 'submit', details: BirthDetails): void
  (e: 'cancel'): void
  (e: 'slotBookingFormActive', value: boolean): void
}>()


const continueToNextStep = () => {
	if (formStep.value === 'birthDetails') {
		const errors = validate(state)
		if (errors.length > 0) {
			// Handle validation errors (e.g., show error messages)
			return
		}
		// TODO: Slot booking step - temporarily skipped, going directly to payment
		// formStep.value = 'slotBooking'
		// emits('slotBookingFormActive', true)
		emits('submit', state)
	}
}



const formStep = ref<'birthDetails' | 'slotBooking'>('birthDetails')

type PhoneCode = {
	name: string
	code: string
	emoji: string
	dialCode: string
	mask: string
}
const phone = ref('')
const countryCode = ref('IN')


const { data: phoneCodes, status, execute } = await useLazyFetch<PhoneCode[]>('/api/phone-codes', {
	key: 'api-phone-codes',
	immediate: false
})

const country = computed(() => phoneCodes.value?.find(c => c.code === countryCode.value))
const dialCode = computed(() => country.value?.dialCode || '+91')
const mask = computed(() => country.value?.mask || '#####-#####')

function onOpen() {
	if (!phoneCodes.value?.length) {
		execute()
	}
}

watch(countryCode, () => {
	phone.value = ''
})

watch([phone, dialCode], () => {
	state.phone = dialCode.value + phone.value
})

const { selectedRegion, initRegion } = useRegionSelection()


const inputDate = useTemplateRef('inputDate')

const n = new Date()

const state = reactive<BirthDetails>({
	fullName: '',
	email: '',
	phone: dialCode.value + phone.value,
	dateOfBirth: shallowRef(new CalendarDate(n.getFullYear(), n.getMonth(), n.getDate())),
	timeOfBirth: shallowRef(new Time(n.getHours(), n.getMinutes(), n.getSeconds())),
	location: '',
	zipcode: '',
	consultationMethod: 'googleMeet',
	instagramUsername: '',
	needsBtr: false,
	message: '',
})

// const consultationMethodOptions = [
// 	'Call over Google Meet',
// 	'Text at your email',
// 	'Text at your Instagram ID',
// ]
const consultationMethodOptions = {
	googleMeet: 'Call over Google Meet',
	email: 'Text at your email',
	instagram: 'Text at your Instagram ID',
}

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

	if (formState.consultationMethod === 'instagram' && !formState.instagramUsername) {
		errors.push({ name: 'instagramUsername', message: 'Instagram username is required for Instagram consultations.' })
	}

	// Phone number checking
	// if (!formState.phone) {
	// 	errors.push({ name: 'phone', message: 'Phone number is required.' })
	// } else if (!/^\+\d{1,3}\d{4,14}$/.test(formState.phone)) {
	// 	errors.push({ name: 'phone', message: 'Enter a valid phone number with country code.' })
	// }

	return errors
}
</script>
