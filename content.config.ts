import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: "page",
			source: "blog/**/*.md",
			schema: z.object({
				date: z.string().optional(),
				thumbnail: z.string().optional(),
				headline: z.string().optional(),
				excerpt: z.string().optional(),
			}),
		}),
	},
});
