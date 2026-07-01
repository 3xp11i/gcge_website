import { env } from "node:process"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ["~/assets/css/main.css"],
	postcss: {
		plugins: {
			"@tailwindcss/postcss": {},
		},
	},
	runtimeConfig: {
		razorpayKeyId: process.env.NUXT_RAZORPAY_KEY_ID,
		razorpayKeySecret: process.env.NUXT_RAZORPAY_KEY_SECRET,
		public: {
			razorpayKeyId: process.env.NUXT_PUBLIC_RAZORPAY_KEY_ID,
		},
	},

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
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
	icon: {
		mode: "css",
		cssLayer: "base",
	},

	fonts: {
		families: [
			{
				name: "Disney",
				provider: "local",
				weights: [400],
				styles: ["normal"],
			},
		],
	},
	modules: [
		"@nuxt/fonts",
		"@nuxt/icon",
		"@vueuse/nuxt",
		"@nuxt/ui",
		"@nuxtjs/color-mode",
		"@nuxtjs/mdc",
	],
});
