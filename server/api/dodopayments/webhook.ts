import { Webhook } from "standardwebhooks";
import { serverSupabaseServiceRole } from "#supabase/server";
import { sendToDiscord } from "#imports";


export default defineEventHandler(async (event) => {
	const rawBody = (await readRawBody(event, "utf8")) || "";
	const headers = getRequestHeaders(event);

	const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

	if (!webhookKey) {
		throw createError({
			statusCode: 500,
			statusMessage: "Missing DODO_PAYMENTS_WEBHOOK_KEY",
		});
	}

	const webhook = new Webhook(webhookKey);

	try {
		await webhook.verify(rawBody, {
			"webhook-id": headers["webhook-id"] as string,
			"webhook-signature": headers["webhook-signature"] as string,
			"webhook-timestamp": headers["webhook-timestamp"] as string,
		});

		const payload = JSON.parse(rawBody) as DodoWebhookPayload;
		const evtType = payload.event_type ?? payload.type;
		const data = payload.data ?? payload;

		if (evtType === "payment.succeeded") {
			const md: DodoWebhookMetadata = data.metadata ?? payload.metadata ?? {};
			const paymentId = data.payment_id ?? payload.payment_id ?? "";
			const status = data.status ?? payload.status ?? "";
			const orderType: DodoOrderType =
				(md.orderType as DodoOrderType) || "consultation";

			const supabase = serverSupabaseServiceRole(event);

			if (orderType === "course") {
				const { error: insertError } = await supabase
					.from("course_purchases")
					.insert({
						first_name: md.firstName || "",
						last_name: md.lastName || "",
						email: md.email || data.customer?.email || "",
						experience: md.experience || "",
						payment_id: paymentId,
						payment_provider: "dodo_payments",
					});

				if (insertError) {
					console.error(
						"[verify-dodo-payment] failed to insert into course_purchases",
						insertError,
					);
				}

				try {
					await sendToDiscord({
						type: "course-purchase",
						data: {
							firstName: md.firstName,
							lastName: md.lastName,
							email: md.email,
							experience: md.experience,
							courseTitle: md.courseTitle || md.description,
							amountUsd: md.amountUsd,
							receipt: md.receipt,
							paymentId,
						},
						paymentProvider: "dodo",
					});
				} catch (discordErr) {
					console.error(
						"[verify-dodo-payment] failed to send discord notification",
						discordErr,
					);
				}

				return { received: true };
			}

			// --- Consultation flow ---
			const { data: consultationData, error: insertError } = await supabase
				.from("consultations")
				.insert({
					client_name: md.fullName || data.customer?.name || "",
					email: md.email || data.customer?.email || "",
					phone: md.phone || "",
					birth_location: md.location || "",
					birth_zipcode: md.zipcode || "",
					birth_time: md.timeOfBirth || "",
					birth_date: md.dateOfBirth || "",
					consultationMethod: md.consultationMethod || "email",
					instagramUsername: md.instagramUsername || "",
					accuracy: md.accuracy || "medium",
					message: md.message || null,
					package: md.description || "consultation",
				})
				.select("id")
				.single();

			if (insertError) {
				console.error(
					"[verify-dodo-payment] failed to insert into consultations",
					insertError,
				);
			}

			if (
				consultationData?.id &&
				md.serviceTypeId &&
				md.slotStart &&
				md.slotEnd
			) {
				const { error: bookingError } = await supabase.from("bookings").insert({
					consultation_id: consultationData.id,
					service_type_id: md.serviceTypeId,
					starts_at: md.slotStart,
					ends_at: md.slotEnd,
					status: "booked",
					hold_expires_at: null,
				});
				if (bookingError) {
					console.error(
						"[verify-dodo-payment] failed to insert into bookings",
						bookingError,
					);
				}
			}

			let serviceTypeName = md.description || "";
			if (md.serviceTypeId) {
				const { data: serviceTypeData, error: serviceTypeError } =
					await supabase
						.from("service_types")
						.select("name")
						.eq("id", md.serviceTypeId)
						.single();

				if (serviceTypeError) {
					console.error(
						"[verify-dodo-payment] failed to fetch service type name",
						serviceTypeError,
					);
				} else if (serviceTypeData?.name) {
					serviceTypeName = serviceTypeData.name;
				}
			}

			await supabase.from("payments_logs").insert({
				product_type: orderType,
				product_name: serviceTypeName,
				currency: payload.currency ?? "",
				amount: payload.amount ?? 0,
				payment_id: paymentId,
				provider: "dodo_payments",
				status,
			});

			try {
				await sendToDiscord({
					type: "birth-details",
					data: {
						fullName: md.fullName,
						email: md.email,
						phone: md.phone,
						dateOfBirth: md.dateOfBirth,
						timeOfBirth: md.timeOfBirth,
						location: md.location,
						zipcode: md.zipcode,
						consultationMethod: md.consultationMethod,
						instagramUsername: md.instagramUsername,
						needsBtr: md.needsBtr,
						message: md.message,
						amountUsd: md.amountUsd,
						description: md.description,
						receipt: md.receipt,
					},
					paymentProvider: "dodo",
				});
			} catch (discordErr) {
				console.error(
					"[verify-dodo-payment] failed to send discord notification",
					discordErr,
				);
			}
		}

		return { received: true };
	} catch (err) {
		console.error("Dodo webhook verification failed:", err);
		throw createError({ statusCode: 401, statusMessage: "Invalid signature" });
	}
});
