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


		<div id="dodo-inline-checkout"></div>
	</div>
</template>

<script setup lang="ts">
import type { BirthDetails } from './birth-details-form.vue'
import { DodoPayments, type CheckoutEvent } from "dodopayments-checkout";




type CreateDodoCheckoutResponse = {
	checkout_url: string
}

const emit = defineEmits<{
	needDetails: []
	checkoutStarted: []
}>()

const handleButtonClick = () => {
	emit('needDetails')
}

const props = withDefaults(defineProps<{
	amountUsd: number
	description: string
	receipt: string
	dodoProductId?: string
	label?: string
	birthDetails: BirthDetails | null
	activeReceipt?: string | null
}>(), {
	label: "Pay with Dodo Payments",
	birthDetails: null,
	activeReceipt: null,
})

const loading = ref(false)
const statusMessage = ref("")
const errorMessage = ref("")

const sendBirthDetailsToDiscord = async (details: BirthDetails) => {
	if (loading.value) {
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
					amountUsd: props.amountUsd,
					description: props.description,
					receipt: props.receipt,
					paymentGateway: "Dodo Payments",
				},
			},
		})
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to save birth details."
		throw error
	}
}

const startCheckout = async (details: BirthDetails | null = props.birthDetails) => {

	console.log("Payment Button clicked");


	if (loading.value || !import.meta.client || !details) {
		return
	}

	loading.value = true
	statusMessage.value = ""
	errorMessage.value = ""

	try {
		statusMessage.value = "Preparing checkout..."

		console.log("Starting checkout process...");


		const response = await $fetch<CreateDodoCheckoutResponse>("/api/dodo-checkout", {
			method: "POST",
			body: {
				amountUsd: props.amountUsd,
				description: props.description,
				receipt: props.receipt,
				dodoProductId: props.dodoProductId,
				customerName: details.fullName,
				customerEmail: details.email,
				metadata: {
					fullName: details.fullName,
					email: details.email,
					dateOfBirth: details.dateOfBirth,
					timeOfBirth: details.timeOfBirth,
					location: details.location,
					consultationMethod: details.consultationMethod,
					instagramUsername: details.instagramUsername,
					needsBtr: details.needsBtr,
				},
			},
		})

		if (!response.checkout_url) {
			throw new Error("Failed to generate checkout URL")
		}


		DodoPayments.Initialize({
			mode: (import.meta.env.NUXT_PUBLIC_DODO_MODE as "test" | "live") || "test",
			// displayType: "", // default is overlay, this is explicit
			onEvent: (event: CheckoutEvent) => {
				// Optional: handle useful overlay lifecycle + outcomes
				switch (event.event_type) {
					case "checkout.opened":
						console.log("Dodo overlay opened");
						break;
					case "checkout.closed":
						console.log("Dodo overlay closed");
						statusMessage.value = ""
						loading.value = false
						break;
					case "checkout.error":
						console.error("Dodo overlay error:", event.data?.message);
						break;
				}
			},
		});

		// Discord notification is now sent by the server webhook AFTER verified payment
		DodoPayments.Checkout.open({
			checkoutUrl: response.checkout_url,
			// elementId: "dodo-inline-checkout"
		})
	} catch (error) {
		errorMessage.value = error instanceof Error ? error.message : "Unable to start checkout."
		statusMessage.value = ""
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
