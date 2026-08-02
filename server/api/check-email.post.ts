import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email?: string }>(event)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }

  return { exists: data !== null }
})
