// import razorpay from "razorpay";


type CreateOrderBody = {
	amount?: number | string;
	currency?: string;
	receipt?: string;
};

type RazorpayOrderResponse = {
	id: string;
	amount: number;
	currency: string;
};

function toBase64(value: string) {
	const bytes = new TextEncoder().encode(value);
	let binary = "";

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

export default defineEventHandler(async (event) => {
	const body = await readBody<CreateOrderBody>(event);
	const amount = Number(body?.amount);
	const currency =
		typeof body?.currency === "string" && body.currency.trim()
			? body.currency.trim().toUpperCase()
			: "INR";
	const receipt =
		typeof body?.receipt === "string" && body.receipt.trim()
			? body.receipt.trim().slice(0, 40)
			: `receipt_${Date.now()}`;

	if (!Number.isInteger(amount) || amount < 100) {
		throw createError({
			statusCode: 400,
			statusMessage: "Amount must be at least 100 paise.",
		});
	}

	const runtimeConfig = useRuntimeConfig(event);
	const keyId = runtimeConfig.razorpayKeyId;
	const keySecret = runtimeConfig.razorpayKeySecret;

	// console.log("Razorpay Key ID:", keyId);
	// console.log("Razorpay Key Secret:", keySecret);

	if (!keyId || !keySecret) {
		throw createError({
			statusCode: 500,
			statusMessage: "Razorpay credentials are not configured.",
		});
	}
	// let instance = new razorpay({
	// 	key_id: "YOUR_KEY_ID",
	// 	key_secret: "YOUR_SECRET",
	// });

	// let data = {
	// 	amount: 50000,
	// 	currency: "INR",
	// 	receipt: "receipt#1",
	// 	line_items_total: 50000, // Mandatory for Magic Checkout
	// 	line_items: [
	// 		{
	// 			sku: "1g234",
	// 			variant_id: "12r34",
	// 			price: 50000,
	// 			offer_price: 50000,
	// 			quantity: 1,
	// 			name: "Product Name",
	// 			// ... other line item details
	// 		},
	// 	],
	// };

	// instance.orders.create(data);


	const authorization = toBase64(`${keyId}:${keySecret}`);
	const response = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			Authorization: `Basic ${authorization}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount,
			currency,
			receipt,
			// line_items_total: 1,
			// line_items: [
			// 	{
			// 		line_items: [
			// 			{
			// 				sku: "1g234",
			// 				variant_id: "12r34",
			// 				price: amount,
			// 				offer_price: amount - 100,
			// 				quantity: 1,
			// 				name: "Product Name",
			// 				description: "...",
			// 			},
			// 		],
			// 	},
			// ],
		}),
	});

	if (response.status === 401) {
		const errorBody = await response.json().catch(() => null);
		throw createError({
			statusCode: 401,
			statusMessage:
				errorBody?.error?.description ?? "Razorpay authentication failed.",
		});
	}

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw createError({
			statusCode: 500,
			statusMessage:
				errorBody?.error?.description ?? "Unable to create Razorpay order.",
		});
	}

	const order = (await response.json()) as RazorpayOrderResponse;

	return {
		order_id: order.id,
		amount: order.amount,
		currency: order.currency,
	};
});
