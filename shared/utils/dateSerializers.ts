import type { CalendarDate, Time } from "@internationalized/date";

/**
 * Serializes a CalendarDate to ISO string format (YYYY-MM-DD)
 * @param date CalendarDate object or string
 * @returns ISO date string or null
 */
export const serializeCalendarDate = (date: CalendarDate | string | unknown): string | null => {
	if (!date) return null;

	// If already a string, return it
	if (typeof date === "string") return date;

	// If it's a CalendarDate object
	if (date && typeof date === "object" && "year" in date && "month" in date && "day" in date) {
		const d = date as CalendarDate;
		const year = String(d.year).padStart(4, "0");
		const month = String(d.month).padStart(2, "0");
		const day = String(d.day).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	return null;
};

/**
 * Serializes a Time to HH:mm:ss format
 * @param time Time object or string
 * @returns Time string or null
 */
export const serializeTime = (time: Time | string | unknown): string | null => {
	if (!time) return null;

	// If already a string, return it
	if (typeof time === "string") return time;

	// If it's a Time object
	if (time && typeof time === "object" && "hour" in time && "minute" in time) {
		const t = time as Time;
		const hour = String(t.hour).padStart(2, "0");
		const minute = String(t.minute).padStart(2, "0");
		const second = "second" in t ? String(t.second).padStart(2, "0") : "00";
		return `${hour}:${minute}:${second}`;
	}

	return null;
};

/**
 * Serializes birth details for API transmission
 * Converts CalendarDate and Time objects to readable strings
 */
export const serializeBirthDetailsForAPI = (details: any) => {
	return {
		...details,
		dateOfBirth: serializeCalendarDate(details?.dateOfBirth),
		timeOfBirth: serializeTime(details?.timeOfBirth),
	};
};
