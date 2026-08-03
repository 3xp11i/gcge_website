<template>
  <div class="consultation-page flex min-h-screen w-full flex-col overflow-hidden px-4 py-10 sm:px-6 lg:px-8">


    <div
         class="pointer-events-none absolute left-1/2 top-0 h-80 w-80 not-md:w-full -translate-x-1/2 rounded-full opacity-40 blur-3xl" />

    <!-- Payment Success Modal -->
    <UModal v-model:open="showPaymentSuccess" :dismissible="true" class="rounded-2xl" :ui="{ content: 'max-w-sm' }">
      <template #body>
        <div class="flex flex-col items-center gap-6 px-4 py-8 text-center">
          <div class="payment-success-checkmark">
            <svg viewBox="0 0 52 52" class="h-20 w-20">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" stroke="rgb(74,222,128)" stroke-width="2" />
              <path class="checkmark-check" fill="none" stroke="rgb(74,222,128)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16" />
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-semibold">Payment Successful!</h3>
            <p class="mt-2 text-sm leading-6 text-white/70">Your consultation has been booked. You will receive a confirmation on your email shortly.</p>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Birth Details Modal -->
    <UModal v-model:open="purchase.formOpen.value"
            @close:prevent="closeBirthDetailsModal"
            :title="title"
            :description="description"
            class="rounded-2xl"
            :ui="{
              header: 'bg-black/20 rounded-t-2xl py-8',
              title: 'text-3xl! font-semibold font-serif!',
              content: slotBookingFormActive ? 'w-[calc(100vw-2rem)] max-w-3xl' : '',
            }">
      <template #body>
        <BirthDetailsForm :key="formKey"
                          :loading="birthDetailsLoading"
                          :service-duration-minutes="currentService?.durationMinutes"
                          submit-label="Continue to Payment"
                          @submit="handleBirthDetailsSubmit"
                          @cancel="closeBirthDetailsModal"
                          @slotBookingFormActive="val => slotBookingFormActive = val"
                          class="" />
      </template>
    </UModal>

    <section class="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10">


      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <!-- Header banner image -->
        <img src="@/assets/images/consultations_banner.png"
             alt="Consultation banner"
             class="mx-auto w-full max-h-44 rounded-3xl  bg-black/20 shadow-2xl shadow-black/20 backdrop-blur-sm object-cover" />
        <h1 class="text-4xl! leading-tight sm:text-5xl! lg:text-6xl!">
          Our Services
        </h1>
        <p class="max-w-4xl text-base leading-7 text-white/75 sm:text-lg">

          Fill the form with your birth details and book a consultation with your preferred date and time.

          <!-- Click Book Consultation and complete the consultation form. Once submitted, you'll be redirected to the
          payment page. After your payment is confirmed, we'll contact you via your email or Instagram (if provided)
          within 24 hours.

          No need to worry about scheduling, we'll personally coordinate a convenient consultation date and time with
          you
          through email or Instagram. -->
        </p>
      </div>


      <div
           class="rounded-3xl  bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6 max-w-full">


        <UTabs :items="consultationTabs"
               variant="link"
               color="neutral"
               class="mt-2 w-full mb-1 gap-8"
               :ui="{ list: 'flex-col sm:flex-row sm:overflow-x-auto sm:scrollbar-none sm:flex-nowrap' }">
          <template #personal-relationships>
            <div class="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in personalRelationshipServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl  bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      <USkeleton v-if="!regionInitialized" class="h-3 w-12 rounded" />
                      <span v-else>{{ regionPriceLabel }}</span>
                    </p>
                    <p class="mt-1 text-xl! font-semibold text-white">
                      <RegionPrice :inr="service.priceInr" :usd="service.priceUsd" />
                    </p>
                  </div>
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-[rgb(237,178,28)] light:text-gray-800">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl  bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <PurchaseButton :label="service.ctaLabel"
                                :loading="checkout.loading.value && purchase.activeItemId.value === service.receipt"
                                :status-message="purchase.activeItemId.value === service.receipt ? checkout.statusMessage.value : ''"
                                :error-message="purchase.activeItemId.value === service.receipt ? checkout.errorMessage.value : ''"
                                @click="purchase.openForm(service.receipt)" />
              </article>
            </div>
          </template>

          <template #career-business>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in careerBusinessServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl  bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      <USkeleton v-if="!regionInitialized" class="h-3 w-12 rounded" />
                      <span v-else>{{ regionPriceLabel }}</span>
                    </p>
                    <p class="mt-1 text-xl! font-semibold text-white">
                      <RegionPrice :inr="service.priceInr" :usd="service.priceUsd" />
                    </p>
                  </div>
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-[rgb(237,178,28)] light:text-gray-800">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl  bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <PurchaseButton :label="service.ctaLabel"
                                :loading="checkout.loading.value && purchase.activeItemId.value === service.receipt"
                                :status-message="purchase.activeItemId.value === service.receipt ? checkout.statusMessage.value : ''"
                                :error-message="purchase.activeItemId.value === service.receipt ? checkout.errorMessage.value : ''"
                                @click="purchase.openForm(service.receipt)" />
              </article>
            </div>
          </template>

          <template #other-services>
            <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <article v-for="service in otherServices"
                       :key="service.title"
                       class="group flex h-full flex-col rounded-3xl  bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
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
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      <USkeleton v-if="!regionInitialized" class="h-3 w-12 rounded" />
                      <span v-else>{{ regionPriceLabel }}</span>
                    </p>
                    <p class="mt-1 text-xl! font-semibold text-white">
                      <RegionPrice :inr="service.priceInr" :usd="service.priceUsd" />
                    </p>
                  </div>
                  <div class="rounded-2xl  bg-black/30 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                      Session
                    </p>
                    <p class="mt-1 text-2xl! font-semibold text-(--gg-text-main) light:text-gray-800">
                      {{ service.badge || 'Included' }}
                    </p>
                  </div>
                </div>

                <p class="text-sm leading-6 text-white/70">
                  {{ service.description }}
                </p>

                <div class="mt-6 rounded-2xl  bg-black/30 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-white/45">
                    Includes
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/80">
                    {{ service.includes }}
                  </p>
                </div>

                <PurchaseButton :label="service.ctaLabel"
                                :loading="checkout.loading.value && purchase.activeItemId.value === service.receipt"
                                :status-message="purchase.activeItemId.value === service.receipt ? checkout.statusMessage.value : ''"
                                :error-message="purchase.activeItemId.value === service.receipt ? checkout.errorMessage.value : ''"
                                @click="purchase.openForm(service.receipt)" />
              </article>
            </div>
          </template>
        </UTabs>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article
                 class="rounded-3xl  bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h3 class="text-3xl sm:text-4xl">Consultation Details</h3>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div v-for="detail in consultationDetails"
                 :key="detail.title"
                 class="rounded-2xl  bg-black/20 p-4">
              <p class="text-lg font-semibold text-(--gg-text-main)">{{ detail.title }}</p>
              <p class="mt-2 text-sm leading-6 text-white/70">{{ detail.copy }}</p>
            </div>
          </div>

          <div
               class="mt-6 rounded-2xl border border-[rgb(225,174,47)]/25 bg-[rgb(225,174,47)]/10 p-4 text-sm leading-6 text-white/80">
            <p class="font-semibold text-(--gg-text-main)">Important note</p>
            <p class="mt-2">
              All of these consultations are for one horoscope only and are individually reviewed. Remedies will be
              provided
              where needed.
            </p>
          </div>
        </article>

        <article
                 class="rounded-3xl  bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <h3 class="text-3xl sm:text-4xl">Contact Us</h3>
          <p class="mt-4 text-sm leading-6 text-white/70">
            Reach out directly for support, booking help, and consultation-related questions.
          </p>

          <div class="mt-6 space-y-4">
            <div class="rounded-2xl  bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Phone</p>
              <a href="tel:+917678698072"
                 class="mt-2 inline-block text-lg font-semibold text-(--gg-text-main) transition hover:text-[rgb(235,194,90)]">
                +91 7678698072
              </a>
            </div>

            <div class="rounded-2xl  bg-black/20 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-white/45">Email</p>
              <a href="mailto:consultations@galacticgene.com"
                 class="mt-2 inline-block text-lg font-semibold text-(--gg-text-main) transition hover:text-[rgb(235,194,90)]">
                consultations@galacticgene.com
              </a>
            </div>
          </div>

          <div class="mt-6 rounded-2xl  bg-black/20 p-4 text-sm leading-6 text-white/70">
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

type ConsultationDetail = {
  title: string
  copy: string
}

const { selectedRegion, regionInitialized, initRegion } = useRegionSelection()


const purchase = usePurchaseFlow<BirthDetails>()
const checkout = usePaymentCheckout()


const currentService = computed(() =>
  [...personalRelationshipServices, ...careerBusinessServices, ...otherServices]
    .find(s => s.receipt === purchase.activeItemId.value)
)

function handleBirthDetailsSubmit(details: BirthDetails) {
  purchase.submitForm(details)
}

watch(() => [purchase.formData.value, purchase.activeItemId.value] as const, ([details, itemId]) => {
  const service = currentService.value
  if (!details || !itemId || !service) return

  purchase.consumeActiveItem() // guard against refire

  const metadata = {
    fullName: details.fullName,
    email: details.email,
    phone: details.phone,
    dateOfBirth: serializeCalendarDate(details.dateOfBirth),
    timeOfBirth: serializeTime(details.timeOfBirth),
    location: details.location,
    zipcode: details.zipcode,
    consultationMethod: details.consultationMethod,
    instagramUsername: details.instagramUsername,
    accuracy: details.accuracy,
    message: details.message,
    orderType: 'consultation',
    serviceTypeId: service.serviceTypeId,
    slotStart: details.slotStart,
    slotEnd: details.slotEnd,
  }

  if (selectedRegion.value === 'India') {
    checkout.startCheckout({
      provider: 'razorpay',
      amountPaise: service.amountPaise,
      description: service.title,
      receipt: service.receipt,
      customerName: details.fullName,
      customerEmail: details.email,
      metadata,
    })
  } else {
    checkout.startCheckout({
      provider: 'dodo',
      amountUsd: parseFloat(service.priceUsd.replace(/[^\d.]/g, '')),
      description: service.title,
      receipt: service.receipt,
      dodoProductId: getDodoProductId(service),
      customerName: details.fullName,
      customerEmail: details.email,
      metadata,
    })
  }
})


const runtimeConfig = useRuntimeConfig()

const slotBookingFormActive = ref(false)

const title = computed(() => slotBookingFormActive.value ? 'Book your Slot' : 'Share birth details')
const description = computed(() => slotBookingFormActive.value ? 'Select the best slot according to your convenience.' : 'Fill in the person\'s details. This information is needed for your consultation.')


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


const isDodoLiveMode = computed(() => {
  const mode = String(runtimeConfig.public.dodoMode || 'test').toLowerCase()
  return mode === 'live' || mode === 'live_mode'
})

const getDodoProductId = (service: ConsultationService) => {
  return isDodoLiveMode.value
    ? service.dodoProductIDLive || service.dodoProductID
    : service.dodoProductID
}

// Payment success modal
const route = useRoute()
const showPaymentSuccess = ref(false)

// Birth details state management
const birthDetailsLoading = ref(false)
const birthDetails = ref<BirthDetails | null>(null)
const activeReceipt = ref<string | null>(null)
const formKey = computed(() => purchase.formKey.value)


const closeBirthDetailsModal = () => {
  console.log("Modal closing")
  purchase.closeForm()
  birthDetails.value = null
  activeReceipt.value = null
  slotBookingFormActive.value = false
}

onMounted(() => {
  initRegion()

  if (route.query.paymentStatus === 'Success') {
    showPaymentSuccess.value = true
  }

  if (personalRelationshipServices[0]) {
    console.log(getDodoProductId(personalRelationshipServices[0]))
    console.log(isDodoLiveMode.value)
  }
})


</script>

<style scoped>
div[data-slot="header"] h2 {
  font-size: 3rem;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}

.payment-success-checkmark {
  animation: scale-in 0.3s ease 0.2s both;
}

@keyframes scale-in {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>