<template>
	<div class="flex flex-col gap-3">
		<UButton type="button"
				 class="button w-full justify-center"
				 size="lg"
				 :loading="loading"
				 @click="handleButtonClick">
			{{ label }}
		</UButton>

		<p v-if="statusMessage"
		   class="text-sm leading-6 text-white/70">
			{{ statusMessage }}
		</p>
		<p v-if="errorMessage"
		   class="text-sm leading-6 text-red-300">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
import type { BirthDetails } from './birth-details-form.vue'

type CreateOrderResponse = {
	order_id: string
	amount: number
	currency: string
}

type VerifyPaymentResponse = {
	success: boolean
}

type RazorpayInstance = {
	open: () => void
	on: (eventName: "payment.failed", callback: (response: any) => void) => void
}

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance

let razorpayScriptPromise: Promise<void> | null = null

const loadRazorpayScript = () => {
	if (!import.meta.client) {
		return Promise.resolve()
	}

	const existingRazorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay
	if (existingRazorpay) {
		return Promise.resolve()
	}

	if (razorpayScriptPromise) {
		return razorpayScriptPromise
	}

	razorpayScriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script")
		script.src = "https://checkout.razorpay.com/v1/checkout.js"
		script.async = true

		script.onload = () => resolve()
		script.onerror = () => {
			razorpayScriptPromise = null
			reject(new Error("Unable to load payment gateway. Please try again."))
		}

		document.head.appendChild(script)
	})

	return razorpayScriptPromise
}

const emit = defineEmits<{
	needDetails: []
	checkoutStarted: []
	paymentSuccess: []
	paymentDismissed: []
}>()

const handleButtonClick = () => {
	if (import.meta.client) {
		void loadRazorpayScript()
	}
	emit('needDetails')
}

const props = withDefaults(defineProps<{
	amountPaise: number
	description: string
	receipt: string
	label?: string
	birthDetails: BirthDetails | null
	activeReceipt?: string | null
}>(), {
	label: "Pay with Razorpay",
	birthDetails: null,
	activeReceipt: null,
})

const loading = ref(false)
const statusMessage = ref("")
const errorMessage = ref("")
const runtimeConfig = useRuntimeConfig()

const sendBirthDetailsToDiscord = async (details: BirthDetails, paymentId?: string) => {
	console.log("Sending details to discord")
	if (loading.value) {
		console.log("Loading is true, returning")
		return
	}

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
					consultationMethod: details.consultationMethod,
					instagramUsername: details.instagramUsername,
					needsBtr: details.needsBtr,
					amountPaise: props.amountPaise,
					description: props.description,
					receipt: props.receipt,
					paymentId: paymentId,
					// paymentGateway: "Razorpay",
				},
				paymentProvider: "razorpay",
			},
		})
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to save birth details."
		throw error
	}
}

const startCheckout = async (details: BirthDetails | null = props.birthDetails) => {
	if (loading.value || !import.meta.client || !details) {
		return
	}

	loading.value = true
	statusMessage.value = ""
	errorMessage.value = ""

	try {
		await loadRazorpayScript()

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
			notes: {
				fullName: details.fullName,
				email: details.email,
				dateOfBirth: details.dateOfBirth,
				timeOfBirth: details.timeOfBirth,
				location: details.location,
				consultationMethod: details.consultationMethod,
				instagramUsername: details.instagramUsername,
				needsBtr: details.needsBtr,
			},
			theme: {
				color: "#d4a017",
			},
			modal: {
				ondismiss: () => {
					statusMessage.value = "Checkout was closed before payment was completed."
					loading.value = false
					emit('paymentDismissed')
				},
			},
			handler: async (response: {
				razorpay_payment_id: string
				razorpay_order_id: string
				razorpay_signature: string
			}) => {
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

					if (verification.success && details) {
						loading.value = false
						statusMessage.value = "Payment verified successfully."
						// const discordMessageDetails = {...details, paymentId: response.razorpay_payment_id}
						await sendBirthDetailsToDiscord(details, response.razorpay_payment_id)
						statusMessage.value = "Payment verified. Birth details sent."
						emit('paymentSuccess')
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

watch(
	() => [props.birthDetails, props.activeReceipt] as const,
	([details, activeReceipt]) => {
		if (import.meta.client && details && activeReceipt === props.receipt) {
			emit('checkoutStarted')
			startCheckout(details)
		}
	},
)
</script>
