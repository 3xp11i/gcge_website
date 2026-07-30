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

		<div v-show="formStep === 'slotBooking'"
			 class="space-y-5">
			<div class="text-sm text-white/50">
				All times are shown in your local timezone:
				<span class="text-white/80 font-medium">{{ localTz }}</span>
			</div>

			<div v-if="availabilityStatus === 'error'"
				 class="text-sm text-red-400 pt-1">
				Failed to load slots. <button type="button" class="underline" @click="fetchMonthSlots(calendarPage)">Retry</button>
			</div>

			<div class="flex flex-col gap-6 sm:flex-row sm:items-start">
				<!-- Calendar -->
				<div class="shrink-0">
					<div v-if="availabilityStatus === 'idle' || availabilityStatus === 'pending'"
						 class="space-y-3">
						<div class="flex items-center justify-between">
							<USkeleton class="h-6 w-6 rounded-md" />
							<USkeleton class="h-5 w-28 rounded-md" />
							<USkeleton class="h-6 w-6 rounded-md" />
						</div>
						<div class="grid grid-cols-7 gap-1">
							<USkeleton v-for="i in 7" :key="i" class="h-5 rounded" />
						</div>
						<div class="grid grid-cols-7 gap-1">
							<USkeleton v-for="i in 35" :key="i" class="h-8 w-8 rounded-full" />
						</div>
					</div>
					<UCalendar v-else
							   v-model="selectedDate"
							   v-model:placeholder="calendarPage"
							   color="neutral"
							   :is-date-disabled="isDateDisabled"
							   :min-value="calendarMinDate"
							   :max-value="calendarMaxDate" />
				</div>

				<!-- Slots -->
				<div class="flex-1 min-w-40 overflow-y-auto max-h-52 sm:max-h-[22rem]">
					<div v-if="availabilityStatus === 'idle' || availabilityStatus === 'pending'"
						 class="space-y-3 pr-4">
						<USkeleton class="h-5 w-20 rounded-md" />
						<USkeleton v-for="i in 6" :key="i" class="h-14 rounded-xl" />
					</div>
					<template v-else>
						<div v-if="!selectedDate"
							 class="text-sm text-white/40 pt-1">
							Select a date to see available slots.
						</div>
						<div v-else-if="slotsForSelectedDate.length === 0"
							 class="text-sm text-white/40 pt-1">
							No slots available on this date.
						</div>
						<div v-else
							 class="space-y-4">
							<div v-for="period in slotsByPeriod"
								 :key="period.key"
								 class="space-y-2">
								<span class="text-lg font-semibold uppercase tracking-wider text-white/50">{{ period.label
									}}</span>
								<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 pr-4">
									<button v-for="slot in period.slots"
											:key="slot.start.toISOString()"
											type="button"
											@click="selectedSlot = slot"
											:class="[
												'rounded-xl border px-3 py-2.5 text-sm text-left transition-colors',
												selectedSlot?.start.toISOString() === slot.start.toISOString()
													? 'border-white/50 bg-white/10 text-white'
													: 'border-white/10 bg-black/20 text-white/70 hover:border-white/25 hover:text-white'
											]">
										<div class="font-medium">{{ formatSlotTime(slot.start) }}</div>
										<div class="text-xs text-white/40 mt-0.5">{{ formatSlotTime(slot.end) }}</div>
									</button>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>


		<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
			<UButton type="button"
					 v-if="formStep === 'birthDetails'"
					 @click="continueToNextStep"
					 class="button justify-center">
				{{ 'Next' }}
			</UButton>
			<UButton type="button"
					 color="neutral"
					 variant="outline"
					 class="button justify-center bg-transparent! text-mist-200!"
					 @click="$emit('cancel')"
					 v-if="formStep === 'birthDetails'">
				Cancel
			</UButton>
			<!-- TODO: Slot booking step - temporarily skipped -->
			<UButton type="submit"
					 v-if="formStep === 'slotBooking'"
					 class="button justify-center"
					 :loading="loading">
				{{ submitLabel || 'Submit' }}
			</UButton>
			<UButton type="button"
					 color="neutral"
					 variant="outline"
					 class="button justify-center bg-transparent! text-mist-200!"
					 @click="() => { formStep = 'birthDetails'; $emit('slotBookingFormActive', false) }"
					 v-if="formStep === 'slotBooking'">
				Back
			</UButton>

		</div>
	</UForm>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { CalendarDate, Time, today, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import type { BirthDetails } from '~/shared/types/form.types';
import { vMaska } from 'maska/vue'
import type { DayAvailability, Candidate } from '~/shared/types/extra.types'



const props = defineProps<{
	loading?: boolean
	submitLabel?: string
	serviceDurationMinutes?: number
}>()

const serviceDurationMinutes = computed(() => props.serviceDurationMinutes ?? 30)

const availability = ref<DayAvailability[]>([])
const availabilityStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const fetchedMonths = new Set<string>()

const calendarPage = shallowRef<CalendarDate>(today(getLocalTimeZone()))

const fetchMonthSlots = async (page: CalendarDate) => {
	const key = `${page.year}-${String(page.month).padStart(2, '0')}`
	if (fetchedMonths.has(key)) return

	// Block fetching beyond the 4-month window
	const maxPage = today(getLocalTimeZone()).add({ months: 4 })
	if (page.compare(new CalendarDate(maxPage.year, maxPage.month, 1)) >= 0) return

	fetchedMonths.add(key)

	const now = today(getLocalTimeZone())
	const firstOfMonth = new CalendarDate(page.year, page.month, 1)
	// last day of month = first day of next month minus 1
	const firstOfNext = page.month === 12
		? new CalendarDate(page.year + 1, 1, 1)
		: new CalendarDate(page.year, page.month + 1, 1)
	const lastOfMonth = firstOfNext.subtract({ days: 1 })

	const fromDate = firstOfMonth.compare(now) > 0
		? `${firstOfMonth.year}-${String(firstOfMonth.month).padStart(2, '0')}-${String(firstOfMonth.day).padStart(2, '0')}`
		: `${now.year}-${String(now.month).padStart(2, '0')}-${String(now.day).padStart(2, '0')}`
	const toDate = `${lastOfMonth.year}-${String(lastOfMonth.month).padStart(2, '0')}-${String(lastOfMonth.day).padStart(2, '0')}`

	if (fromDate > toDate) return // entire month is in the past

	availabilityStatus.value = 'pending'
	try {
		const data = await $fetch<DayAvailability[]>('/api/available-slots', { query: { fromDate, toDate } })
		availability.value = [...availability.value, ...data]
		availabilityStatus.value = 'success'
	} catch {
		fetchedMonths.delete(key) // allow retry
		availabilityStatus.value = 'error'
	}
}

watch(calendarPage, (page) => {
	if (formStep.value === 'slotBooking') fetchMonthSlots(page)
})

// Build candidates for every returned day, using the composable per window
const candidates = computed<Candidate[]>(() => {
	if (!availability.value.length) return []

	const all: Candidate[] = []
	for (const day of availability.value) {
		for (const window of day.windows) {
			const dayCandidates = useSlotsGenerator(
				new Date(window.start),
				new Date(window.end),
				serviceDurationMinutes.value,
				day.bookings
			)
			all.push(...dayCandidates)
		}
	}
	return all
})
// --- Slot booking ---
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

const calendarMinDate = today(getLocalTimeZone())
// Block navigation beyond 4 months from today
const calendarMaxDate = today(getLocalTimeZone()).add({ months: 4 }).subtract({ days: 1 })

const datesWithSlots = computed(() => {
	const set = new Set<string>()
	for (const c of candidates.value) {
		const d = c.start
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		set.add(key)
	}
	return set
})

const slotsForSelectedDate = computed(() => {
	if (!selectedDate.value) return []
	const { year, month, day } = selectedDate.value
	return candidates.value.filter(c => {
		const d = c.start
		return d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day
	})
})
const selectedDate = shallowRef<CalendarDate | undefined>(undefined)
const selectedSlot = ref<{ start: Date; end: Date } | undefined>(undefined)

watch(selectedSlot, (newSlot) => {
	state.slotStart = newSlot?.start.toISOString()
	state.slotEnd = newSlot?.end.toISOString()
})


const isDateDisabled = (date: DateValue): boolean => {
	const key = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
	return !datesWithSlots.value.has(key)
}

const slotsByPeriod = computed(() => {
	const periods: { label: string; key: string; startHour: number; endHour: number; slots: Candidate[] }[] = [
		{ label: 'Morning', key: 'morning', startHour: 9, endHour: 12, slots: [] },
		{ label: 'Afternoon', key: 'afternoon', startHour: 12, endHour: 16, slots: [] },
		{ label: 'Evening', key: 'evening', startHour: 16, endHour: 20, slots: [] },
		{ label: 'Night', key: 'night', startHour: 20, endHour: 23, slots: [] },
	]

	for (const slot of slotsForSelectedDate.value) {
		const hour = slot.start.getHours()
		for (const period of periods) {
			if (hour >= period.startHour && hour < period.endHour) {
				period.slots.push(slot)
				break
			}
		}
	}

	return periods.filter(p => p.slots.length > 0)
})
// console.log('availability:', availability.value)
// console.log('candidates:', candidates.value.length)
// console.log('datesWithSlots:', [...datesWithSlots.value])
// Reset selected slot when date changes
watch(selectedDate, () => {
	selectedSlot.value = undefined
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
	timeZone: localTz,
})

const formatSlotTime = (date: Date): string => timeFormatter.format(date)


const emits = defineEmits<{
	(e: 'submit', details: BirthDetails): void
	(e: 'cancel'): void
	(e: 'slotBookingFormActive', value: boolean): void
}>()


const continueToNextStep = async () => {
	if (formStep.value === 'birthDetails') {
		const errors = validate(state)
		if (errors.length > 0) {
			// Handle validation errors (e.g., show error messages)
			return
		}
		// TODO: Slot booking step - temporarily skipped, going directly to payment
		formStep.value = 'slotBooking'
		emits('slotBookingFormActive', true)
		await fetchMonthSlots(calendarPage.value)
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
	slotStart: undefined,
	slotEnd: undefined,
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
