<template>
	<div class="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
		<div class="mx-auto w-full max-w-3xl space-y-6">
			<div>
				<h1 class="text-2xl font-semibold text-white">My Consultations</h1>
				<p class="mt-1 text-sm text-white/60">
					Your submitted consultation requests and their responses.
				</p>
			</div>

			<div
				v-if="!user"
				class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
				Please
				<NuxtLink to="/login" class="font-semibold underline">log in</NuxtLink>
				to view your consultations.
			</div>

			<div v-else-if="pending" class="space-y-3">
				<div
					v-for="i in 3"
					:key="i"
					class="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
			</div>

			<div
				v-else-if="!consultations?.length"
				class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
				<Icon
					name="material-symbols:inbox-outline"
					class="text-4xl text-white/30" />
				<p class="mt-3 text-sm text-white/50">
					You haven't submitted any consultations yet.
				</p>
				<NuxtLink
					to="/community/medical-consultation"
					class="mt-3 inline-block text-sm text-(--gg-accent) underline">
					Submit a consultation
				</NuxtLink>
			</div>

			<div v-else class="space-y-3">
				<NuxtLink
					v-for="item in consultations"
					:key="item.id"
					:to="`/community/consultations/${item.id.replace(/-/g, '')}`"
					class="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 hover:bg-white/8">
					<div class="flex min-w-0 items-center gap-3">
						<div
							class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon
								name="material-symbols:person"
								class="text-lg text-(--gg-accent)" />
						</div>
						<div class="min-w-0">
							<p class="truncate font-semibold text-white">
								{{ item.client_name }}
							</p>
							<p class="mt-0.5 text-xs text-white/50">
								{{ formatDate(item.created_at) }} ·
								{{ formatCategory(item.category) }}
							</p>
						</div>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<span
							v-if="item.free_consultation_responses?.length"
							class="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
							Responded
						</span>
						<span
							v-else
							class="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/50">
							Pending
						</span>
						<Icon name="i-lucide-chevron-right" class="text-sm text-white/30" />
					</div>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>

const user = useSupabaseUser();

const { data: consultations, pending } = await useLazyAsyncData(
	"my-consultations",
	() => $fetch("/api/free-consultations"),
	{ watch: [user] },
);

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function formatCategory(category: string) {
	return (
		category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
	);
}
</script>
