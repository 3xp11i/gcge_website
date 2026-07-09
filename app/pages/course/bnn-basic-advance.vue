<template>
  <div class="mx-auto w-full max-w-6xl">
    <div>
      <img
        src="@/assets/images/bnn.png"
        alt="BNN course cover"
        class="h-56 w-full object-cover sm:h-72 lg:h-80 rounded-2xl"
      />
    </div>

    <div class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
      <main class="min-w-0">
        <p class="text-sm uppercase tracking-[0.2em] text-white/60">Course</p>
        <h1 class="mt-2 text-3xl! leading-tight sm:text-4xl!">{{ course.title }}</h1>
        <p class="mt-4 text-base leading-7 text-white/80">
          Learn Bhrigu Nandi Nadi astrology through a practical predictive approach. It draws fundamentals from Vedic
          and Western astrology, but follows a distinct analysis method.
        </p>
        <p class="mt-3 text-base leading-7 text-white/80">
          This system can handle up to around one hour of birth time change in the horoscope while keeping prediction
          quality intact.
        </p>

        <hr class="separator w-full! my-8!" />

        <h2 class="text-left">What Is Bhrigu Nandi Nadi Astrology?</h2>
        <p class="mt-4 text-base leading-7 text-white/80">
          This is a type of predictive astrology that stems from Vedic and Western astrology basics, but it is entirely
          different due to a new approach and point of view to analyze.
        </p>
        <p class="mt-3 text-base leading-7 text-white/80">
          Also, it can handle up to an hour of time change in horoscope and still remain intact with predictions.
        </p>

        <hr class="separator w-full! my-8!" />

        <h2 class="text-left">Course Content</h2>
        <ul class="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-white/80">
          <li>Introduction to Houses 1 to 12</li>
          <li>Every planet's result in each house (for example, what Mercury in 9th house means)</li>
          <li>Yuti and Yogas (formula and relation between planets)</li>
          <li>Fundamentals of retrograde planets</li>
          <li>Dhan Yogas (financial investment)</li>
          <li>Education (what type of education you should pursue)</li>
          <li>Profession (is job or business what is more suitable)</li>
          <li>Marriage (timing, divorce and compatibility checking)</li>
          <li>Property (when to invest in real estate markets)</li>
          <li>Foreign settlement and visa query (PR query etc.)</li>
          <li>Planets rounds (Jupiter round, Saturn round)</li>
          <li>Event equations</li>
          <li>Timeline (when something will happen)</li>
          <li>Rahu Ketu Dance (story of Cosmic Zero Zone)</li>
          <li>Remedies (code your own personalized ones)</li>
        </ul>

        <hr class="separator w-full! my-8!" />

        <h2 class="text-left">Information</h2>
        <ul class="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-white/80">
          <li>The language of teaching will be Hindi and English.</li>
          <li>There will be a separate batch for English speakers.</li>
          <li>Weekly two classes will be conducted for 1 hour 30 minutes.</li>
          <li>Length of course is between 4 to 5 months.</li>
          <li>Exact date and timings for each class will be discussed in group according to enrollment.</li>
          <li>In some cases, when you miss classes, recordings will be provided.</li>
        </ul>

        <hr class="separator w-full! my-8!" />

        <h2 class="text-left">Video Recordings</h2>
        <p class="mt-3 text-base leading-7 text-white/80">
          Placeholder recording section using sample assets. These can be replaced with actual batch recordings.
        </p>
        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <article v-for="recording in videoRecordings" :key="recording.title">
            <h3 class="text-left text-lg!">{{ recording.title }}</h3>
            <video
              :src="recording.src"
              class="mt-3 aspect-video w-full border border-white/10 bg-black object-cover"
              controls
              preload="metadata"
            />
          </article>
        </div>

        <hr class="separator w-full! my-8!" />

        <h2 class="text-left">FAQs</h2>
        <UAccordion
          :items="faqItems"
          type="multiple"
          :ui="{
            trigger: 'py-4',
            label: 'text-left text-lg font-semibold',
            content: 'text-left text-base leading-7 text-white/75 pb-4'
          }"
        />
      </main>

      <aside class="lg:pt-2">
        <div class="lg:sticky lg:top-24">
          <p class="text-sm uppercase tracking-[0.2em] text-white/60">Pricing</p>
          <p class="mt-3 text-3xl font-semibold text-white">{{ displayedPrice }}</p>
          <!-- <p class="mt-1 text-lg text-white/75">{{ regionPriceLabel }}</p> -->

          <UButton class="button mt-5 w-full justify-center" to="/consultation">
            Buy This Course
          </UButton>

          <p class="mt-4 text-sm leading-6 text-white/75">
            Price is same for everyone, no matter which country you are from. You can pay in easy monthly installments.
          </p>

          <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-white/75">
            <li>Student ID shared after payment</li>
            <li>Course certificate after completion</li>
            <li>Support for schedule coordination in the group</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { AccordionItem } from '@nuxt/ui'
import video1 from '@/assets/media/video1.mp4'
import video2 from '@/assets/media/video2.mp4'

definePageMeta({
  layout: 'course'
})

const course = reactive({
  title: 'BNN - Basic & Advance',
  slug: 'bnn-basic-advance',
  priceInr: 'INR 25,000',
  priceUsd: '$300'
})

const { selectedRegion, initRegion } = useRegionSelection()

const displayedPrice = computed(() => (selectedRegion.value === 'India' ? course.priceInr : course.priceUsd))
const regionPriceLabel = computed(() => (selectedRegion.value === 'India' ? 'India pricing' : 'International pricing'))

const pageTitle = computed(() => `${course.title} Course`)

useHead(() => ({
  title: pageTitle.value
}))

useSeoMeta({
  title: pageTitle,
  ogTitle: computed(() => `${pageTitle.value} | Galactic Gene`),
  twitterTitle: computed(() => `${pageTitle.value} | Galactic Gene`),
  ogType: 'article',
  ogUrl: computed(() => `/course/${course.slug}`)
})

const videoRecordings = [
  {
    src: video1,
    title: 'Recording 1'
  },
  {
    src: video2,
    title: 'Recording 2'
  }
]

const faqItems: AccordionItem[] = [
  {
    label: 'What language is used in teaching?',
    content: 'Classes are conducted in Hindi and English, with a separate batch for English speakers.'
  },
  {
    label: 'How long is the course and what is the weekly schedule?',
    content: 'The course runs for around 4 to 5 months, with two classes per week, each for 1 hour 30 minutes.'
  },
  {
    label: 'Will recordings be provided if I miss a class?',
    content: 'Yes. In some cases, if you miss a class, recordings will be provided.'
  },
  {
    label: 'What is the course fee and can I pay in installments?',
    content: 'The fee is 300 USD or 25K INR for everyone, regardless of country. Monthly installment options are available.'
  },
  {
    label: 'What do I receive after payment and after completing the course?',
    content: 'After payment, you will receive a Student ID and enrollment details. A course certificate is provided after completion.'
  }
]

onMounted(() => {
  initRegion()
})
</script>
