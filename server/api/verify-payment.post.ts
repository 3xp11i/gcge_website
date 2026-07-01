type VerifyPaymentBody = {
	order_id?: string
	payment_id?: string
	signature?: string
	razorpay_order_id?: string
	razorpay_payment_id?: string
	razorpay_signature?: string
}

function toHex(bytes: Uint8Array) {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function timingSafeEqualStrings(expected: string, actual: string) {
	if (expected.length !== actual.length) {
		return false
	}

	let result = 0

	for (let index = 0; index < expected.length; index += 1) {
		result |= expected.charCodeAt(index) ^ actual.charCodeAt(index)
	}

	return result === 0
}

export default defineEventHandler(async (event) => {
	const body = await readBody<VerifyPaymentBody>(event)
	const orderId = body.order_id ?? body.razorpay_order_id
	const paymentId = body.payment_id ?? body.razorpay_payment_id
	const signature = body.signature ?? body.razorpay_signature

	if (!orderId || !paymentId || !signature) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing payment verification fields.",
		})
	}

	const runtimeConfig = useRuntimeConfig(event)
	const keySecret = runtimeConfig.razorpayKeySecret

	if (!keySecret) {
		throw createError({
			statusCode: 500,
			statusMessage: "Razorpay credentials are not configured.",
		})
	}

	const payload = new TextEncoder().encode(`${orderId}|${paymentId}`)
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(keySecret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	)
	const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, payload)
	const expectedSignature = toHex(new Uint8Array(signatureBuffer))
	const receivedSignature = signature.trim().toLowerCase()

	if (!timingSafeEqualStrings(expectedSignature, receivedSignature)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid payment signature.",
		})
	}

	return {
		success: true,
	}
})