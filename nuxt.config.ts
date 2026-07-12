import { env } from "node:process";

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ogImageUrl = `${siteUrl}/og_image.jpg`;

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
			dodoMode: process.env.NUXT_PUBLIC_DODO_MODE || "test",
			siteUrl,
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
					content:
						"Galactic Gene is an astrology community and content space with a premium, calm, space-inspired visual identity. We provide resources, discussions, and insights for those interested in exploring their cosmic path.",
				},
				{ name: "apple-mobile-web-app-title", content: "Galactic Gene" },
				{ property: "og:image", content: ogImageUrl },
				{ property: "og:image:secure_url", content: ogImageUrl },
				{ property: "twitter:image", content: ogImageUrl },
				{ property: "twitter:card", content: "summary_large_image" },
			],
			link: [
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon-96x96.png",
					sizes: "96x96",
				},
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
				{ rel: "shortcut icon", href: "/favicon.ico" },
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
				{ rel: "manifest", href: "/site.webmanifest" },
			],
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
		"@nuxtjs/seo",
	],
	vite: {
		optimizeDeps: {
			include: ["@unhead/schema-org/vue"],
		},
		server: {
			allowedHosts: [".ngrok-free.app"], //ngrok http --url=relative-only-whale.ngrok-free.app localhost:3000
		},
	},
});
