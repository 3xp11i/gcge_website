export type DiscordField = {
	label: string;
	value: string | number | boolean | null | undefined;
};

export type DiscordPayload = {
	title: string;
	fields: DiscordField[];
	provider: "dodo" | "razorpay";
};

const formatValue = (value: DiscordField["value"]): string => {
	if (value === null || value === undefined || value === "") return "N/A";
	if (typeof value === "boolean") return value ? "Yes" : "No";
	return String(value);
};

const formatPayload = (payload: DiscordPayload): string => {
	return [
		payload.title,
		...payload.fields.map((f) => `**${f.label}:** ${formatValue(f.value)}`),
	].join("\n");
};

export async function sendToDiscord(message: string | DiscordPayload) {
	try {
		const provider =
			typeof message === "string" ? "dodo" : message.provider;

		const DISCORD_WEBHOOK_URL =
			process.env[
				provider === "razorpay"
					? "RAZORPAY_DISCORD_WEBHOOK_URL"
					: "DODO_DISCORD_WEBHOOK_URL"
			];

		if (!DISCORD_WEBHOOK_URL) {
			throw new Error("Discord webhook URL is not configured");
		}

		const content =
			typeof message === "string" ? message : formatPayload(message);

		await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		});
	} catch (error) {
		throw new Error(`Failed to send Discord message: ${error}`);
	}
}
