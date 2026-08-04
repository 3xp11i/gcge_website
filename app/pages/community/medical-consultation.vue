<template>
	<div class="consultation-page px-4 py-2 sm:px-6 lg:px-8">
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
			<header
				class="relative rounded-3xl border border-white/10 bg-black/20 px-6 py-6 sm:px-2 mb-0!">
				<div
					class="pointer-events-none absolute -left-12 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/10" />
				<div
					class="pointer-events-none absolute -right-12 top-1/2 h-56 w-56 rounded-full border -z-1 border-white/10" />

				<div class="mx-auto max-w-3xl text-center">
					<p
						class="text-xs font-semibold uppercase tracking-[0.32em] text-(--gg-accent-strong)">
						Galactic Gene
					</p>
					<h1
						class="mt-3 text-3xl! font-semibold text-(--gg-heading-h3)! sm:text-3xl!">
						Community Initiative Application
					</h1>
					<p class="mt-3 text-sm text-white/85 sm:text-base">
						Applying for our current astrology initiative is easy. <br />
						Please fill this form with your details and submit your application.
					</p>

					<!-- Already Submitted Nuxt Link to /community/consultations -->
					<NuxtLink
						to="/community/consultations"
						class="mt-5 inline-block text-sm text-(--gg-accent) underline rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-md font-semibold hover:bg-amber-300/10 hover:text-amber-400 transition-colors">
						Already submitted an application? Check your submissions here.
					</NuxtLink>
				</div>
			</header>

			<div class="grid gap-5 lg:grid-cols-[1.65fr_0.8fr]">
				<section
					class="rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 my-0!">
					<div
						v-if="!user"
						class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 mb-5">
						You must be
						<NuxtLink
							to="/login"
							class="underline font-semibold pulse-animation"
							>logged in</NuxtLink
						>
						to submit an application.
					</div>
					<UForm
						:state="state"
						:validate="validate"
						class="space-y-5"
						@submit="handleSubmit">
						<article class="p-4 sm:p-5">
							<div class="mb-4 flex items-start gap-3">
								<div
									class="inline-flex p-2 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
									<Icon
										name="material-symbols:person"
										class="text-2xl text-(--gg-accent)" />
								</div>
								<div>
									<h3 class="text-2xl! font-semibold text-white">
										Personal Details
									</h3>
									<p class="text-sm text-white/70">
										Basic Information about the Person.
									</p>
								</div>
							</div>

							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField
									label="Name of the person"
									name="fullName"
									required
									class="sm:col-span-2">
									<UInput
										v-model="state.fullName"
										placeholder="Enter your full name"
										size="lg"
										class="w-full"
										:disabled="!user" />
								</UFormField>

								<!-- <UFormField label="Email address" name="email" required>
                  <UInput v-model="state.email" type="email" placeholder="Enter your email address" size="lg"
                          class="w-full" />
                </UFormField>

                <UFormField label="Mobile number" name="phone">
                  <UFieldGroup>
                    <USelectMenu v-model="countryCode" :items="phoneCodes" value-key="code"
                                 :disabled="selectedRegion === 'India'" :search-input="{
                                  placeholder: 'Search country...',
                                  icon: 'i-lucide-search',
                                  loading: false
                                }" :filter-fields="['name', 'code', 'dialCode']" :content="{ align: 'start' }" :ui="{
                                  base: 'pe-8',
                                  content: 'w-48',
                                  placeholder: 'hidden',
                                  trailingIcon: 'size-4'
                                }" trailing-icon="i-lucide-chevrons-up-down" @update:open="onOpen">
                      <span class="size-5 flex items-center text-lg">
                        {{ country?.emoji || '\u{1F1EE}\u{1F1F3}' }}
                      </span>

                      <template #item-leading="{ item }">
                        <span class="size-5 flex items-center text-lg">
                          {{ item.emoji }}
                        </span>
                      </template>

<template #item-label="{ item }">
                        {{ item.name }} ({{ item.dialCode }})
                      </template>
</USelectMenu>

<UInput v-model="phone" v-maska="mask" :placeholder="mask.replaceAll('#', '_')" size="lg" class="w-full"
  :style="{ '--dial-code-length': `${dialCode.length + 1.5}ch` }" :ui="{
                              base: 'ps-(--dial-code-length)',
                              leading: 'pointer-events-none text-base text-white/55'
                            }">
  <template #leading>
                        {{ dialCode }}
                      </template>
</UInput>
</UFieldGroup>
</UFormField> -->
							</div>
						</article>

						<article class="p-4 sm:p-5">
							<div class="mb-4 flex items-start gap-3">
								<div
									class="inline-flex p-2 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
									<Icon
										name="material-symbols:calendar-month"
										class="text-2xl text-(--gg-accent)" />
								</div>
								<div>
									<h3 class="text-2xl! font-semibold text-white">
										Birth Details
									</h3>
									<p class="text-sm text-white/70">
										Please provide the birth information of the person.
									</p>
								</div>
							</div>

							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField
									label="Date of birth (MM:DD:YYYY)"
									name="dateOfBirth"
									required>
									<UInputDate
										ref="inputDate"
										v-model="state.dateOfBirth"
										class="w-full"
										:disabled="!user">
										<template #trailing>
											<UPopover :reference="inputDate?.inputsRef[3]?.$el">
												<UButton
													color="neutral"
													variant="link"
													size="sm"
													icon="i-lucide-calendar"
													aria-label="Select a date"
													class="px-0" />

												<template #content>
													<UCalendar v-model="state.dateOfBirth" class="p-2" />
												</template>
											</UPopover>
										</template>
									</UInputDate>
								</UFormField>

								<UFormField
									label="Time of birth (HH:MM:SS, 24-hour format)"
									name="timeOfBirth"
									required>
									<UInputTime
										v-model="state.timeOfBirth"
										type="time"
										:hour-cycle="24"
										granularity="second"
										:disabled="!user" />
								</UFormField>

								<UFormField label="Birth location" name="location" required>
									<UInput
										v-model="state.location"
										placeholder="City, state, and country"
										size="lg"
										class="w-full"
										:disabled="!user" />
								</UFormField>

								<UFormField label="Birth Place Zipcode" name="zipcode" required>
									<UInput
										v-model="state.zipcode"
										placeholder="Birth location zipcode"
										size="lg"
										class="w-full"
										:disabled="!user" />
								</UFormField>

								<UFormField
									label="Birth time accuracy"
									name="accuracy"
									required
									class="sm:col-span-2">
									<USelectMenu
										v-model="state.accuracy"
										:items="
											Object.entries(accuracyOptions).map(([value, label]) => ({
												value,
												label,
											}))
										"
										value-key="value"
										class="w-full"
										size="lg"
										placeholder="Choose birth time accuracy"
										:disabled="!user" />
									<p class="mt-1 text-xs text-white/60">
										This helps us understand how accurate your birth time is.
									</p>
								</UFormField>
								<UFormField
									label="Gender of the person"
									name="gender"
									required
									class="sm:col-span-2">
									<USelectMenu
										v-model="state.gender"
										:items="
											Object.entries(genderOptions).map(([value, label]) => ({
												value,
												label,
											}))
										"
										value-key="value"
										class="w-full"
										size="lg"
										placeholder="Choose gender"
										:disabled="!user" />
								</UFormField>
								<UFormField
									label="Custom Gender"
									v-if="state.gender === 'other'"
									name="customGender"
									required
									class="sm:col-span-2">
									<UInput
										v-model="state.customGender"
										placeholder="Enter your custom gender"
										size="lg"
										class="w-full"
										maxlength="20"
										:disabled="!user" />
								</UFormField>
							</div>
						</article>

						<article class="p-4 sm:p-5">
							<div class="mb-4 flex items-start gap-3">
								<div
									class="inline-flex p-2 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
									<Icon
										name="material-symbols:question-mark"
										class="text-2xl text-(--gg-accent)" />
								</div>
								<div>
									<h3 class="text-2xl! font-semibold text-white">
										Your Question
									</h3>
									<p class="text-sm text-white/70">
										Ask the questions you want to be answered in the
										consultation report.
									</p>
								</div>
							</div>

							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField
									label="Share anything you want to address in the consultation"
									name="message"
									class="sm:col-span-2">
									<UTextarea
										v-model="state.message"
										placeholder="Write your question here..."
										class="w-full"
										:rows="5"
										maxlength="500"
										:disabled="!user" />
								</UFormField>
							</div>
						</article>

						<div
							class="rounded-2xl border border-white/15 bg-black/20 p-4 text-sm text-white/70">
							Your information is reviewed privately and used only for this
							initiative. You may submit a maximum of
							<strong class="text-white/90">2 applications</strong>.
						</div>

						<UButton
							type="submit"
							class="button w-full justify-center text-base font-semibold"
							size="xl"
							icon="i-lucide-send"
							:loading="submitting"
							:disabled="!user">
							Submit Application
						</UButton>
					</UForm>
				</section>

				<aside class="space-y-4">
					<article
						class="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
						<h3 class="text-2xl! font-semibold text-(--gg-text-main)">
							About This Initiative
						</h3>
						<hr class="my-2 border-white/10" />
						<h4>Medical Astrology Community Initiative.</h4>
						<p class="mt-3 text-sm leading-6 text-white/75">
							We are currently accepting applications for our complimentary
							medical astrology review program. Selected applicants may receive
							astrological insights as part of this limited outreach program.
						</p>

						<Icon
							name="material-symbols:groups"
							class="mt-3 text-4xl text-(--gg-accent)" />

						<h4>Why this Initiative?</h4>
						<p class="mt-2 text-sm leading-6 text-white/75">
							Our goal is to contribute to astrological research and support
							individuals through meaningful guidance.
						</p>
					</article>

					<article
						class="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
						<h3 class="text-2xl! font-semibold text-(--gg-text-main)">
							Important Notes
						</h3>
						<ul class="mt-3 space-y-3 text-md leading-6 text-white/75">
							<li class="flex items-start gap-2">
								<UIcon
									name="material-symbols:check-circle"
									class="mt-0.5 text-xl shrink-0 text-(--gg-accent)" />
								Applications are reviewed individually.
							</li>
							<li class="flex items-start gap-2">
								<UIcon
									name="material-symbols:check-circle"
									class="mt-0.5 text-xl shrink-0 text-(--gg-accent)" />
								Not every application will be selected for the initiative.
							</li>
							<li class="flex items-start gap-2">
								<UIcon
									name="material-symbols:check-circle"
									class="mt-0.5 text-xl shrink-0 text-(--gg-accent)" />
								Submitting this form does not guarantee selection.
							</li>
							<li class="flex items-start gap-2">
								<UIcon
									name="material-symbols:check-circle"
									class="mt-0.5 text-xl shrink-0 text-(--gg-accent)" />
								Responses may take several days depending on the number of
								applications.
							</li>
							<li class="flex items-start gap-2">
								<UIcon
									name="material-symbols:check-circle"
									class="mt-0.5 text-xl shrink-0 text-(--gg-accent)" />
								This is not a substitute for professional medical advice. Please
								consult a qualified healthcare provider for any medical
								concerns.
							</li>
						</ul>
					</article>

					<article
						class="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
						<h3
							class="text-2xl! font-semibold text-(--gg-text-main) border-b border-white/10 pb-2">
							Need a Comprehensive Consultation?
						</h3>
						<p class="mt-3 text-md leading-6 text-white/75">
							Explore our professional consultations for in-depth astrological
							insights and personalized guidance. Our expert astrologers provide
							detailed reports and recommendations tailored to your unique birth
							chart.
						</p>
						<NuxtLink
							to="/consultation"
							class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-(--gg-text-main) hover:text-(--gg-text-main)/80 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors">
							<span>View consultations</span>
							<UIcon name="i-lucide-arrow-right" class="size-4" />
						</NuxtLink>
					</article>
				</aside>
			</div>

			<section
				class="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 my-0!">
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<div class="flex items-start gap-3">
						<div
							class="inline-flex p-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon
								name="material-symbols:shield-outline"
								class="text-3xl text-(--gg-accent)" />
						</div>
						<div>
							<p class="text-xl font-semibold text-white">
								Your privacy matters
							</p>
							<p class="mt-1 text-sm leading-5 text-white/65">
								We respect your privacy and ensure your data is protected with
								the highest security standards.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="inline-flex p-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon
								name="material-symbols:lock-outline"
								class="text-3xl text-(--gg-accent)" />
						</div>
						<div>
							<p class="text-xl font-semibold text-white">Secure submission</p>
							<p class="mt-1 text-sm leading-5 text-white/65">
								Your data is encrypted and secure.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="inline-flex p-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon
								name="material-symbols:visibility-off-outline"
								class="text-3xl text-(--gg-accent)" />
						</div>
						<div>
							<p class="text-xl font-semibold text-white">Confidential</p>
							<p class="mt-1 text-sm leading-5 text-white/65">
								We never share your information.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div
							class="inline-flex p-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
							<Icon
								name="material-symbols:verified-outline"
								class="text-3xl text-(--gg-accent)" />
						</div>
						<div>
							<p class="text-xl font-semibold text-white">Trusted platform</p>
							<p class="mt-1 text-sm leading-5 text-white/65">
								Galactic Gene is committed to your privacy.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import {
	CalendarDate,
	Time,
	today,
	getLocalTimeZone,
} from "@internationalized/date";
import type { ShallowRef } from "vue";
import { vMaska } from "maska/vue";

type PhoneCode = {
	name: string;
	code: string;
	emoji: string;
	dialCode: string;
	mask: string;
};

type InitiativeForm = {
	fullName: string;
	dateOfBirth: ShallowRef<CalendarDate>;
	timeOfBirth: ShallowRef<Time>;
	location: string;
	zipcode: string;
	gender: "male" | "female" | "lgtbqa+" | "other";
	customGender: string; // ← new
	accuracy: "high" | "medium" | "low";
	message: string;
};

const toast = useToast();
const submitting = ref(false);
const inputDate = useTemplateRef("inputDate");
const user = useSupabaseUser();

const phone = ref("");
const countryCode = ref("IN");

const { selectedRegion } = useRegionSelection();

const { data: phoneCodes, execute } = await useLazyFetch<PhoneCode[]>(
	"/api/phone-codes",
	{
		key: "initiative-phone-codes",
		immediate: false,
	},
);

const country = computed(() =>
	phoneCodes.value?.find((c) => c.code === countryCode.value),
);
const dialCode = computed(() => country.value?.dialCode || "+91");
const mask = computed(() => country.value?.mask || "#####-#####");

const accuracyOptions = {
	high: "Highly accurate - Within a minute",
	medium: "Moderately accurate - Off by ~15-30 minutes",
	low: "Not accurate - Off by >30 minutes",
};

const now = new Date();

const consultationCategories = {
	medical: {
		label: "Medical Consultation",
		description: "Insights into health and wellness based on your birth chart.",
		subCategories: [
			{
				category: "General Categories",
				options: [
					{
						value: "general-health-wellness",
						label: "General Health & Wellness",
					},
					{ value: "chronic-illness", label: "Chronic Illness" },
					{ value: "acute-illness", label: "Acute Illness" },
					{ value: "undiagnosed-symptoms", label: "Undiagnosed Symptoms" },
					{
						value: "multiple-health-concerns",
						label: "Multiple Health Concerns",
					},
				],
			},

			{
				category: "Body Systems",
				options: [
					{ value: "nervous-system", label: "Nervous System" },
					{ value: "digestive-system", label: "Digestive System" },
					{ value: "respiratory", label: "Respiratory (Breathing)" },
					{
						value: "cardiovascular",
						label: "Cardiovascular (Heart & Blood Vessels)",
					},
					{ value: "endocrine-hormonal", label: "Endocrine & Hormonal" },
					{ value: "immune-system", label: "Immune System" },
					{ value: "lymphatic-system", label: "Lymphatic System" },
					{ value: "blood-disorders", label: "Blood Disorders" },
					{ value: "urinary-kidney", label: "Urinary & Kidney" },
					{ value: "liver-gallbladder", label: "Liver & Gallbladder" },
					{ value: "reproductive-health", label: "Reproductive Health" },
					{
						value: "musculoskeletal",
						label: "Musculoskeletal (Bones, Muscles & Joints)",
					},
					{ value: "skin-hair-nails", label: "Skin, Hair & Nails" },
					{ value: "eye-vision", label: "Eye & Vision" },
					{ value: "ear-hearing", label: "Ear & Hearing" },
					{ value: "ent", label: "Nose, Sinus & Throat (ENT)" },
					{ value: "dental-oral-health", label: "Dental & Oral Health" },
				],
			},

			{
				category: "Specialized Conditions",
				options: [
					{
						value: "blood-pressure",
						label: "Blood Pressure (Hypertension / Hypotension)",
					},
					{ value: "diabetes", label: "Diabetes" },
					{ value: "thyroid-disorders", label: "Thyroid Disorders" },
					{ value: "cancer-oncology", label: "Cancer & Oncology" },
					{ value: "autoimmune-disorders", label: "Autoimmune Disorders" },
					{
						value: "genetic-congenital",
						label: "Genetic / Congenital Conditions",
					},
					{ value: "infectious-diseases", label: "Infectious Diseases" },
					{ value: "allergies", label: "Allergies" },
					{ value: "neurological-disorders", label: "Neurological Disorders" },
					{ value: "mental-emotional", label: "Mental & Emotional Well-being" },
					{ value: "sleep-disorders", label: "Sleep Disorders" },
					{ value: "pain-management", label: "Pain Management" },
					{ value: "weight-metabolism", label: "Weight & Metabolism" },
				],
			},

			{
				category: "Medical Events",
				options: [
					{ value: "surgery-recovery", label: "Surgery & Recovery" },
					{ value: "hospitalization", label: "Hospitalization" },
					{ value: "coma-critical-care", label: "Coma / Critical Care" },
					{ value: "injury-trauma", label: "Injury / Trauma" },
					{ value: "fractures", label: "Fractures" },
					{
						value: "rehabilitation-physiotherapy",
						label: "Rehabilitation / Physiotherapy",
					},
				],
			},

			{
				category: "Women's Health",
				options: [
					{ value: "pregnancy", label: "Pregnancy" },
					{ value: "fertility", label: "Fertility" },
					{ value: "menstrual-health", label: "Menstrual Health" },
					{ value: "menopause", label: "Menopause" },
				],
			},

			{
				category: "Men's Health",
				options: [
					{ value: "male-fertility", label: "Male Fertility" },
					{ value: "prostate-health", label: "Prostate Health" },
					{ value: "sexual-health", label: "Sexual Health" },
				],
			},

			{
				category: "Children's Health",
				options: [
					{ value: "child-development", label: "Child Development" },
					{ value: "pediatric-health", label: "Pediatric Health" },
				],
			},

			{
				category: "Other",
				options: [
					{
						value: "lifestyle-related-concerns",
						label: "Lifestyle-Related Concerns",
					},
					{ value: "preventive-health", label: "Preventive Health" },
					{ value: "second-opinion", label: "Second Opinion" },
					{ value: "other", label: "Other (Please Specify)" },
				],
			},
		],
	},
};

const genderOptions = {
	female: "Female",
	male: "Male",
	lgtbqa: "LGBTQA+",
	other: "Other",
};

const state = reactive<InitiativeForm>({
	fullName: "",
	gender: "",
	customGender: "", // ← new
	dateOfBirth: shallowRef(
		new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
	),
	timeOfBirth: shallowRef(
		new Time(now.getHours(), now.getMinutes(), now.getSeconds()),
	),
	location: "",
	zipcode: "",
	accuracy: "high",
	message: "",
});

function onOpen() {
	if (!phoneCodes.value?.length) execute();
}

watch(countryCode, () => {
	phone.value = "";
});

// watch([phone, dialCode], () => {
//   state.phone = dialCode.value + phone.value
// })

const validate = (formState: Partial<InitiativeForm>): FormError[] => {
	const errors: FormError[] = [];

	if (!formState.fullName) {
		errors.push({ name: "fullName", message: "Name is required." });
	}

	// if (!formState.email) {
	//   errors.push({ name: 'email', message: 'Email address is required.' })
	// } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
	//   errors.push({ name: 'email', message: 'Enter a valid email address.' })
	// }

	if (formState.gender === "other" && !formState.customGender) {
		errors.push({
			name: "customGender",
			message: "Please specify your gender.",
		});
	}

	if (!formState.dateOfBirth) {
		errors.push({ name: "dateOfBirth", message: "Date of birth is required." });
	}

	if (!formState.timeOfBirth) {
		errors.push({ name: "timeOfBirth", message: "Time of birth is required." });
	}

	if (!formState.location) {
		errors.push({ name: "location", message: "Birth location is required." });
	}

	if (!formState.zipcode) {
		errors.push({ name: "zipcode", message: "Zipcode is required." });
	}

	if (!formState.message) {
		errors.push({
			name: "message",
			message: "Please add your query for the consultation.",
		});
	}

	return errors;
};

const resetState = () => {
	const current = new Date();
	state.fullName = "";
	// state.email = ''
	// state.phone = dialCode.value
	// phone.value = ''
	state.dateOfBirth = shallowRef(
		new CalendarDate(
			current.getFullYear(),
			current.getMonth() + 1,
			current.getDate(),
		),
	);
	state.timeOfBirth = shallowRef(
		new Time(current.getHours(), current.getMinutes(), current.getSeconds()),
	);
	state.location = "";
	state.zipcode = "";
	state.gender = "";
	state.customGender = "";
	state.accuracy = "high";
	state.message = "";
};

const handleSubmit = async (_event: FormSubmitEvent<InitiativeForm>) => {
	if (!user.value) {
		toast.add({
			title: "Login required",
			description: "Please log in to submit an application.",
			color: "warning",
			icon: "i-lucide-alert-circle",
		});
		return;
	}

	submitting.value = true;

	try {
		await $fetch("/api/free-consultation/submit", {
			method: "POST",
			body: {
				fullName: state.fullName,
				dateOfBirth: serializeCalendarDate(state.dateOfBirth),
				timeOfBirth: serializeTime(state.timeOfBirth),
				location: state.location,
				zipcode: state.zipcode,
				accuracy: state.accuracy,
				gender: state.gender === "other" ? state.customGender : state.gender,
				message: state.message,
			},
		});

		toast.add({
			title: "Application submitted",
			description:
				"Thank you. We will review your response and get back to you soon.",
			color: "success",
			icon: "i-lucide-check-circle-2",
		});

		resetState();
	} catch (error: any) {
		const message =
			error?.data?.statusMessage || error?.message || "Please try again later.";
		toast.add({
			title: "Submission failed",
			description: message,
			color: "error",
			icon: "i-lucide-alert-circle",
		});
	} finally {
		submitting.value = false;
	}
};
</script>

<style scoped>
header {
	/* position: relative;
	background-image:
		linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.85)),
		url("@/assets/images/astro_vector_bg.jpg");
	background-size: cover;
	background-position: center; */
}
</style>
