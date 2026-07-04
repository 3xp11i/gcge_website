type BirthDetailsPayload = {
	type?: string
	data?: {
		fullName?: string
		email?: string
		dateOfBirth?: string
		timeOfBirth?: string
		location?: string
		amountPaise?: number
		description?: string
		receipt?: string
	}
}

const formatAmount = (amountPaise?: number) => {
	if (typeof amountPaise !== "number" || Number.isNaN(amountPaise)) {
		return "N/A"
	}

	return `₹${(amountPaise / 100).toFixed(2)}`
}

const formatBirthDetailsMessage = (payload: BirthDetailsPayload) => {
	const details = payload.data ?? {}

	return [
		"🌌 New birth details submitted",
		`**Name:** ${details.fullName ?? "N/A"}`,
		`**Email:** ${details.email ?? "N/A"}`,
		`**Date of birth:** ${details.dateOfBirth ?? "N/A"}`,
		`**Time of birth:** ${details.timeOfBirth ?? "N/A"}`,
		`**Location:** ${details.location ?? "N/A"}`,
		`**Consultation:** ${details.description ?? "N/A"}`,
		`**Receipt:** ${details.receipt ?? "N/A"}`,
		`**Amount:** ${formatAmount(details.amountPaise)}`,
	].join("\n")
}

export async function sendToDiscord(message: string | BirthDetailsPayload) {
	try {
		const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

		if (!DISCORD_WEBHOOK_URL) {
			throw new Error("Discord webhook URL is not configured")
		}

		const content = typeof message === "string" ? message : formatBirthDetailsMessage(message)

		await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		})
	} catch (error) {
		throw new Error(`Failed to send Discord message: ${error}`)
	}
}