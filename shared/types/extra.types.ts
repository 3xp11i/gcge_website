export interface ExistingBooking {
	starts_at: string; // ISO timestamp string, as returned by Supabase, e.g. "2026-08-03T10:00:00+00:00"
	ends_at: string;
}

export interface Candidate {
	start: Date;
	end: Date;
}

export interface DayAvailability {
	date: string; // "2026-08-03"
	windows: { start: string; end: string }[]; // ISO UTC strings
	bookings: ExistingBooking[];
}