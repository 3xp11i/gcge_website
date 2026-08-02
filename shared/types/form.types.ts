import type { Time, CalendarDate } from "@internationalized/date";
import type { ShallowRef } from "vue";


export type BirthDetails = {
	fullName: string;
	email: string;
	phone: string;
	dateOfBirth: ShallowRef<CalendarDate>;
	timeOfBirth: ShallowRef<Time>;
	location: string;
	zipcode: string;
	consultationMethod:
		| "googleMeet"
		| "email"
		| "instagram";
	instagramUsername: string;
	accuracy: "high" | "medium" | "low";
	message: string;
	slotStart?: string; // ISO string
	slotEnd?: string;   // ISO string
};

/**
 * Serialized version of BirthDetails for API transmission
 * dateOfBirth and timeOfBirth are converted to readable string formats
 */
export type SerializedBirthDetails = {
	fullName: string;
	email: string;
	phone: string;
	dateOfBirth: string | null; // YYYY-MM-DD format
	timeOfBirth: string | null; // HH:mm:ss format
	location: string;
	zipcode: string;
	consultationMethod:
		| "googleMeet"
		| "email"
		| "instagram";
	instagramUsername: string;
	accuracy: "high" | "medium" | "low";
	message: string;
};

export type StudentDetails = {
	firstName: string;
	lastName: string;
	email: string;
	experience: "beginner" | "intermediate" | "advanced" | "";
};

