export type ConsultationService = {
	kicker: string;
	title: string;
	priceInr: string;
	priceUsd: string;
	badge?: string;
	description: string;
	includes: string;
	amountPaise: number;
	receipt: string;
	ctaLabel: string;
	category: string;
	dodoProductID?: string;
	dodoProductIDLive?: string;
	// testDodoProductID?: string;
};

export const personalRelationshipServices: ConsultationService[] = [
	{
		kicker: "Relationship life guidance",
		title: "Relationship consultation",
		priceInr: "₹5,100",
		priceUsd: "$60",
		badge: "30 mins",
		description:
			"This consultation is focused on relationship guidance, compatibility, and understanding the dynamics of the relationship.",
		includes: "30 minutes for one horoscope, individually reviewed.",
		amountPaise: 510000,
		receipt: "relationship-consultation",
		ctaLabel: "Book Relationship Consultation",
		category: "Personal & Relationships",
		dodoProductID: "pdt_0Nif7NpelxSATp0uIQ6l9",
		dodoProductIDLive: "pdt_0NifmXPQ0wgrs7sfPOHtT",
	},
	{
		kicker: "Core reading",
		title: "Full consultation",
		priceInr: "₹11,000",
		priceUsd: "$129",
		badge: "50 mins",
		description:
			"A deep-dive consultation for a single horoscope where any amount of questions are considered within the session time.",
		includes:
			"50 minutes of focused discussion, with remedies provided when necessary.",
		amountPaise: 1100000,
		receipt: "full-consultation",
		ctaLabel: "Book Full Consultation",
		category: "Personal & Relationships",
		dodoProductID: "pdt_0NifVK4Y2guWyrLy198AP",
		dodoProductIDLive: "pdt_0Nifo2LAvDWRAazs4XpHB",
	},
	{
		kicker: "Deep karmic work",
		title: "Pending karma consultation",
		priceInr: "₹31,000",
		priceUsd: "$365",
		badge: "80 mins",
		description:
			"For deeper issues such as why nothing is working at all, long-term health concerns, and repeated family patterns like anxiety.",
		includes:
			"Uses tools such as d60, d40, and d45 to review karma from the family lineage.",
		amountPaise: 3100000,
		receipt: "pending-karma-consultation",
		ctaLabel: "Book Pending Karma Consultation",
		category: "Personal & Relationships",
		dodoProductID: "pdt_0Nifq3eBI1gYiPOgZ41LD",
	},
];

export const careerBusinessServices: ConsultationService[] = [
	{
		kicker: "Career focus",
		title: "Career/Business consultation",
		priceInr: "₹5,100",
		priceUsd: "$60",
		badge: "30 mins",
		description:
			"Career-focused guidance for questions about work, progress, direction, and blockages.",
		includes: "30 minutes for one horoscope, individually reviewed.",
		amountPaise: 510000,
		receipt: "career-consultation",
		ctaLabel: "Book Career Consultation",
		category: "Career & Business",
		dodoProductID: "pdt_0Nifn35LmCYTBU9e9QUcf",
	},
	{
		// Logo Designing package
		kicker: "Design focus",
		title: "Logo Designing",
		priceInr: "₹21,100",
		priceUsd: "$220",
		badge: "30 mins",
		description:
			"Professional logo design services for businesses and personal brands.",
		includes: "30 minutes for one horoscope, individually reviewed.",
		amountPaise: 2100000,
		receipt: "logo-designing-consultation",
		ctaLabel: "Book Logo Designing Consultation",
		category: "Career & Business",
		dodoProductID: "pdt_0NikaCuFP49yGzjsWdQuU",
	},
];

export const otherServices: ConsultationService[] = [
	{
		kicker: "Event timing",
		title: "Auspicious time / muhurat",
		priceInr: "From ₹3,000",
		priceUsd: "From $35",
		badge: "Per event",
		description:
			"For selecting an auspicious time for important events and occasions. This includes product launches, engagements, housewarmings, and other significant events.",
		includes: "Pricing starts from ₹3,000 per event.",
		amountPaise: 300000,
		receipt: "muhurat-consultation",
		ctaLabel: "Book Muhurat Consultation",
		category: "Other Services",
		dodoProductID: "pdt_0NifpgQ602a1fBWWw5FhQ",
	},
	{
		kicker: "Quick guidance",
		title: "Gemstone recommendation",
		priceInr: "₹3,000",
		priceUsd: "$35",
		badge: "10 mins",
		description:
			"A short gemstone guidance session with a dedicated 10 minutes allotted for the recommendation.",
		includes: "Best suited for a concise, direct recommendation.",
		amountPaise: 300000,
		receipt: "gemstone-recommendation",
		ctaLabel: "Book Gemstone Recommendation",
		category: "Other Services",
		dodoProductID: "pdt_0NifpwfBeMjuROhFO4qjs",
	},
	{
		kicker: "",
		title: "Property & Real Estate",
		priceInr: "₹11,000",
		priceUsd: "$129",
		badge: "50 mins",
		description:
			"Discussion of which property to buy or sell, and the best time to do so. We include commercial activities as well as residential activities.",
		includes:
			"50 minutes of focused discussion, with remedies provided when necessary.",
		amountPaise: 1100000,
		receipt: "property-real-estate-consultation",
		ctaLabel: "Book Property & Real Estate Consultation",
		category: "Other Services",
		dodoProductID: "pdt_0NiilwGMQfzEqzbdxkeMt",
	},
];
