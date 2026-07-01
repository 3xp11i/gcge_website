<template>
	<div class="flex flex-col gap-3">
		<UButton
			type="button"
			:loading="loading"
			:disabled="loading"
			class="button w-full justify-center"
			size="lg"
			@click="startCheckout"

		>
			{{ loading ? 'Preparing checkout...' : label }}
		</UButton>

		<p v-if="statusMessage" class="text-sm leading-6 text-white/70">
			{{ statusMessage }}
		</p>
		<p v-if="errorMessage" class="text-sm leading-6 text-red-300">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
useHead({
	script: [
		{
			// src: "https://checkout.razorpay.com/v1/checkout.js",
			src: "https://checkout.razorpay.com/v1/magic-checkout.js",
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
}>(), {
	label: "Pay with Razorpay",
})

const loading = ref(false)
const statusMessage = ref("")
const errorMessage = ref("")
const runtimeConfig = useRuntimeConfig()

const startCheckout = async () => {
	if (loading.value || !import.meta.client) {
		return
	}

	console.log(runtimeConfig.public.razorpayKeyId)

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
			description: props.description,
			show_coupons: true,
			one_click_checkout: true,
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
