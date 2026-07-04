<template>
	<div class="flex flex-col gap-3">
		<template v-if="isInternational">
			<div class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/80">
				For international consultations, please fill out this form to book your session.
			</div>
			<UButton
				:to="googleFormUrl"
				target="_blank"
				rel="noopener noreferrer"
				class="button w-full justify-center"
				size="lg"
			>
				Book Consultation
			</UButton>
		</template>

		<UModal
			v-else
			v-model:open="birthDetailsOpen"
			title="Share birth details"
			description="Fill in the person's details first. We will keep the payment flow ready for the next step."
			scrollable
			:ui="{ footer: 'justify-end' }"
		>
			<UButton
				type="button"
				class="button w-full justify-center"
				size="lg"
				@click="openBirthDetailsModal"
			>
				{{ label }}
			</UButton>

			<template #body>
				<div class="space-y-6">
					<div class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
						Please share the birth details so the consultation can be reviewed before payment.
					</div>

					<UForm :state="birthDetailsState" :validate="validateBirthDetails" class="space-y-5" @submit="startCheckout">
						<div class="grid gap-4 sm:grid-cols-2">
							<UFormField label="Name of the person" name="fullName">
								<UInput v-model="birthDetailsState.fullName" placeholder="Full name" />
							</UFormField>

							<UFormField label="Email address" name="email">
								<UInput v-model="birthDetailsState.email" type="email" placeholder="name@example.com" />
							</UFormField>

							<UFormField label="Date of birth" name="dateOfBirth">
								<UInput v-model="birthDetailsState.dateOfBirth" type="date" />
							</UFormField>

							<UFormField label="Time of birth" name="timeOfBirth">
								<UInput v-model="birthDetailsState.timeOfBirth" type="time" />
							</UFormField>

							<UFormField label="Location" name="location" class="sm:col-span-2">
								<UInput v-model="birthDetailsState.location" placeholder="City, state, and country" />
							</UFormField>
						</div>

						<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
							<UButton type="button" color="neutral" variant="outline" @click="closeBirthDetailsModal">
								Cancel
							</UButton>
							<UButton type="submit" class="button justify-center" :loading="submittingBirthDetails">
								Continue
							</UButton>
						</div>
					</UForm>
				</div>
			</template>
		</UModal>

		<p v-if="!isInternational && statusMessage" class="text-sm leading-6 text-white/70">
			{{ statusMessage }}
		</p>
		<p v-if="!isInternational && errorMessage" class="text-sm leading-6 text-red-300">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

useHead({
	script: [
		{
			src: "https://checkout.razorpay.com/v1/checkout.js",
			// src: "https://checkout.razorpay.com/v1/magic-checkout.js",
			defer: true,
		},
	],
})

type CreateOrderResponse = {
	order_id: string
	amount: number
	currency: string
}

type VerifyPaymentResponse = {
	success: boolean
}

type BirthDetailsState = {
	fullName: string
	email: string
	dateOfBirth: string
	timeOfBirth: string
	location: string
}

type RazorpayInstance = {
	open: () => void
	on: (eventName: "payment.failed", callback: (response: any) => void) => void
}

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance

const props = withDefaults(defineProps<{
	amountPaise: number
	description: string
	receipt: string
	label?: string
	isInternational?: boolean
}>(), {
	label: "Pay with Razorpay",
	isInternational: false,
})

const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdqwJ07ZEBED7sd8expF_CCfX8R1S3dubQtOHHO3hR8Xbe3yQ/viewform?usp=sharing&ouid=111532197843945966022"

const isInternational = computed(() => props.isInternational)

const birthDetailsOpen = ref(false)
const loading = ref(false)
const submittingBirthDetails = ref(false)
const statusMessage = ref("")
const errorMessage = ref("")
const runtimeConfig = useRuntimeConfig()

const birthDetailsState = reactive<BirthDetailsState>({
	fullName: "Someone",
	email: "someone@example.com",
	dateOfBirth: "",
	timeOfBirth: "",
	location: "",
})

const resetBirthDetailsState = () => {
	birthDetailsState.fullName = ""
	birthDetailsState.email = ""
	birthDetailsState.dateOfBirth = ""
	birthDetailsState.timeOfBirth = ""
	birthDetailsState.location = ""
}

const openBirthDetailsModal = () => {
	if (isInternational.value) {
		return
	}

	statusMessage.value = ""
	errorMessage.value = ""
	resetBirthDetailsState()
	birthDetailsOpen.value = true
}

const closeBirthDetailsModal = () => {
	birthDetailsOpen.value = false
}

const validateBirthDetails = (state: Partial<BirthDetailsState>): FormError[] => {
	const errors: FormError[] = []

	if (!state.fullName) {
		errors.push({ name: "fullName", message: "Name is required." })
	}

	if (!state.email) {
		errors.push({ name: "email", message: "Email address is required." })
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
		errors.push({ name: "email", message: "Enter a valid email address." })
	}

	if (!state.dateOfBirth) {
		errors.push({ name: "dateOfBirth", message: "Date of birth is required." })
	}

	if (!state.timeOfBirth) {
		errors.push({ name: "timeOfBirth", message: "Time of birth is required." })
	}

	if (!state.location) {
		errors.push({ name: "location", message: "Location is required." })
	}

	return errors
}

const sendBirthDetailsToDiscord = async (details: BirthDetailsState) => {

	if (submittingBirthDetails.value) {
		return
	}

	console.log("Birth Details", details);
	
	submittingBirthDetails.value = true
	errorMessage.value = ""

	try {
		await $fetch("/api/discord", {
			method: "POST",
			body: {
				type: "birth-details",
				data: {
					fullName: details.fullName,
					email: details.email,
					dateOfBirth: details.dateOfBirth,
					timeOfBirth: details.timeOfBirth,
					location: details.location,
					amountPaise: props.amountPaise,
					description: props.description,
					receipt: props.receipt,
				},
			},
		})
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to save birth details."
		throw error
	} finally {
		submittingBirthDetails.value = false
	}
}

const startCheckout = async () => {
	if (loading.value || !import.meta.client) {
		return
	}
	console.log("Birth Details", {
		fullName: birthDetailsState.fullName,
		email: birthDetailsState.email,
		dateOfBirth: birthDetailsState.dateOfBirth,
		timeOfBirth: birthDetailsState.timeOfBirth,
		location: birthDetailsState.location,
	});

	// console.log(runtimeConfig.public.razorpayKeyId)

	loading.value = true
	statusMessage.value = ""
	errorMessage.value = ""

	try {
		const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay

		if (!Razorpay) {
			throw new Error("Payment gateway is still loading. Please try again in a moment.")
		}

		const order = await $fetch<CreateOrderResponse>("/api/create-order", {
			method: "POST",
			body: {
				amount: props.amountPaise,
				currency: "INR",
				receipt: props.receipt,
			},
		})

		const checkout = new Razorpay({
			key: runtimeConfig.public.razorpayKeyId,
			amount: order.amount,
			currency: order.currency,
			
			name: "Galactic Gene",
			order_id: order.order_id,
			description: props.description,
			// redirect: false,
			// show_coupons: true,
			// one_click_checkout: true,
			theme: {
				color: "#d4a017",
			},
			modal: {
				ondismiss: () => {
					statusMessage.value = "Checkout was closed before payment was completed."
					loading.value = false
				},
			},
			handler: async (response: {
				razorpay_payment_id: string
				razorpay_order_id: string
				razorpay_signature: string
			}) => {
				console.log("Payment response:", response)
					if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
						throw new Error("Payment response is incomplete. Please try again.")
					}

				statusMessage.value = "Verifying payment..."

				try {
					const verification = await $fetch<VerifyPaymentResponse>("/api/verify-payment", {
						method: "POST",
						body: {
							order_id: response.razorpay_order_id,
							payment_id: response.razorpay_payment_id,
							signature: response.razorpay_signature,
						},
					})

					if (verification.success) {
						statusMessage.value = "Payment verified successfully."
						await sendBirthDetailsToDiscord({
							fullName: birthDetailsState.fullName,
							email: birthDetailsState.email,
							dateOfBirth: birthDetailsState.dateOfBirth,
							timeOfBirth: birthDetailsState.timeOfBirth,
							location: birthDetailsState.location,
						})
						statusMessage.value = "Payment verified successfully. Birth details sent to Discord."
						birthDetailsOpen.value = false
						resetBirthDetailsState()
						loading.value = false
						return
					}

					throw new Error("Payment verification failed.")
				} catch (verificationError) {
					const message = verificationError instanceof Error ? verificationError.message : "Payment verification failed."
					errorMessage.value = message
					statusMessage.value = ""
					loading.value = false
				}
			},
		})

		checkout.on("payment.failed", (response) => {
			errorMessage.value = response?.error?.description ?? "Payment failed. Please try again."
			statusMessage.value = ""
			loading.value = false
		})

		checkout.open()
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to start checkout."
		loading.value = false
	}
}
</script>
