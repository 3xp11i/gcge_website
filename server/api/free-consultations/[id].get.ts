import { serverSupabaseClient } from "#supabase/server";

function slugToUuid(slug: string): string {
	return `${slug.slice(0, 8)}-${slug.slice(8, 12)}-${slug.slice(12, 16)}-${slug.slice(16, 20)}-${slug.slice(20)}`;
}

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "id") ?? "";

	if (!/^[0-9a-f]{32}$/i.test(slug)) {
		throw createError({ statusCode: 400, statusMessage: "Invalid consultation ID." });
	}

	const consultationId = slugToUuid(slug);
	const supabase = await serverSupabaseClient<Database>(event);
	const { data: { user } } = await supabase.auth.getUser();

	if (!user?.id) {
		throw createError({ statusCode: 401, statusMessage: "Authentication required." });
	}

	const [{ data: consultation, error: fcError }, { data: response, error: fcrError }] =
		await Promise.all([
			supabase
				.from("free_consultations")
				.select("*")
				.eq("id", consultationId)
				.eq("profile_id", user.id)
				.maybeSingle(),
			supabase
				.from("free_consultation_responses")
				.select("*")
				.eq("consultation_id", consultationId)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle(),
		]);

	if (fcError) throw createError({ statusCode: 500, statusMessage: fcError.message });
	if (fcrError) throw createError({ statusCode: 500, statusMessage: fcrError.message });

	if (!consultation) {
		throw createError({ statusCode: 404, statusMessage: "Consultation not found." });
	}

	let authorProfile = null;
	if (response?.author) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("first_name, last_name")
			.eq("user_id", response.author)
			.maybeSingle();
		authorProfile = profile;
	}

	return { consultation, response, authorProfile };
});
