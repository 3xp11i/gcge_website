<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
    <div class="bg_art pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />

    <section class="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10">
      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <h1 class="text-4xl! leading-tight sm:text-5xl! lg:text-6xl!">
          Consultation Packages
        </h1>
        <p class="max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
          Choose the consultation that matches your concern. Every session is individually reviewed for one horoscope only, and remedies are provided when necessary. The consultation can either be conducted by voice, video call, or text depending on your preference.
        </p>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 max-w-full">
        <div class="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <!-- <p class="text-sm uppercase tracking-[0.28em] text-white/45">
              Browse by category
            </p> -->
            <!-- <h2 class="mt-2 text-3xl sm:text-4xl">
              Consultation categories
            </h2> -->
            <!-- <p class="mt-3 text-sm leading-6 text-white/70 sm:text-base">
              Pick a region once, then switch between consultation categories using the tabs below.
            </p> -->
          </div>

          <div class="w-full max-w-sm">
            <p class="mb-2 text-xs uppercase tracking-[0.24em] text-white/45">
              Region
            </p>
            <USelectMenu
              v-model="selectedRegion"
              :items="regionOptions"
              color="neutral"
              variant="subtle"
              trailing-icon="i-lucide-chevron-down"
              class="w-full"
            />
          </div>
        </div>

        <UTabs
          :items="consultationTabs"
          variant="pill"
          color="neutral"
          class="mt-6 w-full mb-10"
        >
          <template #personal-relationships>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="service in personalRelationshipServices"
                :key="service.title"
                class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm"
              >
                <div class="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-white/45">
                      {{ service.kicker }}
                    </p>
                    <h3 class="mt-2 text-xl! font-semibold text-white sm:text-xl!">
                      {{ service.title }}
                    </h3>
                  </div>
                </div>

                <div class="mb-5 flex flex-wrap items-end gap-3">
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      {{ regionPriceLabel }}
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-[rgb(225,174,47)]">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <RazorpayCheckoutButton
                  class="mt-6"
                  :amount-paise="service.amountPaise"
                  :description="service.title"
                  :receipt="service.receipt"
                  :label="service.ctaLabel"
                  :is-international="selectedRegion === 'International'"
                />
              </article>
            </div>
          </template>

          <template #career-business>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="service in careerBusinessServices"
                :key="service.title"
                class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm"
              >
                <div class="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-white/45">
                      {{ service.kicker }}
                    </p>
                    <h3 class="mt-2 text-xl! font-semibold text-white sm:text-xl!">
                      {{ service.title }}
                    </h3>
                  </div>
                </div>

                <div class="mb-5 flex flex-wrap items-end gap-3">
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      {{ regionPriceLabel }}
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-[rgb(225,174,47)]">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <RazorpayCheckoutButton
                  class="mt-6"
                  :amount-paise="service.amountPaise"
                  :description="service.title"
                  :receipt="service.receipt"
                  :label="service.ctaLabel"
                  :is-international="selectedRegion === 'International'"
                />
              </article>
            </div>
          </template>

          <template #other-services>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="service in otherServices"
                :key="service.title"
                class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm"
              >
                <div class="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm uppercase tracking-[0.28em] text-white/45">
                      {{ service.kicker }}
                    </p>
                    <h3 class="mt-2 text-xl! font-semibold text-white sm:text-xl!">
                      {{ service.title }}
                    </h3>
                  </div>
                </div>

                <div class="mb-5 flex flex-wrap items-end gap-3">
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      {{ regionPriceLabel }}
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-[rgb(225,174,47)]">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <RazorpayCheckoutButton
                  class="mt-6"
                  :amount-paise="service.amountPaise"
                  :description="service.title"
                  :receipt="service.receipt"
                  :label="service.ctaLabel"
                  :is-international="selectedRegion === 'International'"
                />
              </article>
            </div>
          </template>
        </UTabs>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h2 class="text-3xl sm:text-4xl">Consultation Details</h2>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div
              v-for="detail in consultationDetails"
              :key="detail.title"
              class="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p class="text-lg font-semibold text-[rgb(225,174,47)]">{{ detail.title }}</p>
              <p class="mt-2 text-sm leading-6 text-white/70">{{ detail.copy }}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-[rgb(225,174,47)]/25 bg-[rgb(225,174,47)]/10 p-4 text-sm leading-6 text-white/80">
            <p class="font-semibold text-[rgb(225,174,47)]">Important note</p>
            <p class="mt-2">
              All of these consultations are for one horoscope only and are individually reviewed. Remedies will be provided where needed.
            </p>
          </div>
        </article>

        <article class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h2 class="text-3xl sm:text-4xl">Contact Us</h2>
          <p class="mt-4 text-sm leading-6 text-white/70">
            Reach out directly for support, booking help, and consultation-related questions.
          </p>

          <div class="mt-6 space-y-4">
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Phone</p>
              <a href="tel:+917678698072" class="mt-2 inline-block text-lg font-semibold text-[rgb(225,174,47)] transition hover:text-[rgb(235,194,90)]">
                +91 7678698072
              </a>
            </div>

            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Email</p>
              <a href="mailto:support@galacticgene.com" class="mt-2 inline-block text-lg font-semibold text-[rgb(225,174,47)] transition hover:text-[rgb(235,194,90)]">
                support@galacticgene.com
              </a>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
            <p class="font-semibold text-white">Consultation format</p>
            <p class="mt-2">
              Sessions can be conducted via voice call, video call, or text, based on your preference.
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Consultation Packages | Galactic Gene',
  meta: [
    {
      name: 'description',
      content: 'Book astrology consultations, gemstone recommendations, muhurat guidance, and Vastu inquiries with Galactic Gene.'
    }
  ]
})

type ConsultationService = {
  kicker: string
  title: string
  priceInr: string
  priceUsd: string
  badge?: string
  description: string
  includes: string
  amountPaise: number
  receipt: string
  ctaLabel: string
  category: string
}

type ConsultationDetail = {
  title: string
  copy: string
}

type RegionOption = 'India' | 'International'

const regionOptions: RegionOption[] = ['India', 'International']
const selectedRegion = ref<RegionOption>('India')

const personalRelationshipServices: ConsultationService[] = [
  {
    kicker: 'Relationship life guidance',
    title: 'Relationship consultation',
    priceInr: '₹5,100',
    priceUsd: '$60',
    badge: '30 mins',
    description: 'For Married or Unmarried couples.',
    includes: '30 minutes for one horoscope, individually reviewed.',
    amountPaise: 510000,
    receipt: 'relationship-consultation',
    ctaLabel: 'Book Relationship Consultation',
    category: 'Personal & Relationships'
  },
  {
    kicker: 'Career focus',
    title: 'Career/Business consultation',
    priceInr: '₹5,100',
    priceUsd: '$60',
    badge: '30 mins',
    description: 'Career-focused guidance for questions about work, progress, direction, and blockages.',
    includes: '30 minutes for one horoscope, individually reviewed.',
    amountPaise: 510000,
    receipt: 'career-consultation',
    ctaLabel: 'Book Career Consultation',
    category: 'Career & Business'
  },
  {
    kicker: 'Core reading',
    title: 'Full consultation',
    priceInr: '₹11,000',
    priceUsd: '$129',
    badge: '50 mins',
    description: 'A deep-dive consultation for a single horoscope where any amount of questions are considered within the session time.',
    includes: '50 minutes of focused discussion, with remedies provided when necessary.',
    amountPaise: 1100000,
    receipt: 'full-consultation',
    ctaLabel: 'Book Full Consultation',
    category: 'Personal & Relationships'
  }
]

const careerBusinessServices: ConsultationService[] = [
  {
    kicker: 'Career focus',
    title: 'Career/Business consultation',
    priceInr: '₹5,100',
    priceUsd: '$60',
    badge: '30 mins',
    description: 'Career-focused guidance for questions about work, progress, direction, and blockages.',
    includes: '30 minutes for one horoscope, individually reviewed.',
    amountPaise: 510000,
    receipt: 'career-consultation',
    ctaLabel: 'Book Career Consultation',
    category: 'Career & Business'
  }
]

const otherServices: ConsultationService[] = [
  {
    kicker: 'Event timing',
    title: 'Auspicious time / muhurat',
    priceInr: 'From ₹3,000',
    priceUsd: 'From $35',
    badge: 'Per event',
    description: 'For selecting an auspicious time for important events and occasions.',
    includes: 'Pricing starts from ₹3,000 per event.',
    amountPaise: 300000,
    receipt: 'muhurat-consultation',
    ctaLabel: 'Book Muhurat Consultation',
    category: 'Other Services'
  },
  {
    kicker: 'Quick guidance',
    title: 'Gemstone recommendation',
    priceInr: '₹3,000',
    priceUsd: '$35',
    badge: '10 mins',
    description: 'A short gemstone guidance session with a dedicated 10 minutes allotted for the recommendation.',
    includes: 'Best suited for a concise, direct recommendation.',
    amountPaise: 300000,
    receipt: 'gemstone-recommendation',
    ctaLabel: 'Book Gemstone Recommendation',
    category: 'Other Services'
  },
  {
    kicker: 'Deep karmic work',
    title: 'Pending karma consultation',
    priceInr: '₹31,000',
    priceUsd: '$365',
    badge: '80 mins',
    description: 'For deeper issues such as why nothing is working at all, long-term health concerns, and repeated family patterns like anxiety.',
    includes: 'Uses tools such as d60, d40, and d45 to review karma from the family lineage.',
    amountPaise: 3100000,
    receipt: 'pending-karma-consultation',
    ctaLabel: 'Book Pending Karma Consultation',
    category: 'Other Services'
  }
]

const consultationTabs = [
  {
    label: 'Personal & Relationships',
    slot: 'personal-relationships',
    badge: personalRelationshipServices.length
  },
  {
    label: 'Career & Business',
    slot: 'career-business',
    badge: careerBusinessServices.length
  },
  {
    label: 'Other Services',
    slot: 'other-services',
    badge: otherServices.length
  }
]

const consultationDetails: ConsultationDetail[] = [
  {
    title: 'One horoscope only',
    copy: 'All consultations are individually reviewed for one horoscope only.'
  },
  {
    title: 'Preferred format',
    copy: 'Sessions can happen over voice, video call, or text based on your preference.'
  },
  {
    title: 'Remedies included',
    copy: 'Necessary consultations include remedies when they are required.'
  },
  {
    title: 'Clear time limits',
    copy: 'Each package is time-bound so you know exactly what to expect before booking.'
  }
]

const regionPriceLabel = computed(() => (selectedRegion.value === 'India' ? 'INR' : 'USD approx.'))

const getDisplayedPrice = (service: ConsultationService) => {
  return selectedRegion.value === 'India' ? service.priceInr : service.priceUsd
}
</script>

<style scoped>
.bg_art {
  background: radial-gradient(circle at center, rgba(225, 174, 47, 0.28), rgba(225, 174, 47, 0.08) 40%, transparent 72%);
}
</style>