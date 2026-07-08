import { sendToDiscord } from '../utils/discordNotifier'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	console.log("Sending details to discord: ", body)
	await sendToDiscord(body)
})