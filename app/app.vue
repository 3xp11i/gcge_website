<template>
	<UApp :toaster="{ position: 'bottom-center' }">
		<!-- <UBanner to="/community/medical-consultation"
             target="_blank"
             title="🩺 Apply: Medical Astrology Reviews"
             color="info"
             :ui="{
              container: 'h-10',
            }" /> -->
		<UBanner
			to="/community/medical-consultation"
			icon="i-lucide-info"
			id="medical-astrology-banner"
			close
			:ui="{
				root: [
					'relative bg-gray-950 z-50 w-full',
					'hover:bg-gray-900 transition-colors duration-300',
				],
				container: 'h-10',
				title: 'text-md sm:text-base text-white font-bold',
				close: 'text-white',
			}">
			<template #title>
				<span class="hidden sm:inline">
					Apply for Complimentary Medical Astrology Reviews. Limited
					applications accepted today.
				</span>
				<span class="sm:hidden"> Apply: Medical Astrology Reviews </span>
			</template>
		</UBanner>
		<UMain>
			<NuxtLayout>
				<NuxtLoadingIndicator />
				<NuxtPage :keepalive="{ include: ['ConsultationsList'] }" />
				<ClientOnly>
					<NuxtRouteAnnouncer />
				</ClientOnly>
			</NuxtLayout>
		</UMain>
	</UApp>
</template>

<script setup lang="ts">
useHead({
	title: "Homepage",
	meta: [{ name: "theme-color", content: "#030712" }],
});
const toaster = { position: "top-center" };
</script>
