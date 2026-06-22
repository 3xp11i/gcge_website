// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ["~/assets/css/main.css", "~/assets/css/tailwind.css"],

	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	app: {
		head: {
			titleTemplate: "%s · Galactic Gene",
			title: "Galactic Gene",
			htmlAttrs: {
				lang: "en",
			},
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{
					name: "description",
					content: "Galactic Gene - a Nuxt and Tailwind starter landing page.",
				},
			],
		},
	},
	modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxtjs/tailwindcss"],
});
