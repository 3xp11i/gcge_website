import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { starts_at, ends_at } = body ?? {};

	if (!starts_at || !ends_at) {
		throw createError({ statusCode: 400, statusMessage: "starts_at and ends_at are required" });
	}

	const supabase = await serverSupabaseClient(event);

	const slotDate = starts_at.slice(0, 10);

	// 1. Verify the slot falls within an open window for that date
	const { data: windowRows, error: windowError } = await supabase
		.from("daily_open_windows")
		.select("start_time, end_time")
		.eq("date", slotDate);

	if (windowError) {
		throw createError({ statusCode: 500, statusMessage: windowError.message });
	}

	const slotStart = new Date(starts_at);
	const slotEnd = new Date(ends_at);

	const withinWindow = (windowRows ?? []).some((w) => {
		const winStart = new Date(`${slotDate}T${w.start_time}+05:30`);
		const winEnd = new Date(`${slotDate}T${w.end_time}+05:30`);
		return slotStart >= winStart && slotEnd <= winEnd;
	});

	if (!withinWindow) {
		return { available: false };
	}

	// 2. Check for conflicting bookings overlapping the slot
	const { data, error } = await supabase
		.from("bookings")
		.select("status, hold_expires_at")
		.lt("starts_at", ends_at)
		.gt("ends_at", starts_at)
		.in("status", ["pending", "booked"]);

	if (error) {
		throw createError({ statusCode: 500, statusMessage: error.message });
	}

	const conflicts = (data ?? []).filter(
		(b) =>
			b.status === "booked" ||
			(b.status === "pending" && b.hold_expires_at && new Date(b.hold_expires_at) > new Date()),
	);

	return { available: conflicts.length === 0 };
});
