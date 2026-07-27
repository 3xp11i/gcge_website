import { DodoPayments, type CheckoutEvent } from "dodopayments-checkout";

export type CheckoutProvider = "razorpay" | "dodo";

// export interface StartCheckoutOptions {
// 	provider: CheckoutProvider;
// 	receipt: string;
// 	description: string;
// 	metadata: Record<string, string | boolean | undefined>;
// 	customerName?: string;
// 	customerEmail?: string;
// 	// razorpay
// 	amountPaise?: number;
// 	// dodo
// 	amountUsd?: number;
// 	dodoProductId?: string;
// }

export interface StartCheckoutOptions {
	provider: CheckoutProvider;
	receipt: string;
	description: string;
	metadata: Record<string, string | boolean | undefined>;
	customerName?: string;
	customerEmail?: string;
	amountPaise?: number;
	amountUsd?: number;
	dodoProductId?: string;
	onSuccess?: () => void; // razorpay only — dodo confirms via webhook
	onDismiss?: () => void; // razorpay only
}

let razorpayScriptPromise: Promise<void> | null = null;

async function loadRazorpayScript() {
	if (!import.meta.client) return;
	const w = window as Window & { Razorpay?: any };
	if (w.Razorpay) return;
	if (razorpayScriptPromise) return razorpayScriptPromise;

	razorpayScriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			razorpayScriptPromise = null;
			reject(new Error("Unable to load payment gateway. Please try again."));
		};
		document.head.appendChild(script);
	});
	return razorpayScriptPromise;
}

export function usePaymentCheckout() {
	const loading = ref(false);
	const statusMessage = ref("");
	const errorMessage = ref("");
	const runtimeConfig = useRuntimeConfig();

	const getDodoMode = (): "test" | "live" => {
		const mode = String(runtimeConfig.public.dodoMode || "test").toLowerCase();
		return mode === "live" || mode === "live_mode" ? "live" : "test";
	};

	function reset() {
		statusMessage.value = "";
		errorMessage.value = "";
	}

	async function startDodo(opts: StartCheckoutOptions) {
		DodoPayments.Initialize({
			mode: getDodoMode(),
			onEvent: (event: CheckoutEvent) => {
				switch (event.event_type) {
					case "checkout.closed":
						statusMessage.value = "";
						loading.value = false;
						break;
					case "checkout.error":
						errorMessage.value = event.data?.message ?? "Payment failed.";
						loading.value = false;
						break;
				}
			},
		});

		statusMessage.value = "Preparing checkout...";
		const response = await $fetch<{ checkout_url: string }>(
			"/api/dodo-checkout",
			{
				method: "POST",
				body: {
					amountUsd: opts.amountUsd,
					description: opts.description,
					receipt: opts.receipt,
					dodoProductId: opts.dodoProductId,
					customerName: opts.customerName,
					customerEmail: opts.customerEmail,
					metadata: opts.metadata,
				},
			},
		);

		if (!response.checkout_url)
			throw new Error("Failed to generate checkout URL");
		DodoPayments.Checkout.open({ checkoutUrl: response.checkout_url });
	}

	async function startRazorpay(opts: StartCheckoutOptions) {
		await loadRazorpayScript();
		const Razorpay = (window as any).Razorpay;
		if (!Razorpay)
			throw new Error(
				"Payment gateway is still loading. Please try again in a moment.",
			);

		const order = await $fetch<{
			order_id: string;
			amount: number;
			currency: string;
		}>("/api/create-order", {
			method: "POST",
			body: {
				amount: opts.amountPaise,
				currency: "INR",
				receipt: opts.receipt,
			},
		});

		return new Promise<void>((resolve) => {
			const instance = new Razorpay({
				key: runtimeConfig.public.razorpayKeyId,
				amount: order.amount,
				currency: order.currency,
				name: "Galactic Gene",
				order_id: order.order_id,
				description: opts.description,
				notes: { ...opts.metadata, receipt: opts.receipt },
				theme: { color: "#d4a017" },

				modal: {
					ondismiss: () => {
						statusMessage.value =
							"Checkout was closed before payment was completed.";
						loading.value = false;
						opts.onDismiss?.();
						resolve();
					},
				},
				handler: () => {
					loading.value = false;
					statusMessage.value = "Payment received. We'll confirm shortly.";
					opts.onSuccess?.();
					resolve();
				},
				// -->
			});

			instance.on("payment.failed", (response: any) => {
				errorMessage.value =
					response?.error?.description ?? "Payment failed. Please try again.";
				statusMessage.value = "";
				loading.value = false;
				resolve();
			});

			instance.open();
		});
	}

	async function startCheckout(opts: StartCheckoutOptions) {
		if (loading.value || !import.meta.client) return;
		loading.value = true;
		reset();
		try {
			if (opts.provider === "razorpay") await startRazorpay(opts);
			else await startDodo(opts);
		} catch (error) {
			errorMessage.value =
				error instanceof Error ? error.message : "Unable to start checkout.";
			statusMessage.value = "";
			loading.value = false;
		}
	}

	return { loading, statusMessage, errorMessage, startCheckout };
}
