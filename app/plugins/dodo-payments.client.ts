import { DodoPayments } from "dodopayments-checkout";

export default defineNuxtPlugin(() => {
	if (import.meta.server) return;

	DodoPayments.Initialize({
		mode: (import.meta.env.NUXT_PUBLIC_DODO_MODE as "test" | "live") || "test",
		displayType: "overlay", // default is overlay, this is explicit
		onEvent: (event) => {
			// Optional: handle useful overlay lifecycle + outcomes
			switch (event.event_type) {
				case "checkout.opened":
					console.debug("Dodo overlay opened");
					break;
				case "checkout.closed":
					console.debug("Dodo overlay closed");
					break;
				case "checkout.error":
					console.error("Dodo overlay error:", event.data?.message);
					break;
			}
		},
	});
});
