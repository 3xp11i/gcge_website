<template>
  <div class="flex min-h-screen w-full flex-col overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
    <div
         class="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />

    <!-- Birth Details Modal -->
    <UModal v-model:open="birthDetailsOpen"
    @close:prevent="closeBirthDetailsModal"
            title="Share birth details"
            description="Fill in the person's details. This information is needed for your consultation."
            scrollable>
      <template #body>
        <BirthDetailsForm :key="formKey"
                          :loading="birthDetailsLoading"
                          submit-label="Continue to Payment"
                          @submit="handleBirthDetailsSubmit"
                          @cancel="closeBirthDetailsModal" />
      </template>
    </UModal>

    <section class="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10">


      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <!-- Header banner image -->
         <img src="@/assets/images/consultations_banner.png" alt="Consultation banner" class="mx-auto w-full max-h-44 rounded-3xl border border-white/10 bg-black/20 shadow-2xl shadow-black/20 backdrop-blur-sm object-cover" />
        <h1 class="text-4xl! leading-tight sm:text-5xl! lg:text-6xl!">
          Our Services
        </h1>
        <p class="max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
          Click Book Consultation and complete the consultation form. Once submitted, you'll be redirected to the
          payment page. After your payment is confirmed, we'll contact you via your email or Instagram (if provided)
          within 24 hours.

          No need to worry about scheduling, we'll personally coordinate a convenient consultation date and time with you
          through email or Instagram.
        </p>
      </div>


      <div
           class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 max-w-full">


        <UTabs :items="consultationTabs"
               variant="link"
               color="neutral"
               class="mt-2 w-full mb-1 gap-8">
          <template #personal-relationships>
            <div class="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in personalRelationshipServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                    <p class="mt-1 text-xl! font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-[rgb(225,174,47)]">
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

                <RazorpayCheckoutButton v-if="selectedRegion === 'India'"
                                        class="mt-6"
                                        :amount-paise="service.amountPaise"
                                        :description="service.title"
                                        :receipt="service.receipt"
                                        :label="service.ctaLabel"
                                        :birth-details="birthDetails"
                                        :active-receipt="activeReceipt"
                                        @need-details="handleCheckoutClick(service.receipt)"
                                        @checkout-started="handleCheckoutStarted"
                                        @payment-success="handlePaymentSuccess"
                                        @payment-dismissed="handlePaymentDismissed" />
                <DodoCheckoutButton v-else
                                    class="mt-6"
                                    :amount-usd="parseFloat(service.priceUsd.replace(/[^\d.]/g, ''))"
                                    :description="service.title"
                                    :receipt="service.receipt"
                                    :dodo-product-id="service.dodoProductID"
                                    :label="service.ctaLabel"
                                    :birth-details="birthDetails"
                                    :active-receipt="activeReceipt"
                                    @need-details="handleCheckoutClick(service.receipt)"
                                    @checkout-started="handleCheckoutStarted" />
              </article>
            </div>
          </template>

          <template #career-business>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in careerBusinessServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                    <p class="mt-1 text-xl! font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-[rgb(225,174,47)]">
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

                <RazorpayCheckoutButton v-if="selectedRegion === 'India'"
                                        class="mt-6"
                                        :amount-paise="service.amountPaise"
                                        :description="service.title"
                                        :receipt="service.receipt"
                                        :label="service.ctaLabel"
                                        :birth-details="birthDetails"
                                        :active-receipt="activeReceipt"
                                        @need-details="handleCheckoutClick(service.receipt)"
                                        @checkout-started="handleCheckoutStarted"
                                        @payment-success="handlePaymentSuccess"
                                        @payment-dismissed="handlePaymentDismissed" />
                <DodoCheckoutButton v-else
                                    class="mt-6"
                                    :amount-usd="parseFloat(service.priceUsd.replace(/[^\d.]/g, ''))"
                                    :description="service.title"
                                    :receipt="service.receipt"
                                    :dodo-product-id="service.dodoProductID"
                                    :label="service.ctaLabel"
                                    :birth-details="birthDetails"
                                    :active-receipt="activeReceipt"
                                    @need-details="handleCheckoutClick(service.receipt)"
                                    @checkout-started="handleCheckoutStarted" />
              </article>
            </div>
          </template>

          <template #other-services>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in otherServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                    <p class="mt-1 text-xl! font-semibold text-white">
                      {{ getDisplayedPrice(service) }}
                    </p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-[rgb(225,174,47)]">
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

                <RazorpayCheckoutButton v-if="selectedRegion === 'India'"
                                        class="mt-6"
                                        :amount-paise="service.amountPaise"
                                        :description="service.title"
                                        :receipt="service.receipt"
                                        :label="service.ctaLabel"
                                        :birth-details="birthDetails"
                                        :active-receipt="activeReceipt"
                                        @need-details="handleCheckoutClick(service.receipt)"
                                        @checkout-started="handleCheckoutStarted"
                                        @payment-success="handlePaymentSuccess"
                                        @payment-dismissed="handlePaymentDismissed" />
                <DodoCheckoutButton v-else
                                    class="mt-6"
                                    :amount-usd="parseFloat(service.priceUsd.replace(/[^\d.]/g, ''))"
                                    :description="service.title"
                                    :receipt="service.receipt"
                                    :dodo-product-id="service.dodoProductID"
                                    :label="service.ctaLabel"
                                    :birth-details="birthDetails"
                                    :active-receipt="activeReceipt"
                                    @need-details="handleCheckoutClick(service.receipt)"
                                    @checkout-started="handleCheckoutStarted" />
              </article>
            </div>
          </template>
        </UTabs>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article
                 class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h2 class="text-3xl sm:text-4xl">Consultation Details</h2>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div v-for="detail in consultationDetails"
                 :key="detail.title"
                 class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-lg font-semibold text-[rgb(225,174,47)]">{{ detail.title }}</p>
              <p class="mt-2 text-sm leading-6 text-white/70">{{ detail.copy }}</p>
            </div>
          </div>

          <div
               class="mt-6 rounded-2xl border border-[rgb(225,174,47)]/25 bg-[rgb(225,174,47)]/10 p-4 text-sm leading-6 text-white/80">
            <p class="font-semibold text-[rgb(225,174,47)]">Important note</p>
            <p class="mt-2">
              All of these consultations are for one horoscope only and are individually reviewed. Remedies will be
              provided
              where needed.
            </p>
          </div>
        </article>

        <article
                 class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h2 class="text-3xl sm:text-4xl">Contact Us</h2>
          <p class="mt-4 text-sm leading-6 text-white/70">
            Reach out directly for support, booking help, and consultation-related questions.
          </p>

          <div class="mt-6 space-y-4">
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Phone</p>
              <a href="tel:+917678698072"
                 class="mt-2 inline-block text-lg font-semibold text-[rgb(225,174,47)] transition hover:text-[rgb(235,194,90)]">
                +91 7678698072
              </a>
            </div>

            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Email</p>
              <a href="mailto:consultations@galacticgene.com"
                 class="mt-2 inline-block text-lg font-semibold text-[rgb(225,174,47)] transition hover:text-[rgb(235,194,90)]">
                consultations@galacticgene.com
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
import type { BirthDetails } from '~/components/birth-details-form.vue'

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
  dodoProductID?: string
}

type ConsultationDetail = {
  title: string
  copy: string
}

const { selectedRegion, initRegion } = useRegionSelection()

const personalRelationshipServices: ConsultationService[] = [
  {
    kicker: 'Relationship life guidance',
    title: 'Relationship consultation',
    priceInr: '₹5,100',
    priceUsd: '$60',
    badge: '30 mins',
    description: 'This consultation is focused on relationship guidance, compatibility, and understanding the dynamics of the relationship.',
    includes: '30 minutes for one horoscope, individually reviewed.',
    amountPaise: 510000,
    receipt: 'relationship-consultation',
    ctaLabel: 'Book Relationship Consultation',
    category: 'Personal & Relationships',
    dodoProductID: 'pdt_0NifmXPQ0wgrs7sfPOHtT'
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
    category: 'Personal & Relationships',
    dodoProductID: 'pdt_0Nifo2LAvDWRAazs4XpHB'
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
    category: 'Personal & Relationships',
    dodoProductID: 'pdt_0Nifq3eBI1gYiPOgZ41LD'
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
    category: 'Career & Business',
    dodoProductID: 'pdt_0Nifn35LmCYTBU9e9QUcf'
  },
  {
    // Logo Designing package
    kicker: 'Design focus',
    title: 'Logo Designing',
    priceInr: '₹21,100',
    priceUsd: '$220',
    badge: '30 mins',
    description: 'Professional logo design services for businesses and personal brands.',
    includes: '30 minutes for one horoscope, individually reviewed.',
    amountPaise: 2100000,
    receipt: 'logo-designing-consultation',
    ctaLabel: 'Book Logo Designing Consultation',
    category: 'Career & Business',
    dodoProductID: 'pdt_0NikaCuFP49yGzjsWdQuU'
  }
]

const otherServices: ConsultationService[] = [
  {
    kicker: 'Event timing',
    title: 'Auspicious time / muhurat',
    priceInr: 'From ₹3,000',
    priceUsd: 'From $35',
    badge: 'Per event',
    description: 'For selecting an auspicious time for important events and occasions. This includes product launches, engagements, housewarmings, and other significant events.',
    includes: 'Pricing starts from ₹3,000 per event.',
    amountPaise: 300000,
    receipt: 'muhurat-consultation',
    ctaLabel: 'Book Muhurat Consultation',
    category: 'Other Services',
    dodoProductID: 'pdt_0NifpgQ602a1fBWWw5FhQ'
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
    category: 'Other Services',
    dodoProductID: 'pdt_0NifpwfBeMjuROhFO4qjs'
  },
  {
    kicker: '',
    title: 'Property & Real Estate',
    priceInr: '₹11,000',
    priceUsd: '$129',
    badge: '50 mins',
    description: 'Discussion of which property to buy or sell, and the best time to do so. We include commercial activities as well as residential activities.',
    includes: '50 minutes of focused discussion, with remedies provided when necessary.',
    amountPaise: 1100000,
    receipt: 'property-real-estate-consultation',
    ctaLabel: 'Book Property & Real Estate Consultation',
    category: 'Other Services',
    dodoProductID: 'pdt_0NiilwGMQfzEqzbdxkeMt'
  }
]

const consultationTabs = [
  {
    label: 'Personal & Relationships',
    slot: 'personal-relationships',
    // badge: personalRelationshipServices.length
  },
  {
    label: 'Career & Business',
    slot: 'career-business',
    // badge: careerBusinessServices.length
  },
  {
    label: 'Other Services',
    slot: 'other-services',
    // badge: otherServices.length
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

// Birth details state management
const birthDetailsOpen = ref(false)
const birthDetailsLoading = ref(false)
const birthDetails = ref<BirthDetails | null>(null)
const activeReceipt = ref<string | null>(null)
const formKey = ref(0)

const handleCheckoutClick = (receipt: string) => {
  // Clear any previously submitted details so checkout starts only after fresh form submit.
  birthDetails.value = null
  activeReceipt.value = receipt
  birthDetailsOpen.value = true
}

const closeBirthDetailsModal = () => {
  birthDetailsOpen.value = false
  birthDetails.value = null
  activeReceipt.value = null
  formKey.value++
}

const handleBirthDetailsSubmit = (details: BirthDetails) => {
  birthDetails.value = details
  birthDetailsOpen.value = false
}

// Reset activeReceipt immediately so the watcher cannot re-fire
const handleCheckoutStarted = () => {
  activeReceipt.value = null
}

// Full reset + form remount after successful payment
const handlePaymentSuccess = () => {
  birthDetails.value = null
  activeReceipt.value = null
  formKey.value++
  window.location.reload()
}

// Keep birthDetails for retry (user doesn't have to re-fill the form)
const handlePaymentDismissed = () => {
  activeReceipt.value = null
}

onMounted(() => {
  initRegion()
})


</script>

<style scoped>


</style>