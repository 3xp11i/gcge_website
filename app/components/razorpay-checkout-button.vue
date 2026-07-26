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
import type { BirthDetails } from '~/shared/types/form.types';
import { serializeCalendarDate, serializeTime } from '~/shared/utils/dateSerializers';

type CreateOrderResponse = {
	order_id: string
	amount: number
	currency: string
}

type VerifyPaymentResponse = {
	success: boolean
}
interface RazorpayOptions {
	key: string
	amount: number
	currency: string
	name: string
	order_id: string
	description?: string
	image?: string
	notes?: Record<string, string | boolean | undefined>
	theme?: { color?: string }
	prefill?: {
		name?: string
		email?: string
		contact?: string
	}
	modal?: {
		ondismiss?: () => void
		confirm_close?: boolean
	}
	handler: (response: RazorpayPaymentResponse) => void
}

interface RazorpayPaymentResponse {
	razorpay_payment_id: string
	razorpay_order_id: string
	razorpay_signature: string
}

interface RazorpayFailureResponse {
	error: {
		code: string
		description: string
		source: string
		step: string
		reason: string
		order_id?: string
		payment_id?: string
	}
}

interface RazorpayInstance {
	open: () => void
	on: (event: 'payment.failed', callback: (response: RazorpayFailureResponse) => void) => void
	close?: () => void
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance

let razorpayScriptPromise: Promise<void> | null = null

const loadRazorpayScript = async () => {
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
	emit('needDetails')
}


interface Props {
	amountPaise: number
	description: string
	receipt: string
	label?: string
	birthDetails: BirthDetails | null
	activeReceipt?: string | null
}

const props = withDefaults(defineProps<Props>(), {
	label: "Pay with Razorpay",
	birthDetails: null,
	activeReceipt: null,
})

const loading = ref(false)
const statusMessage = ref("")
const errorMessage = ref("")
const runtimeConfig = useRuntimeConfig()


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
				phone: details.phone,
				dateOfBirth: serializeCalendarDate(details.dateOfBirth),
				timeOfBirth: serializeTime(details.timeOfBirth),
				location: details.location,
				zipcode: details.zipcode,
				consultationMethod: details.consultationMethod,
				instagramUsername: details.instagramUsername,
				needsBtr: String(details.needsBtr),
				message: details.message,
				receipt: props.receipt,
				amountPaise: String(props.amountPaise),
				description: props.description,
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
				if (!response.razorpay_payment_id) {
					errorMessage.value = "Payment response is incomplete. Please try again."
					loading.value = false
					return
				}
				loading.value = false
				statusMessage.value = "Payment received. We'll confirm shortly."
				emit('paymentSuccess')
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
