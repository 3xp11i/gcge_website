import {
	serverSupabaseClient,
	serverSupabaseServiceRole,
} from "#supabase/server";

function slugToUuid(slug: string): string {
	return `${slug.slice(0, 8)}-${slug.slice(8, 12)}-${slug.slice(12, 16)}-${slug.slice(16, 20)}-${slug.slice(20)}`;
}

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "id") ?? "";

	if (!/^[0-9a-f]{32}$/i.test(slug)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid consultation ID.",
		});
	}

	const consultationId = slugToUuid(slug);
	const supabase = await serverSupabaseClient<Database>(event);
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.id) {
		throw createError({
			statusCode: 401,
			statusMessage: "Authentication required.",
		});
	}

	const [
		{ data: consultation, error: fcError },
		{ data: response, error: fcrError },
	] = await Promise.all([
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

	if (fcError)
		throw createError({ statusCode: 500, statusMessage: fcError.message });
	if (fcrError)
		throw createError({ statusCode: 500, statusMessage: fcrError.message });

	if (!consultation) {
		throw createError({
			statusCode: 404,
			statusMessage: "Consultation not found.",
		});
	}

	let authorProfile = null;
	if (response?.author) {
		const supabaseAdmin = serverSupabaseServiceRole<Database>(event);
		const { data: profile, error } = await supabaseAdmin
			.from("profiles")
			.select("first_name, last_name")
			.eq("user_id", response.author)
			.maybeSingle();

		authorProfile = profile;
		if (error) console.error("Error fetching author profile:", error.message);
	}
	// 	{
	//     "consultation": {
	//         "id": "fdb99a47-bad2-48da-ba4a-f689dec26056",
	//         "client_name": "Prakhar Tiwari",
	//         "message": "Some good questions here",
	//         "created_at": "2026-08-04T10:21:42.950218+00:00",
	//         "birth_location": "India",
	//         "birth_zipcode": "12345",
	//         "accuracy": "high",
	//         "category": "medical",
	//         "birth_time": "15:49:53",
	//         "birth_date": "2026-08-04",
	//         "profile_id": "9cd19458-6ad4-4f9a-9bc1-c53393ca4af2",
	//         "gender": "male"
	//     },
	//     "response": {
	//         "id": "400803eb-898f-48e9-b83b-9ff7b640395a",
	//         "created_at": "2026-08-04T10:38:27.4675+00:00",
	//         "consultation_id": "fdb99a47-bad2-48da-ba4a-f689dec26056",
	//         "author": "47f802ad-ce25-4985-a028-a0e9a13ca662",
	//         "response_text": "## Your personality\n- You have gained maturity earlier in life, often feeling like an older person than your age.\n- You love to eat and travel a lot; food is an essential part of your personality, and if your diet is disturbed, you aren't able to work well.\n- You will have to take responsibility for your siblings and their children; they will require your help, and you will have to help them, or either have guilt for not helping them at the right time.\n- You have natural leadership qualities and a helping nature. \n- There is sometimes a tendency to be aggressive or dominant in the way you communicate, which is usually controlled but sometimes comes out and sounds harsh.\n- Your words usually might hurt other people, or hit them like a red pill; even though they know you are right, they will feel bad. \n\n\n## Your Career & Wealth\n- Your career is of a very fluctuating nature, or involves a lot of travelling, and there is an involvement of guidance, consulting, and teaching in it\n- There will be breaks in your career and periods of no work.\n- You will accumulate a lot of wealth with time, with both your hard work and luck supporting you.\n- You tend to face problems from your co-workers\n\n\n## Romantic Life\n- You will get your partner through friends, relatives or the neighbourhood. Also possible through the internet.\n- You will have a love marriage\n- The partner will have a tendency to be isolated, alone and distanced, so it might create issues in the marriage and there will be a distance between you & her.\n\n![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBB4LQTn0vRq4ydPLp-uTj_lEUHOHYWUU18JlCq5KuMw&s=10)"
	//     },
	//     "authorProfile": null
	// }

	return { consultation, response, authorProfile };
});
