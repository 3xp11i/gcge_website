import { sendToDiscord } from '../../utils/discordNotifier'
import type { DiscordPayload } from '../../utils/discordNotifier'

export default defineEventHandler(async (event) => {
	const body = await readBody<DiscordPayload | string>(event)
	await sendToDiscord(body)
})