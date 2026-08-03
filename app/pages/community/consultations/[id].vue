<template>
	<div class="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
		<div class="mx-auto w-full max-w-3xl space-y-5">
			<NuxtLink
				to="/community/consultations"
				class="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80">
				<Icon name="i-lucide-arrow-left" class="text-sm" />
				Back to consultations
			</NuxtLink>

			<div v-if="pending" class="space-y-4">
				<div class="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
				<div class="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
			</div>

			<div
				v-else-if="!consultation"
				class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
				Consultation not found.
			</div>

			<template v-else>
				<!-- Client Details -->
				<section class="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
					<div class="mb-4 flex items-center gap-2.5">
						<div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon name="material-symbols:person" class="text-base text-(--gg-accent)" />
						</div>
						<h2 class="font-semibold text-white">Client Details</h2>
					</div>

					<!-- Mobile: 2-col grid; sm+: flex row with dividers -->
					<div class="grid grid-cols-2 gap-4 sm:hidden">
						<div class="flex flex-col gap-1">
							<Icon name="material-symbols:person-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Name</p>
							<p class="text-sm font-semibold text-white">{{ consultation.client_name }}</p>
						</div>
						<div class="flex flex-col gap-1">
							<Icon name="material-symbols:calendar-today-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Date of Birth</p>
							<p class="text-sm font-semibold text-white">{{ formatBirthDate(consultation.birth_date) }}</p>
						</div>
						<div class="flex flex-col gap-1">
							<Icon name="material-symbols:schedule-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Time of Birth</p>
							<p class="text-sm font-semibold text-white">{{ formatBirthTime(consultation.birth_time) }}</p>
						</div>
						<div class="flex flex-col gap-1">
							<Icon name="material-symbols:location-on-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Place of Birth</p>
							<p class="text-sm font-semibold text-white">{{ consultation.birth_location }}</p>
						</div>
					</div>

					<div class="hidden divide-x divide-white/10 sm:flex">
						<div class="flex flex-1 flex-col gap-1 pr-4">
							<Icon name="material-symbols:person-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Name</p>
							<p class="text-sm font-semibold text-white">{{ consultation.client_name }}</p>
						</div>
						<div class="flex flex-1 flex-col gap-1 px-4">
							<Icon name="material-symbols:calendar-today-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Date of Birth</p>
							<p class="text-sm font-semibold text-white">{{ formatBirthDate(consultation.birth_date) }}</p>
						</div>
						<div class="flex flex-1 flex-col gap-1 px-4">
							<Icon name="material-symbols:schedule-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Time of Birth</p>
							<p class="text-sm font-semibold text-white">{{ formatBirthTime(consultation.birth_time) }}</p>
						</div>
						<div class="flex flex-1 flex-col gap-1 pl-4">
							<Icon name="material-symbols:location-on-outline" class="text-lg text-(--gg-accent)" />
							<p class="text-xs text-white/50">Place of Birth</p>
							<p class="text-sm font-semibold text-white">{{ consultation.birth_location }}</p>
						</div>
					</div>
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
					class="rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
					<!-- Section header -->
					<div class="flex flex-wrap items-start justify-between gap-3 p-5">
						<div class="flex items-center gap-2.5">
							<div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
								<Icon name="material-symbols:rate-review-outline" class="text-base text-(--gg-accent)" />
							</div>
							<div>
								<h2 class="font-semibold text-white">Astrologer's Response</h2>
								<p class="text-xs text-white/50">{{ formatCategory(consultation.category) }}</p>
							</div>
						</div>
						<div class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
							<p class="text-xs text-white/40">Responded on</p>
							<p class="text-sm font-medium text-white/80">{{ formatDateTime(response.created_at) }}</p>
						</div>
					</div>

					<hr class="border-white/10" />

					<!-- Response body -->
					<div class="prose-response p-5 text-sm leading-7 text-white/85">
						<MDC :value="response.response_text" />
					</div>

					<hr class="border-white/10" />

					<!-- Author -->
					<div v-if="authorProfile" class="flex items-center gap-3 p-5">
						<div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon name="material-symbols:person" class="text-base text-(--gg-accent)" />
						</div>
						<div>
							<p class="text-xs text-white/50">Response by</p>
							<p class="text-sm font-semibold text-white">
								{{ authorProfile.first_name }} {{ authorProfile.last_name }}
							</p>
						</div>
					</div>
				</section>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>

const route = useRoute();

const { data, pending } = await useAsyncData(
	`consultation-${route.params.id}`,
	() => $fetch(`/api/free-consultations/${route.params.id}`),
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
