// types/dodo-webhook.ts

export type DodoOrderType = "course" | "consultation";

/** Custom metadata you attach when creating the payment/checkout session */
export interface DodoWebhookMetadata {
	orderType?: DodoOrderType;

	// Shared
	email?: string;
	description?: string;
	amountUsd?: string;
	receipt?: string;

	// Course purchase fields
	firstName?: string;
	lastName?: string;
	experience?: string;
	courseTitle?: string;

	// Consultation fields
	fullName?: string;
	phone?: string;
	location?: string;
	zipcode?: string;
	timeOfBirth?: string;
	dateOfBirth?: string;
	consultationMethod?: string;
	instagramUsername?: string;
	accuracy?: string;
	message?: string;
	needsBtr?: boolean;

	// Booking fields
	serviceTypeId?: string;
	slotStart?: string;
	slotEnd?: string;
}

export interface DodoCustomer {
	customer_id?: string;
	name?: string;
	email?: string;
}

/** The `data` object inside a Dodo webhook payload */
export interface DodoWebhookData {
	payment_id?: string;
	status?: string;
	metadata?: DodoWebhookMetadata;
	customer?: DodoCustomer;
	currency?: string;
	amount?: number;
	[key: string]: unknown; // Dodo may send other fields you don't use yet
}

/** Top-level webhook payload from Dodo Payments */
export interface DodoWebhookPayload {
	event_type?: string;
	type?: string;
	data?: DodoWebhookData;
	metadata?: DodoWebhookMetadata; // fallback location seen in some events
	payment_id?: string;
	status?: string;
	currency?: string;
	amount?: number;
	[key: string]: unknown;
}
