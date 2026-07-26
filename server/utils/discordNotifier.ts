type BirthDetailsPayload = {
	type?: "birth-details";
	data?: {
		fullName?: string;
		email?: string;
		phone?: string;
		dateOfBirth?: string | null; // Now serialized as YYYY-MM-DD
		timeOfBirth?: string | null; // Now serialized as HH:mm:ss
		location?: string;
		zipcode?: string;
		consultationMethod?: string;
		instagramUsername?: string;
		needsBtr?: boolean;
		message?: string;
		amountPaise?: number;
		amountUsd?: number;
		description?: string;
		receipt?: string;
		paymentId?: string;
	};
	paymentProvider: "dodo" | "razorpay";
};

type CoursePurchasePayload = {
	type: "course-purchase";
	data?: {
		firstName?: string;
		lastName?: string;
		email?: string;
		experience?: string;
		courseTitle?: string;
		amountPaise?: number;
		amountUsd?: number;
		receipt?: string;
		paymentId?: string;
	};
	paymentProvider: "dodo" | "razorpay";
};

type DiscordPayload = BirthDetailsPayload | CoursePurchasePayload;

const formatAmount = (payload: {
	amountPaise?: number;
	amountUsd?: number;
}) => {
	if (
		typeof payload.amountPaise === "number" &&
		!Number.isNaN(payload.amountPaise)
	) {
		return `₹${(payload.amountPaise / 100).toFixed(2)}`;
	}
	if (
		typeof payload.amountUsd === "number" &&
		!Number.isNaN(payload.amountUsd)
	) {
		return `$${payload.amountUsd.toFixed(2)}`;
	}
	return "N/A";
};

const formatBirthDetailsMessage = (payload: BirthDetailsPayload) => {
	const details = payload.data ?? {};

	const dateOfBirthFormatted = details.dateOfBirth
		? `${details.dateOfBirth}`
		: "N/A";
	const timeOfBirthFormatted = details.timeOfBirth
		? `${details.timeOfBirth}`
		: "N/A";

	return [
		"🌌 New birth details submitted",
		`**Name:** ${details.fullName ?? "N/A"}`,
		`**Email:** ${details.email ?? "N/A"}`,
		`**Phone:** ${details.phone ?? "N/A"}`,
		`**Date of birth:** ${dateOfBirthFormatted}`,
		`**Time of birth:** ${timeOfBirthFormatted}`,
		`**Location:** ${details.location ?? "N/A"}`,
		`**Zipcode:** ${details.zipcode ?? "N/A"}`,
		`**Consultation preference:** ${details.consultationMethod ?? "N/A"}`,
		`**Instagram username:** ${details.instagramUsername ?? "N/A"}`,
		`**BTR required:** ${details.needsBtr ? "Yes" : "No"}`,
		`**Consultation notes:** ${details.message ?? "N/A"}`,
		`**Receipt:** ${details.receipt ?? "N/A"}`,
		`**Amount:** ${formatAmount(details)}`,
	].join("\n");
};

const formatCoursePurchaseMessage = (payload: CoursePurchasePayload) => {
	const details = payload.data ?? {};

	return [
		"🎓 New course purchase",
		`**Name:** ${[details.firstName, details.lastName].filter(Boolean).join(" ") || "N/A"}`,
		`**Email:** ${details.email ?? "N/A"}`,
		`**Experience level:** ${details.experience ?? "N/A"}`,
		`**Course:** ${details.courseTitle ?? "N/A"}`,
		`**Receipt:** ${details.receipt ?? "N/A"}`,
		`**Amount:** ${formatAmount(details)}`,
		`**Payment ID:** ${details.paymentId ?? "N/A"}`,
	].join("\n");
};

const formatMessage = (payload: DiscordPayload) => {
	if (payload.type === "course-purchase") {
		return formatCoursePurchaseMessage(payload);
	}
	return formatBirthDetailsMessage(payload);
};

export async function sendToDiscord(message: string | DiscordPayload) {
	try {
		const DISCORD_WEBHOOK_URL =
			process.env[
				typeof message === "string"
					? "DODO_DISCORD_WEBHOOK_URL"
					: message.paymentProvider === "dodo"
						? "DODO_DISCORD_WEBHOOK_URL"
						: "RAZORPAY_DISCORD_WEBHOOK_URL"
			];

		if (!DISCORD_WEBHOOK_URL) {
			throw new Error("Discord webhook URL is not configured");
		}

		const content =
			typeof message === "string" ? message : formatMessage(message);

		await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		});
	} catch (error) {
		throw new Error(`Failed to send Discord message: ${error}`);
	}
}
