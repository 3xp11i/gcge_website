import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const supabase = await serverSupabaseClient(event);

	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);

	// Accept explicit fromDate/toDate, or fall back to days-from-today
	const fromDate = (typeof query.fromDate === 'string' && query.fromDate) ? query.fromDate : todayStr;
	const days = Number(query.days) || 30;
	const toDate = (typeof query.toDate === 'string' && query.toDate)
		? query.toDate
		: new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10);

	// Never fetch before today
	const effectiveFromDate = fromDate < todayStr ? todayStr : fromDate;

	// 1. Fetch open windows for the date range from the view
	const { data: windowRows, error: windowError } = await supabase
		.from("daily_open_windows")
		.select("date, start_time, end_time")
		.gte("date", effectiveFromDate)
		.lte("date", toDate);

	if (windowError) {
		throw createError({ statusCode: 500, statusMessage: windowError.message });
	}

	// 2. Fetch existing bookings that fall in this range (pending w/ active hold, or booked)
	const { data: bookingRows, error: bookingError } = await supabase
		.from("bookings")
		.select("starts_at, ends_at, status, hold_expires_at")
		.gte("starts_at", `${effectiveFromDate}T00:00:00+00:00`)
		.lte("starts_at", `${toDate}T23:59:59+00:00`);

	if (bookingError) {
		throw createError({ statusCode: 500, statusMessage: bookingError.message });
	}

	const activeBookings = (bookingRows ?? []).filter(
		(b) =>
			b.status === "booked" ||
			(b.status === "pending" &&
				b.hold_expires_at &&
				new Date(b.hold_expires_at) > new Date()),
	);

	// 3. Group windows by date, converting local IST time -> UTC ISO strings
	const byDate = new Map<string, { start: string; end: string }[]>();

	for (const row of windowRows ?? []) {
		const startUtc = new Date(
			`${row.date}T${row.start_time}+05:30`,
		).toISOString();
		const endUtc = new Date(`${row.date}T${row.end_time}+05:30`).toISOString();

		if (!byDate.has(row.date)) byDate.set(row.date, []);
		byDate.get(row.date)!.push({ start: startUtc, end: endUtc });
	}

	// 4. Attach only the bookings relevant to each date (by UTC day-window overlap)
	const result = Array.from(byDate.entries()).map(([date, windows]) => {
		const dayBookings = activeBookings
			.filter((b) => {
				return windows.some(
					(w) =>
						new Date(b.starts_at) < new Date(w.end) &&
						new Date(b.ends_at) > new Date(w.start),
				);
			})
			.map((b) => ({ starts_at: b.starts_at, ends_at: b.ends_at }));

		return { date, windows, bookings: dayBookings };
	});

	return result;
});