<template>
	<nav
		class="site-navbar relative z-50 mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-12"
		:class="colorTheme ? 'text-white' : 'text-slate-900'">
		<NuxtLink to="/" class="flex items-center gap-3">
			<img
				src="@/assets/images/logo_transparent.png"
				alt="Galactic Gene Logo"
				width="50"
				height="50" />
			<span class="sr-only">Galactic Gene</span>
		</NuxtLink>

		<div class="hidden items-center gap-10 md:flex">
			<NuxtLink to="/about">About</NuxtLink>
			<NuxtLink to="/#community">Community</NuxtLink>
			<NuxtLink to="/consultation">Consultation</NuxtLink>
			<NuxtLink to="/courses">Courses</NuxtLink>

			<NuxtLink
				to="/community/medical-consultation"
				class="navbar-cta-pulse relative inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm font-semibold text-amber-300">
				<span aria-hidden="true">✨</span>
				<span>Community Offering</span>
				<span class="navbar-cta-ping absolute -right-1 -top-1 flex h-2.5 w-2.5">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
					<span
						class="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
				</span>
			</NuxtLink>

			<UColorModeSwitch
				v-model="colorTheme"
				title="Toggle Dark/Light Theme"
				color="secondary"
				class="cursor-pointer!" />

			<UPopover v-if="user" mode="click" :ui="{ content: 'p-2 gap-2 w-fit' }">
				<UButton
					variant="ghost"
					color="neutral"
					class="rounded-full p-0.5"
					aria-label="Account menu">
					<UAvatar
						:alt="userInitials"
						size="sm"
						:ui="{ fallback: 'text-xs font-semibold' }" />
				</UButton>

				<template #content>
					<UButton
						variant="ghost"
						color="warning"
						class="w-full justify-start gap-2 p-2"
						leading-icon="material-symbols:tips-and-updates-rounded"
						@click="
							() => {
								navigateTo('/community/consultations');
							}
						">
						My Consultations
					</UButton>
					<UButton
						variant="ghost"
						color="error"
						class="w-full justify-start gap-2 p-2"
						leading-icon="i-lucide-log-out"
						@click="
							() => {
								confirmLogoutOpen = true;
							}
						">
						Sign out
					</UButton>
				</template>
			</UPopover>

			<NuxtLink v-else to="/login">
				<UButton variant="outline" color="neutral" size="sm">Sign in</UButton>
			</NuxtLink>
		</div>

		<!-- Mobile quick actions: CTA + account control, visible next to the menu button -->
		<div class="flex items-center gap-2 md:hidden">
			<NuxtLink
				to="/community/medical-consultation"
				class="navbar-cta-pulse relative inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300"
				aria-label="Community Offering">
				<span aria-hidden="true">Community Offering ✨</span>
				<span class="hidden sm:inline">Offering</span>
				<span class="navbar-cta-ping absolute -right-1 -top-1 flex h-2 w-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
					<span
						class="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
				</span>
			</NuxtLink>

			<UPopover v-if="user" mode="click" :ui="{ content: 'p-2 gap-2 w-fit' }">
				<UButton
					variant="ghost"
					color="neutral"
					class="rounded-full p-0.5"
					aria-label="Account menu">
					<UAvatar
						:alt="userInitials"
						size="sm"
						:ui="{ fallback: 'text-xs font-semibold' }" />
				</UButton>

				<template #content>
					<UButton
						variant="ghost"
						color="warning"
						class="w-full justify-start gap-2 p-2"
						leading-icon="material-symbols:tips-and-updates-rounded"
						@click="
							() => {
								navigateTo('/community/consultations');
							}
						">
						My Consultations
					</UButton>
					<UButton
						variant="ghost"
						color="error"
						class="w-full justify-start gap-2 p-2"
						leading-icon="i-lucide-log-out"
						@click="
							() => {
								confirmLogoutOpen = true;
							}
						">
						Sign out
					</UButton>
				</template>
			</UPopover>

			<NuxtLink v-else to="/login">
				<UButton variant="outline" color="neutral" size="xs">Sign in</UButton>
			</NuxtLink>

			<button
				type="button"
				ref="menuButton"
				class="navbar-menu-button inline-flex items-center justify-center rounded-full p-3 text-inherit transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
				:aria-expanded="menuOpen"
				aria-controls="mobile-navigation"
				aria-label="Open navigation menu"
				@click="menuOpen = true">
				<Icon name="mdi:menu" class="text-2xl text-white" />
			</button>
		</div>

		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0">
			<div
				v-if="menuOpen"
				class="fixed inset-0 z-50 md:hidden"
				@click.self="menuOpen = false">
				<div class="absolute inset-0 bg-black backdrop-blur-sm"></div>

				<aside
					id="mobile-navigation"
					class="navbar-drawer relative ml-auto flex h-full w-[min(88vw,20rem)] flex-col border-l px-5 py-5 shadow-2xl"
					role="dialog"
					aria-modal="true"
					aria-label="Mobile navigation">
					<div class="flex items-center justify-between gap-4">
						<span class="navbar-muted text-sm uppercase tracking-[0.25em]"
							>Menu</span
						>
						<button
							type="button"
							ref="closeButton"
							class="navbar-close-button inline-flex items-center justify-center rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
							aria-label="Close navigation menu"
							@click="menuOpen = false">
							<Icon name="mdi:close" class="text-xl" />
						</button>
					</div>

					<nav class="mt-8 flex flex-col gap-2">
						<NuxtLink
							v-for="link in links"
							:key="link.to"
							:to="link.to"
							class="navbar-link rounded-2xl px-4 py-3 text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
							@click="menuOpen = false">
							<span>{{ link.label }}</span>
						</NuxtLink>
					</nav>

					<div class="navbar-footer mt-auto border-t pt-6 space-y-4">
						<UColorModeSwitch
							v-model="colorTheme"
							title="Toggle Dark/Light Theme"
							color="neutral"
							class="cursor-pointer!" />
					</div>
				</aside>
			</div>
		</Transition>

		<UModal
			v-model:open="confirmLogoutOpen"
			title="Sign out?"
			:ui="{
				title:'text-3xl! font-serif!'
			}"
			:dismissible="!loggingOut">
			<template #body>
				<p class="text-sm text-muted">
					You'll need to sign in again to access your consultations and account.
				</p>
			</template>

			<template #footer>
				<div class="flex w-full justify-end gap-2">
					<UButton
						variant="ghost"
						color="neutral"
						:disabled="loggingOut"
						@click="
							() => {
								confirmLogoutOpen = false;
							}
						">
						Cancel
					</UButton>
					<UButton
						variant="solid"
						color="error"
						:loading="loggingOut"
						leading-icon="i-lucide-log-out"
						@click="logout">
						Sign out
					</UButton>
				</div>
			</template>
		</UModal>
	</nav>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const menuOpen = ref(false);
const confirmLogoutOpen = ref(false); // NEW
const menuButton = ref<HTMLButtonElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);

const links = [
	{ label: "About", to: "/#about" },
	{ label: "Community", to: "/#community" },
	{ label: "Consultation", to: "/consultation" },
	{ label: "Courses", to: "/courses" },
	{ label: "Blog", to: "/blog" },
];

const colorMode = useColorMode();
const colorTheme = computed({
	get: () => colorMode.value === "dark",
	set: (isDark: boolean) => {
		colorMode.preference = isDark ? "dark" : "light";
	},
});

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();
const loggingOut = ref(false);

const userInitials = computed(() => {
	const meta = user.value?.user_metadata;
	if (meta?.first_name)
		return `${meta.first_name[0]}${meta.last_name?.[0] ?? ""}`.toUpperCase();
	return (user.value?.email?.[0] ?? "?").toUpperCase();
});

async function logout() {
	loggingOut.value = true;
	try {
		await supabase.auth.signOut();
		confirmLogoutOpen.value = false;
		menuOpen.value = false;
		router.push("/login");
	} finally {
		loggingOut.value = false;
	}
}
watch(menuOpen, async (isOpen) => {
	if (!import.meta.client) {
		return;
	}

	document.body.style.overflow = isOpen ? "hidden" : "";

	if (isOpen) {
		await nextTick();
		closeButton.value?.focus();
		return;
	}

	menuButton.value?.focus();
});

useEventListener(window, "keydown", (event) => {
	if (event.key === "Escape" && menuOpen.value) {
		menuOpen.value = false;
	}
});

onBeforeUnmount(() => {
	if (import.meta.client) {
		document.body.style.overflow = "";
	}
});
</script>

<style scoped>
a {
	color: white;
}

.light a {
	color: black;
	text-decoration: none;
}
.light a:hover {
	color: goldenrod;
	text-decoration: none;
}

/* Subtle attention-getter for the community-initiative CTA link.
   Slow, gentle glow pulse instead of scaling/shaking, so it's
   noticeable but not distracting. */
.navbar-cta-pulse {
	animation: navbar-cta-glow 2.6s ease-in-out infinite;
}

.navbar-cta-pulse:hover {
	animation-play-state: paused;
}

@keyframes navbar-cta-glow {
	0%,
	100% {
		box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.35);
	}
	50% {
		box-shadow: 0 0 0 6px rgba(251, 191, 36, 0);
	}
}

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
	.navbar-cta-pulse {
		animation: none;
	}
	.navbar-cta-ping .animate-ping {
		animation: none;
	}
}
</style>
