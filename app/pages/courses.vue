<template>
  <div class="courses-page min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8">
    <section
             class="flex flex-col justify-center items-center mx-auto mb-8 mt-2 w-full max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl shadow-black/20 sm:p-8">
      <p class="w-full mb-2 text-sm font-semibold tracking-[0.2em] text-amber-300/80 uppercase">Galactic Gene Academy</p>
      <h1 class="w-full fancy text-5xl sm:text-6xl lg:text-7xl">Courses</h1>
      <p class="mx-auto mt-3 max-w-3xl text-base text-white/80 sm:text-lg">
        Learn astrology and related sciences through structured programs with practical guidance. Choose your track,
        level, and pace.
      </p>
    </section>

    <section v-for="group in courseGroups"
             :key="group.id"
             class="mx-auto mb-10 w-7xl">
      <div class="w-full mb-4 flex flex-wrap items-center justify-center gap-3 px-1">
        <h2 class="w-fit text-center flex justify-center items-center relative lines-on-sides">{{ group.heading }}</h2>
        <!-- <p class="text-sm font-semibold tracking-wide text-amber-200/90">{{ group.subheading }}</p> -->
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="course in group.courses"
             :key="course.id"
             class="group block">
          <article
                   class="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-white/8">
            <div class="relative">
              <UCarousel :items="course.media"
                         arrows
                         :ui="{
                          viewport: 'overflow-hidden',
                          container: 'items-center',
                          item: 'basis-full',
                          prev: '',
                          next: ''
                        }"
                         class="w-full touch-pan-y">
                <template #default="{ item }">
                  <div class="relative aspect-video w-full overflow-hidden bg-black/60">
                    <video v-if="item.type === 'video'"
                           :src="item.src"
                           class="pointer-events-none h-full w-full object-cover"
                           muted
                           autoplay
                           loop
                           playsinline
                           preload="metadata" />
                    <Icon v-if="item.type === 'video'"
                          name="mdi:play-circle"
                          class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-5xl text-white/90" />

                    <img v-else
                         :src="item.src"
                         :alt="item.alt"
                         class="h-full w-full object-cover"
                         loading="lazy">
                  </div>
                </template>
              </UCarousel>
            </div>

            <div class="min-h-full flex flex-col p-5 sm:p-6">

              <div class="mb-4 flex flex-col items-start justify-between gap-3">
                <NuxtLink :to="course.href"
                          class="text-2xl font-bold text-amber-400 opacity-90 hover:opacity-100 hover:text-amber-500  text-left leading-tight">
                  {{ course.title }}</NuxtLink>
                <span class="py-1 text-xs font-semibold tracking-wide text-amber-100">
                  {{ course.price }}
                </span>
              </div>

              <p class="mb-4 text-left text-sm leading-relaxed text-white/80">
                {{ course.description }}
              </p>

              <div class="mb-1 flex flex-wrap gap-2 text-xs font-semibold">
                <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/90">{{
                  course.duration }}</span>
                <span
                      class="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-emerald-100">Part
                  payment
                  available</span>
                <span class="rounded-full border px-3 py-1"
                      :class="course.level.includes('Fill')
                        ? 'border-sky-300/35 bg-sky-500/15 text-sky-100'
                        : 'border-amber-300/35 bg-amber-500/15 text-amber-100'">
                  {{ course.level }}
                </span>
              </div>


            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import video1 from '@/assets/media/video1.mp4'
import video2 from '@/assets/media/video2.mp4'
import showcase1 from '@/assets/images/showcase1.jpg'
import showcase2 from '@/assets/images/showcase2.jpg'
import showcase3 from '@/assets/images/showcase3.jpg'
import showcase4 from '@/assets/images/showcase4.jpg'
import showcase5 from '@/assets/images/showcase5.jpg'
import sketch1 from '@/assets/images/sketch1.png'
import sketch2 from '@/assets/images/sketch2.png'
import sketch3 from '@/assets/images/sketch3.png'
import sketch4 from '@/assets/images/sketch4.png'
import sketch5 from '@/assets/images/sketch5.png'
import blankChart from '@/assets/images/blank_chart.jpg'

type CourseMedia = {
  type: 'image' | 'video'
  src: string
  alt: string
}

type CourseCard = {
  id: string
  title: string
  level: string
  description: string
  price: string
  duration: string
  href: string
  media: CourseMedia[]
}

type CourseGroup = {
  id: string
  heading: string
  subheading: string
  courses: CourseCard[]
}

const courseGroups: CourseGroup[] = [
  {
    id: 'bnn',
    heading: 'Bhrigu Nandi Nadi',
    subheading: 'Basic & Advance Track',
    courses: [
      {
        id: 'bnn-basic-advance',
        title: 'BNN - Basic & Advance',
        level: 'Combined Program',
        description: 'A complete BNN journey from foundation to advanced application with guided practice and deep concept clarity.',
        price: 'INR 35,000',
        duration: '5 months',
        href: '/course/bnn-basic-advance',
        media: [
          { type: 'image', src: showcase1, alt: 'BNN class showcase image one' },
          { type: 'video', src: video1, alt: 'BNN class short video' },
          { type: 'image', src: sketch1, alt: 'BNN notes and chart example' },
        ],
      },
    ],
  },
  {
    id: 'vedic',
    heading: 'Vedic Astrology',
    subheading: 'Choose Your Level',
    courses: [
      {
        id: 'vedic-basic',
        title: 'Vedic - Basic',
        level: 'Basic',
        description: 'Perfect for beginners to build core understanding of houses, planets, signs, and reading fundamentals.',
        price: 'INR 15,000',
        duration: '2 months',
        href: '/course/vedic-basic',
        media: [
          { type: 'image', src: showcase2, alt: 'Vedic basic course showcase image one' },
          { type: 'image', src: blankChart, alt: 'Blank chart for Vedic basics' },
          { type: 'video', src: video2, alt: 'Vedic basics introduction video' },
        ],
      },
      {
        id: 'vedic-intermediate',
        title: 'Vedic - Intermediate',
        level: 'Intermediate',
        description: 'Develop interpretation confidence through layered chart analysis, yogas, and practical reading sessions.',
        price: 'INR 30,000',
        duration: '3 months',
        href: '/course/vedic-intermediate',
        media: [
          { type: 'image', src: sketch2, alt: 'Vedic intermediate worksheet' },
          { type: 'image', src: showcase3, alt: 'Vedic intermediate class highlight' },
          { type: 'video', src: video1, alt: 'Intermediate class clip' },
        ],
      },
      {
        id: 'vedic-advance',
        title: 'Vedic - Advance',
        level: 'Advance',
        description: 'Advanced-level mentoring with high-precision case studies and consultative frameworks.',
        price: 'Fill form for pricing',
        duration: 'Custom',
        href: '/course/vedic-advance',
        media: [
          { type: 'image', src: showcase4, alt: 'Vedic advanced seminar image' },
          { type: 'video', src: video2, alt: 'Advanced training clip' },
          { type: 'image', src: sketch3, alt: 'Advanced chart analysis notes' },
        ],
      },
    ],
  },
  {
    id: 'vastu',
    heading: 'Vastu',
    subheading: 'Structured Progression',
    courses: [
      {
        id: 'vastu-basic',
        title: 'Vastu - Basic',
        level: 'Basic',
        description: 'Learn core Vastu principles, directional energies, and foundational corrections for living spaces.',
        price: 'INR 20,000',
        duration: '2 months',
        href: '/course/vastu-basic',
        media: [
          { type: 'image', src: showcase5, alt: 'Vastu basic interior example' },
          { type: 'image', src: sketch4, alt: 'Vastu basic directional map' },
          { type: 'video', src: video1, alt: 'Vastu basic lesson video' },
        ],
      },
      {
        id: 'vastu-intermediate',
        title: 'Vastu - Intermediate',
        level: 'Intermediate',
        description: 'Move into applied Vastu with practical layouts, corrections, and personalized case evaluations.',
        price: 'INR 40,000',
        duration: '3 months',
        href: '/course/vastu-intermediate',
        media: [
          { type: 'image', src: sketch5, alt: 'Vastu intermediate worksheet' },
          { type: 'video', src: video2, alt: 'Vastu intermediate demo video' },
          { type: 'image', src: showcase2, alt: 'Vastu intermediate showcase image' },
        ],
      },
      {
        id: 'vastu-advance',
        title: 'Vastu - Advance',
        level: 'Advance',
        description: 'Master consulting-level Vastu diagnosis with advanced scenario handling and strategy design.',
        price: 'Fill form for pricing',
        duration: 'Custom',
        href: '/course/vastu-advance',
        media: [
          { type: 'image', src: showcase3, alt: 'Vastu advanced studio session' },
          { type: 'image', src: blankChart, alt: 'Vastu advanced planning chart' },
          { type: 'video', src: video1, alt: 'Vastu advanced practicals clip' },
        ],
      },
    ],
  },
  {
    id: 'signature-analysis',
    heading: 'Signature Analysis',
    subheading: 'Focused Specialist Course',
    courses: [
      {
        id: 'signature-analysis',
        title: 'Signature Analysis',
        level: 'Specialized',
        description: 'Decode personality and behavioral patterns through signature structures with practical interpretation.',
        price: 'INR 15,000',
        duration: '1 month',
        href: '/course/signature-analysis',
        media: [
          { type: 'image', src: sketch1, alt: 'Signature analysis handwriting sample' },
          { type: 'video', src: video2, alt: 'Signature analysis mini class video' },
          { type: 'image', src: showcase4, alt: 'Signature analysis session snapshot' },
        ],
      },
    ],
  },
]

const totalCourses = computed(() => courseGroups.reduce((total, group) => total + group.courses.length, 0))
const pageTitle = computed(() => `Courses (${totalCourses.value})`)

useHead(() => ({
  title: pageTitle.value
}))

useSeoMeta({
  title: pageTitle,
  ogTitle: computed(() => `${pageTitle.value} | Galactic Gene`),
  twitterTitle: computed(() => `${pageTitle.value} | Galactic Gene`)
})
</script>

<style scoped>
@media (max-width: 640px) {
  .courses-page {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }
}
</style>