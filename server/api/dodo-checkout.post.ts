import DodoPayments from 'dodopayments'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const {
		amountUsd,
		description,
		receipt,
		dodoProductId,
		customerName,
		customerEmail,
		metadata,
	} = body

	if (!amountUsd || !description || !customerEmail) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing required fields',
		})
	}

	try {
		// Initialize Dodo Payments client
		const apiKey = process.env.DODO_PAYMENTS_API_KEY
		const productId = dodoProductId
		const runtimeConfig = useRuntimeConfig(event)
		const dodoMode = String(runtimeConfig.public.dodoMode || 'test').toLowerCase()
		const environment = (dodoMode === 'live' || dodoMode === 'live_mode') ? 'live_mode' : 'test_mode'


		console.log("Dodo Payments API Key:", apiKey)
		console.log("Dodo Mode:", dodoMode)
		console.log("Dodo Environment:", environment)

		
		if (!apiKey) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Missing DODO_PAYMENTS_API_KEY',
			})
		}

		if (!productId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Missing dodoProductId',
			})
		}

		const client = new DodoPayments({
			bearerToken: apiKey,
			environment,
		});

		// Create a checkout session with birth details metadata
		const checkoutSession = await client.checkoutSessions.create({
			product_cart: [
				{
					product_id: productId,
					quantity: 1,
					amount: Math.round(Number(amountUsd) * 100),
				},
			],
			customer: {
				email: customerEmail,
				name: customerName,
			},
			billing_currency: 'USD',
			metadata: {
				receipt,
				description,
				amountUsd,
				...metadata,
			},
			return_url: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/consultation`,
		})

		return {
			checkout_url: checkoutSession.checkout_url,
			session_id: checkoutSession.session_id,
		}
	} catch (error) {
		console.error('Dodo Payments error:', error)
		throw createError({
			statusCode: 500,
			statusMessage: error instanceof Error ? error.message : 'Failed to create checkout session',
		})
	}
})
