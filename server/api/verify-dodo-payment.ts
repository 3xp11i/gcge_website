import { Webhook } from 'standardwebhooks'
import { sendToDiscord } from '../utils/discordNotifier'

export default defineEventHandler(async (event) => {
  // Use raw body for signature verification
  const rawBody = (await readRawBody(event, 'utf8')) || ''
  const headers = getRequestHeaders(event)

  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY
  if (!webhookKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing DODO_PAYMENTS_WEBHOOK_KEY',
    })
  }

  const webhook = new Webhook(webhookKey)

  try {
    // Verify the signature (Standard Webhooks spec per Dodo docs)
    await webhook.verify(rawBody, {
      'webhook-id': headers['webhook-id'] as string,
      'webhook-signature': headers['webhook-signature'] as string,
      'webhook-timestamp': headers['webhook-timestamp'] as string,
    })

    // Parse the verified payload
    const payload = JSON.parse(rawBody)
    const evtType: string | undefined = (payload?.event_type || payload?.type) as string | undefined
    const data = payload?.data ?? payload

    if (evtType === 'payment.succeeded') {
      const md = (data?.metadata ?? payload?.metadata ?? {}) as Record<string, any>

      await sendToDiscord({
				type: "birth-details",
				data: {
					fullName: md.fullName,
					email: md.email,
					dateOfBirth: md.dateOfBirth,
					timeOfBirth: md.timeOfBirth,
					location: md.location,
					consultationMethod: md.consultationMethod,
					instagramUsername: md.instagramUsername,
					needsBtr: md.needsBtr,
					// If you charge INR and receive minor units, map to amountPaise here:
					amountPaise: md?.amountUsd ?? undefined,
					description: md.description,
					receipt: md.receipt,
				},
				paymentProvider: "dodo",
			});
    }

    // Acknowledge receipt
    return { received: true }
  } catch (err) {
    console.error('Dodo webhook verification failed:', err)
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }
})
