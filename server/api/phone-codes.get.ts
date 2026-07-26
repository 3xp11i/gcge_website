import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async () => {
	const filePath = resolve(process.cwd(), 'server', 'api', 'phone-codes.json')
	const raw = await readFile(filePath, 'utf-8')
	return JSON.parse(raw)
})