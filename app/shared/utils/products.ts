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
	durationMinutes: number;
	dodoProductID?: string;
	dodoProductIDLive?: string;
	// testDodoProductID?: string;
	serviceTypeId: string;
};

export interface CourseProduct {
	id: string;
	title: string;
	priceInr: string; // display only
	priceUsd: number; // used for Dodo charge
	amountPaise: number; // used for Razorpay charge
	dodoProductID: string;
	dodoProductIDLive?: string;
}

export const personalRelationshipServices: ConsultationService[] = [
	{
		kicker: "Relationship life guidance",
		title: "Relationship consultation",
		priceInr: "₹50",
		priceUsd: "$1",
		badge: "30 mins",
		description:
			"This consultation is focused on relationship guidance, compatibility, and understanding the dynamics of the relationship.",
		includes: "30 minutes for one horoscope, individually reviewed.",
		amountPaise: 5000,
		receipt: "relationship-consultation",
		ctaLabel: "Book Relationship Consultation",
		category: "Personal & Relationships",
		durationMinutes: 30,
		dodoProductID: "pdt_0Nif7NpelxSATp0uIQ6l9",
		dodoProductIDLive: "pdt_0Nk5YteUbqzAc74qiaRoC",
		serviceTypeId: "028f9a7e-d96a-46cf-845a-f2d64b8702dc",
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
		durationMinutes: 50,
		dodoProductID: "pdt_0NifVK4Y2guWyrLy198AP",
		dodoProductIDLive: "pdt_0Nifo2LAvDWRAazs4XpHB",
		serviceTypeId: "18ae2650-c00d-4758-9379-4b28259bc070",
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
		durationMinutes: 80,
		dodoProductID: "pdt_0Nifq3eBI1gYiPOgZ41LD",
		serviceTypeId: "9c82482e-1e0c-4892-af1b-e4cb5bf67071",
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
		durationMinutes: 30,
		dodoProductID: "pdt_0Nifn35LmCYTBU9e9QUcf",
		serviceTypeId: "1e8f0976-7704-47f1-8931-7c53b76e8fc5",
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
		durationMinutes: 30,
		dodoProductID: "pdt_0NikaCuFP49yGzjsWdQuU",
		serviceTypeId: "f78a94ec-f4d0-46c1-9c2c-aae2be90324c",
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
		durationMinutes: 30,
		dodoProductID: "pdt_0NifpgQ602a1fBWWw5FhQ",
		serviceTypeId: "64371c1d-62b5-46f4-82e4-36ccce7e41b8",
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
		durationMinutes: 10,
		dodoProductID: "pdt_0NifpwfBeMjuROhFO4qjs",
		serviceTypeId: "d9a952bd-2015-43c4-acca-83f6159f0426",
	},
	{
		kicker: "Vastu guidance",
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
		durationMinutes: 50,
		dodoProductID: "pdt_0NiilwGMQfzEqzbdxkeMt",
		serviceTypeId: "ef50f90f-aa68-4255-9288-6840858777fd",
	},
];

export const courses: Record<string, CourseProduct> = {
	"bnn-basic-advance": {
		id: "bnn-basic-advance",
		title: "Bhrigu Nandi Nadi",
		priceInr: "INR 50",
		priceUsd: 1,
		amountPaise: 5000,
		dodoProductID: "pdt_0Nk1cjlGlDkg5zdezYRUp",
		dodoProductIDLive: "pdt_0Nk5Z5qbqZVbNkEjRJBDq",
	},
};
