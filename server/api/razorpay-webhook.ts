import Razorpay from "razorpay";
import { serverSupabaseServiceRole } from "#supabase/server";

interface RazorpayWebhookPayload {
	entity: "event";
	account_id: string;
	event: string;
	contains: string[];
	payload: {
		payment: {
			entity: {
				id: string;
				order_id: string;
				amount: number;
				currency: string;
				status: string;
				method: string;
				email: string;
				contact: string;
				notes: Record<string, string>;
				created_at: number;
			};
		};
	};
	created_at: number;
}

export default defineEventHandler(async (event) => {
	console.log("[razorpay-webhook] received request");
	const rawBody = await readRawBody(event, "utf-8");
	const signature = getHeader(event, "x-razorpay-signature");
	const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

	if (!rawBody || !signature || !secret) {
		console.error("[razorpay-webhook] missing rawBody/signature/secret", {
			rawBody: !!rawBody,
			signature: !!signature,
			secret: !!secret,
		});
		throw createError({
			statusCode: 400,
			statusMessage: "Missing webhook data",
		});
	}

	try {
		console.log("[razorpay-webhook] validating signature");
		const isValid = Razorpay.validateWebhookSignature(
			rawBody,
			signature,
			secret,
		);
		if (!isValid) {
			console.error("[razorpay-webhook] signature validation failed");
			throw new Error("Signature mismatch");
		}
		console.log("[razorpay-webhook] signature valid");
	} catch (err) {
		console.error("[razorpay-webhook] signature validation error", err);
		throw createError({ statusCode: 400, statusMessage: "Invalid signature" });
	}

	const body = JSON.parse(rawBody) as RazorpayWebhookPayload;

	console.log("[razorpay-webhook] parsed event", { event: body.event });
	if (body.event !== "order.paid") {
		console.log("[razorpay-webhook] ignoring non-captured event", body.event);
		return { status: "ignored", event: body.event };
	}

	const payment = body.payload.payment.entity;
	console.log("[razorpay-webhook] payment received", {
		id: payment.id,
		order_id: payment.order_id,
		amount: payment.amount,
		currency: payment.currency,
		status: payment.status,
		method: payment.method,
	});
	const notes = payment.notes ?? {};
	console.log("[razorpay-webhook] payment notes", notes);

	if (Object.keys(notes).length === 0) {
		console.error("[razorpay-webhook] missing notes in payment", {
			paymentId: payment.id,
		});
		throw createError({
			statusCode: 400,
			statusMessage: "Missing notes in payment",
		});
	}

	const orderType = notes.orderType || "consultation";
	const supabase = serverSupabaseServiceRole(event);

	if (orderType === "course") {
		console.log("[razorpay-webhook] processing course purchase");

		const { error } = await supabase.from("course_purchases").insert({
			first_name: notes.firstName || "",
			last_name: notes.lastName || "",
			email: notes.email || payment.email || "",
			experience: notes.experience || "",
			payment_id: payment.id,
			payment_provider: "razorpay",
		});

		if (error) {
			console.error(
				"[razorpay-webhook] failed to insert into course_purchases",
				error,
			);
		} else {
			console.log("[razorpay-webhook] inserted into course_purchases", {
				paymentId: payment.id,
			});
		}

		try {
			await sendCoursePurchaseToDiscord(
				{
					firstName: notes.firstName || "",
					lastName: notes.lastName || "",
					email: notes.email || payment.email || "",
					experience: notes.experience || "",
					courseTitle: notes.courseTitle || notes.description || "",
					amountPaise: payment.amount,
					receipt: notes.receipt || "",
				},
				payment.id,
			);
			console.log("[razorpay-webhook] sent course purchase to Discord", {
				paymentId: payment.id,
			});
		} catch (err) {
			console.error(
				"[razorpay-webhook] failed to send course purchase to Discord",
				err,
			);
		}

		return { status: "success" };
	}

	// --- Consultation flow (unchanged) ---
	console.log("[razorpay-webhook] processing consultation");

	const { error } = await supabase.from("consultations").insert({
		client_name: notes.fullName || "",
		email: notes.email || payment.email || "",
		phone: notes.phone || payment.contact || "",
		location: notes.location || "",
		zipcode: notes.zipcode || "",
		consultationMethod: notes.consultationMethod || "email",
		instagramUsername: notes.instagramUsername || "",
		needsBtr: notes.needsBtr === "true" || notes.needsBtr === true,
		message: notes.message || null,
		payment_id: payment.id,
		payment_provider: "razorpay",
		payment_status: payment.status,
		package: notes.description || "consultation",
	});
	if (error) {
		console.error(
			"[razorpay-webhook] failed to insert into consultations",
			error,
		);
	} else {
		console.log("[razorpay-webhook] inserted into consultations", {
			paymentId: payment.id,
		});
	}

	try {
		await sendBirthDetailsToDiscord(
			{
				fullName: notes.fullName || "",
				email: notes.email || payment.email || "",
				phone: notes.phone || payment.contact || "",
				dateOfBirth: notes.dateOfBirth || null,
				timeOfBirth: notes.timeOfBirth || null,
				location: notes.location || "",
				zipcode: notes.zipcode || "",
				consultationMethod: notes.consultationMethod || "email",
				instagramUsername: notes.instagramUsername || "",
				needsBtr: notes.needsBtr === "true" || notes.needsBtr === true,
				message: notes.message || "",
				amountPaise: payment.amount,
				description: notes.description || "",
				receipt: notes.receipt || "",
			},
			payment.id,
		);
		console.log("[razorpay-webhook] sent birth details to Discord", {
			paymentId: payment.id,
		});
	} catch (err) {
		console.error(
			"[razorpay-webhook] failed to send birth details to Discord",
			err,
		);
	}

	return { status: "success" };
});

const sendBirthDetailsToDiscord = async (details: any, paymentId: string) => {
	await $fetch("/api/discord", {
		method: "POST",
		body: {
			type: "birth-details",
			data: { ...details, paymentId },
			paymentProvider: "razorpay",
		},
	});
};

const sendCoursePurchaseToDiscord = async (details: any, paymentId: string) => {
	await $fetch("/api/discord", {
		method: "POST",
		body: {
			type: "course-purchase",
			data: { ...details, paymentId },
			paymentProvider: "razorpay",
		},
	});
};
