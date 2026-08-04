import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const supabase = await serverSupabaseClient<Database>(event);
	const serverUser = await serverSupabaseUser(event);

	if (!serverUser) {
		throw createError({
			statusCode: 401,
			statusMessage: "Authentication required.",
		});
	}

	const { data, error } = await supabase
		.from("free_consultations")
		.select(
			"id, client_name, category, created_at, free_consultation_responses(id)",
		)
		.eq("profile_id", serverUser.sub)
		.order("created_at", { ascending: false });

		
	

	if (error) {
		throw createError({ statusCode: 500, statusMessage: error.message });
	}

	return data;
});
