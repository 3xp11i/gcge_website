export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	await sendToDiscord(body)
})