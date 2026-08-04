<template>
	<div class="min-h-screen w-full flex px-4 py-6 sm:px-6 lg:px-8">
		<div class="w-full mx-auto max-w-3xl space-y-5">
			<NuxtLink
				to="/community/consultations"
				class="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80">
				<Icon name="i-lucide-arrow-left" class="text-sm" />
				Back to consultations
			</NuxtLink>

			<div v-if="pending" class="space-y-4">
				<div
					class="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
				<div
					class="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
				<div
					class="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
			</div>

			<div
				v-else-if="!consultation"
				class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
				Consultation not found.
			</div>

			<template v-else>
				<!-- Birth Details -->

				<h1 class="text-4xl! font-bold text-white text-center">Consultation Response</h1>
				<section
					class="rounded-3xl items-start! border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
					<div class="mb-5 flex items-center gap-2.5">
						<div
							class="inline-flex shrink-0 items-center justify-center rounded-full">
							<Icon
								name="material-symbols:person"
								class="text-2xl text-(--gg-accent)" />
						</div>
						<h4 class="text-3xl! font-semibold text-white">Birth Details</h4>
					</div>

					<div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
						<div class="rounded-2xl border border-white/10 bg-black/20 p-3">
							<Icon
								name="material-symbols:person-outline"
								class="text-lg text-(--gg-accent)" />
							<p class="mt-1.5 text-xs text-white/50">Name</p>
							<p class="mt-0.5 truncate text-sm font-semibold text-white">
								{{ consultation.client_name }}
							</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-black/20 p-3">
							<Icon
								name="material-symbols:calendar-today-outline"
								class="text-lg text-(--gg-accent)" />
							<p class="mt-1.5 text-xs text-white/50">Date of Birth</p>
							<p class="mt-0.5 text-sm font-semibold text-white">
								{{ formatBirthDate(consultation.birth_date) }}
							</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-black/20 p-3">
							<Icon
								name="material-symbols:schedule-outline"
								class="text-lg text-(--gg-accent)" />
							<p class="mt-1.5 text-xs text-white/50">Time of Birth</p>
							<p class="mt-0.5 text-sm font-semibold text-white">
								{{ formatBirthTime(consultation.birth_time) }}
							</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-black/20 p-3">
							<Icon
								name="material-symbols:location-on-outline"
								class="text-lg text-(--gg-accent)" />
							<p class="mt-1.5 text-xs text-white/50">Place of Birth</p>
							<p class="mt-0.5 truncate text-sm font-semibold text-white">
								{{ consultation.birth_location }}
							</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-black/20 p-3">
							<Icon
								name="material-symbols:transgender-outline"
								class="text-lg text-(--gg-accent)" />
							<p class="mt-1.5 text-xs text-white/50">Gender</p>
							<p class="mt-0.5 truncate text-sm font-semibold text-white">
								{{ consultation.gender }}
							</p>
						</div>
					</div>
				</section>

				<!-- Message -->
				<section
					class="rounded-3xl items-start! border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
					<div class="mb-4 flex items-center gap-2.5">
						<div
							class="inline-flex shrink-0 items-center justify-center rounded-full p-3">
							<Icon
								name="material-symbols:live-help-rounded"
								class="text-2xl text-(--gg-accent)" />
						</div>
						<h4 class="text-3xl! font-semibold text-white">Your Question</h4>
					</div>

					<p
						v-if="consultation.message?.trim()"
						class="whitespace-pre-line text-sm leading-7 text-white/80">
						{{ consultation.message }}
					</p>
					<p v-else class="text-sm text-white/40 italic">
						No additional message was provided.
					</p>
				</section>

				<!-- Awaiting response -->
				<div
					v-if="!response"
					class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
					<Icon name="material-symbols:hourglass-outline" class="text-3xl" />
					<p class="mt-2 text-sm">Your consultation is awaiting a response.</p>
				</div>

				<!-- Response -->
				<section
					v-else
					class="rounded-3xl border items-start! border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
					<div
						class="flex flex-wrap items-start justify-between gap-3 w-full">
						<div class="flex items-start gap-2.5">
							<div class="inline-flex shrink-0 items-center justify-center p-2">
								<Icon
									name="material-symbols:chat-bubble-rounded"
									class="text-3xl text-(--gg-accent)" />
							</div>
							<div>
								<h4 class="text-3xl! font-semibold text-white">
									Astrologer's Response
								</h4>
								<!-- <p class="text-xs text-white/50">{{ formatCategory(consultation.category) }}</p> -->

								<div v-if="authorProfile" class="flex items-center gap-2 mt-3">
									<p class="text-xs text-white/50">Analysed by</p>
									<p class="text-sm font-semibold text-white">
										{{ authorProfile.first_name }}
										{{ authorProfile.last_name }}
									</p>
								</div>
							</div>
						</div>
						<div
							class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left">
							<p class="text-xs text-white/40">Responded on</p>
							<p class="text-sm font-medium text-white/80">
								{{ formatDateTime(response.created_at) }}
							</p>
						</div>
					</div>

					<hr class="border-white/10" />

					<div class="prose-response p-5 text-sm leading-7 text-white/85">
						<MDC :value="response.response_text" />
					</div>
				</section>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({ name: "ConsultationDetail" });

const route = useRoute();
const user = useSupabaseUser();
const requestFetch = useRequestFetch();

const { data, pending } = await useLazyAsyncData(
	`consultation-${route.params.id}`,
	() => requestFetch(`/api/free-consultations/${route.params.id}`),
	{
		getCachedData(key, nuxtApp) {
			return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
		},
	},
);

const consultation = computed(() => data.value?.consultation);
const response = computed(() => data.value?.response);
const authorProfile = computed(() => data.value?.authorProfile);
function formatBirthDate(date: string) {
	const [y, m, d] = date.split("-").map(Number) as [number, number, number];
	return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function formatBirthTime(time: string) {
	const [h, min] = time.split(":").map(Number) as [number, number];
	const suffix = h >= 12 ? "PM" : "AM";
	const hour = h % 12 || 12;
	return `${hour}:${String(min).padStart(2, "0")} ${suffix}`;
}

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function formatCategory(category: string) {
	return (
		category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
	);
}
</script>

<style scoped>
.prose-response :deep(h1),
.prose-response :deep(h2),
.prose-response :deep(h3) {
	color: var(--gg-accent);
	font-weight: 600;
	margin-top: 1.25em;
	margin-bottom: 0.5em;
}
.prose-response :deep(p) {
	margin-bottom: 0.75em;
}
.prose-response :deep(ul),
.prose-response :deep(ol) {
	padding-left: 1.5em;
	margin-bottom: 0.75em;
}
.prose-response :deep(li) {
	margin-bottom: 0.25em;
}
</style>
