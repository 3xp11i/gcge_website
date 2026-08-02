import Razorpay from "razorpay";
import { serverSupabaseServiceRole } from "#supabase/server";
import { sendToDiscord } from "../../utils/discordNotifier";

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
			await sendToDiscord({
				title: "🎓 New course purchase",
				fields: [
					{ label: "Name", value: [notes.firstName, notes.lastName].filter(Boolean).join(" ") || "" },
					{ label: "Email", value: notes.email || payment.email },
					{ label: "Experience level", value: notes.experience },
					{ label: "Course", value: notes.courseTitle || notes.description },
					{ label: "Amount", value: `₹${(payment.amount / 100).toFixed(2)}` },
					{ label: "Payment ID", value: payment.id },
				],
				provider: "razorpay",
			});
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
	} // --- Consultation flow (unchanged) ---
	console.log("[razorpay-webhook] processing consultation");

	const { data: consultationData, error } = await supabase
		.from("consultations")
		.insert({
			client_name: notes.fullName || "",
			email: notes.email || payment.email || "",
			phone: notes.phone || payment.contact || "",
			birth_location: notes.location || "",
			birth_zipcode: notes.zipcode || "",
			birth_time: notes.timeOfBirth || "",
			birth_date: notes.dateOfBirth || "",
			consultationMethod: notes.consultationMethod || "email",
			instagramUsername: notes.instagramUsername || "",
			accuracy: notes.accuracy || "medium",
			message: notes.message || null,
			package: notes.description || "consultation",
		})
		.select("id")
		.single();

	
	if (error) {
		console.error(
			"[razorpay-webhook] failed to insert into consultations",
			error,
		);
	} else {
		console.log("[razorpay-webhook] inserted into consultations", {
			paymentId: payment.id,
			consultationId: consultationData.id,
		});
	}

	if (
		consultationData?.id &&
		notes.serviceTypeId &&
		notes.slotStart &&
		notes.slotEnd
	) {
		const { error: bookingError } = await supabase.from("bookings").insert({
			consultation_id: consultationData.id,
			service_type_id: notes.serviceTypeId,
			starts_at: notes.slotStart,
			ends_at: notes.slotEnd,
			status: "booked",
			hold_expires_at: null,
		});
		if (bookingError) {
			console.error(
				"[razorpay-webhook] failed to insert into bookings",
				bookingError,
			);
		} else {
			console.log("[razorpay-webhook] inserted into bookings", {
				consultationId: consultationData.id,
			});
		}
	}

	// --- Fetch service type name for Discord notification ---
	let serviceTypeName = notes.description || "";
	if (notes.serviceTypeId) {
		const { data: serviceTypeData, error: serviceTypeError } = await supabase
			.from("service_types")
			.select("name")
			.eq("id", notes.serviceTypeId)
			.single();

		if (serviceTypeError) {
			console.error(
				"[razorpay-webhook] failed to fetch service type name",
				serviceTypeError,
			);
		} else if (serviceTypeData?.name) {
			serviceTypeName = serviceTypeData.name;
		}
	}


	
	const { data: paymentData, error: paymentError } = await supabase
		.from("payments_logs")
		.insert({
			product_type: orderType,
			product_name: serviceTypeName,
			currency: payment.currency,
			amount: payment.amount,
			payment_id: payment.id,
			provider: "razorpay",
			status: payment.status,
		});

	try {
		await sendToDiscord({
			title: "🌌 New consultation purchase",
			fields: [
				{ label: "Name", value: notes.fullName },
				{ label: "Email", value: notes.email || payment.email },
				{ label: "Phone", value: notes.phone || payment.contact },
				{ label: "Date of birth", value: notes.dateOfBirth },
				{ label: "Time of birth", value: notes.timeOfBirth },
				{ label: "Location", value: notes.location },
				{ label: "Zipcode", value: notes.zipcode },
				{ label: "Consultation preference", value: notes.consultationMethod },
				{ label: "Instagram username", value: notes.instagramUsername },
				{ label: "BTR required", value: notes.accuracy },
				{ label: "Consultation notes", value: notes.message },
				{ label: "Service", value: serviceTypeName },
				{ label: "Amount", value: `₹${(payment.amount / 100).toFixed(2)}` },
				{ label: "Payment ID", value: payment.id },
			],
			provider: "razorpay",
		});
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


