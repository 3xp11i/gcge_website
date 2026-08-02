import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const userS = await serverSupabaseUser(event);
    console.log("User from serverSupabaseUser: ", userS);

	const supabase = await serverSupabaseClient(event);
	const { data: { user } } = await supabase.auth.getUser();
	if (!user?.id) {
		throw createError({ statusCode: 401, statusMessage: "Authentication required." });
	}

	const body = await readBody(event);
	const { fullName, dateOfBirth, timeOfBirth, location, zipcode, accuracy, gender, message } = body;

	if (!fullName || !dateOfBirth || !timeOfBirth || !location || !zipcode || !accuracy || !gender) {
		throw createError({ statusCode: 400, statusMessage: "Missing required fields." });
	}

	const serviceSupabase = serverSupabaseServiceRole(event);

	// Use service role to bypass RLS for the count check (user already authenticated above)
	const { count, error: countError } = await serviceSupabase
		.from("free_consultations")
		.select("id", { count: "exact", head: true })
		.eq("profile_id", user.id);

	if (countError?.message) {
		throw createError({ statusCode: 500, statusMessage: `Failed to check submission limit: ${countError.message}` });
	}

	if ((count ?? 0) >= 2) {
		throw createError({
			statusCode: 403,
			statusMessage: "You have reached the maximum submission limit of 2 applications.",
		});
	}

	const { error } = await serviceSupabase.from("free_consultations").insert({
		profile_id: user.id,
		client_name: fullName,
		birth_date: dateOfBirth,
		birth_time: timeOfBirth,
		birth_location: location,
		birth_zipcode: zipcode,
		accuracy,
		gender,
		message: message || null,
		category: "medical",
	});

	if (error) {
		throw createError({ statusCode: 500, statusMessage: error.message });
	}

	return { success: true };
});
