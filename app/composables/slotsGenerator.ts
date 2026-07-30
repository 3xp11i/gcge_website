import type { ExistingBooking, Candidate } from "~/shared/types/extra.types";

export const useSlotsGenerator = (
	windowStart: Date, // e.g. new Date('2026-08-03T09:00:00+05:30')
	windowEnd: Date, // e.g. new Date('2026-08-03T12:00:00+05:30')
	duration: number, // minutes, e.g. 30
	existingBookings: ExistingBooking[],
): Candidate[] => {

	const addMinutes = (date: Date, minutes: number): Date => {
		return new Date(date.getTime() + minutes * 60000);
	}

	const BUFFER_MINUTES = 10;
	const STEP_MINUTES = 15;

	const candidates: Candidate[] = [];
	let cursor: Date = new Date(windowStart); // clone, don't mutate the original

	while (addMinutes(cursor, duration).getTime() <= windowEnd.getTime()) {
		const candidateStart: Date = cursor;
		const candidateEnd: Date = addMinutes(cursor, duration);

		const blocked: boolean = existingBookings.some((b: ExistingBooking) => {
			const paddedStart: Date = addMinutes(
				new Date(b.starts_at),
				-BUFFER_MINUTES,
			);
			const paddedEnd: Date = addMinutes(new Date(b.ends_at), BUFFER_MINUTES);
			return (
				candidateStart.getTime() < paddedEnd.getTime() &&
				candidateEnd.getTime() > paddedStart.getTime()
			);
		});

		if (!blocked) {
			candidates.push({ start: candidateStart, end: candidateEnd });
		}

		cursor = addMinutes(cursor, STEP_MINUTES);
	}

	return candidates;

};
