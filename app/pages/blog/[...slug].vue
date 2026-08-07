<template>
	<div>
		<div v-if="page">
			<NuxtLink
				to="/blog"
				class="mb-6 inline-flex items-center gap-1.5 text-sm opacity-60 transition-opacity hover:opacity-100">
				<span aria-hidden="true">←</span> Back to Blog
			</NuxtLink>

			<header class="mb-8">
				<div
					v-if="page.thumbnail"
					class="mb-6 flex justify-start overflow-hidden">
					<img
						:src="page.thumbnail"
						:alt="page.title"
						class="w-2/3 object-contain rounded-2xl" />
				</div>

				<p v-if="page.date" class="mb-2 text-xs opacity-50">
					{{ formatDate(page.date) }}
				</p>
				<h1 class="text-5xl! font-bold sm:text-6xl!">{{ page.title }}</h1>
				<p v-if="page.description" class="mt-3 text-base opacity-60">
					{{ page.description }}
				</p>
			</header>

			<div
				class="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-10">
				<aside
					v-if="toc?.links?.length"
					class="mb-8 lg:sticky sm:top-6 sm:order-2 sm:mb-0 lg:self-start">
					<div
						class="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-5">
						<p class="text-sm font-semibold uppercase tracking-wide opacity-60">
							Table of Contents
						</p>
						<nav class="mt-4">
							<ul class="space-y-3 text-base">
								<li v-for="link in toc.links" :key="link.id">
									<a
										:href="`#${link.id}`"
										:class="[
											'transition-colors hover:text-amber-300 hover:opacity-100',
											activeId === link.id
												? 'text-amber-300 light:text-amber-950 opacity-100 font-medium'
												: 'opacity-70',
										]">
										{{ link.text }}
									</a>
									<ul
										v-if="link.children?.length"
										class="mt-2 space-y-2 border-l border-white/10 pl-3">
										<li v-for="child in link.children" :key="child.id">
											<a
												:href="`#${child.id}`"
												:class="[
													'text-sm transition-colors hover:text-amber-300 hover:opacity-100',
													activeId === child.id
														? 'text-amber-300 opacity-100 font-medium'
														: 'opacity-60',
												]">
												{{ child.text }}
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</aside>
				<ContentRenderer :value="page" class="blog-prose min-w-0 lg:order-1" />
			</div>

			<NuxtLink
				to="/blog"
				class="mt-10 inline-flex items-center gap-1.5 text-sm opacity-60 transition-opacity hover:opacity-100">
				<span aria-hidden="true">←</span> Back to Blog
			</NuxtLink>
		</div>

		<div v-else class="py-20 text-center opacity-50">
			<p>Post not found.</p>
			<NuxtLink to="/blog" class="mt-4 inline-block text-sm underline"
				>Back to blog</NuxtLink
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "blog-article" });

const route = useRoute();

const { data: page } = await useAsyncData(route.path, () =>
	queryCollection("blog").path(route.path).first(),
);

if (page.value) {
	useSeoMeta({
		title: page.value.title,
		description: page.value.description,
		ogImage: page.value.thumbnail,
	});
}

const toc = computed(() => page.value?.body?.toc ?? null);

// Kept for the blog-article layout in case it also consumes this
provide("blog-toc", toc);

function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-IN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Active heading tracking
const activeId = ref<string | null>(null);
let observer: IntersectionObserver | null = null;

function flattenIds(
	links: { id: string; children?: { id: string }[] }[],
): string[] {
	return links.flatMap((link) => [
		link.id,
		...(link.children ? flattenIds(link.children) : []),
	]);
}

function setupObserver() {
	observer?.disconnect();
	if (!toc.value?.links?.length) return;

	const headings = flattenIds(toc.value.links)
		.map((id) => document.getElementById(id))
		.filter((el): el is HTMLElement => !!el);

	if (!headings.length) return;

	observer = new IntersectionObserver(
		(entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting);
			if (visible.length) {
				activeId.value = visible[0].target.id;
			}
		},
		{ rootMargin: "-96px 0px -70% 0px", threshold: 0 },
	);

	headings.forEach((el) => observer!.observe(el));
}

onMounted(async () => {
	await nextTick();
	setupObserver();
});

onBeforeUnmount(() => {
	observer?.disconnect();
});
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
	font-family: "Quicksand", sans-serif;
	scroll-margin-top: 4rem;
}
h1 {
	font-size: 2.5rem;
	line-height: 1.2;
	font-weight: 700;
	margin-bottom: 1rem;
}
</style>
