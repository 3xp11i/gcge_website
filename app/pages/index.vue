<template>
  <div class="home-page flex min-h-screen flex-col items-center justify-center ">

    <header class="relative flex w-full flex-col items-center justify-start text-center">
      <h1 class="mt-8 text-5xl sm:text-7xl lg:text-[10rem]! fancy relative">Galactic Gene

        <!-- <span class="text-2xl absolute -bottom-1 -right-3 font-bold">By Sid</span> -->

      </h1>

      <p class="fancy2 m-4 text-4xl sm:text-3xl lg:text-5xl">Discover Authentic Astrology</p>


      <div class="mediaPart flex w-full flex-col items-center my-8 mt-10">
        <UCarousel class-names
                   :auto-scroll="{speed:0.5}"
                   loop
                   arrows
                   :items="items"
                   @select="onCarouselSelect"
                   :ui="{
                    viewport: 'overflow-hidden ps-4',
                    container: 'items-center pl-2',
                    item: 'lg:basis-1/3',
                    prev: 'left-2 sm:left-4 top-1/2 -translate-y-1/2',
                    next: 'right-2 sm:right-4 top-1/2 -translate-y-1/2'
                  }"
                   class="mx-auto w-full ctive:cursor-grab touch-pan-y py-1">
          <template #default="{ item }">
            <article class="home-media-card overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm hover:cursor-pointer active:cursor-grab"
                     @click="openMediaPreview(item)">
              <video v-if="item.type === 'video'"
                     :ref="(el) => setCarouselVideoRef(el, item)"
                     :src="item.src"
                     class="pointer-events-none aspect-video w-full object-cover"
                     muted
                     autoplay
                loop
                     playsinline
                     preload="metadata" />
              <Icon v-if="item.type === 'video'"
                    name="mdi:play-circle"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl bg-gray-800 text-white/80 pointer-events-none" />

              <img v-else
                   :src="item.src"
                   :alt="item.alt"
                   class="aspect-video w-full object-cover"
                   loading="lazy">
            </article>
          </template>
        </UCarousel>
      </div>


      <div class="buttons flex flex-row items-center justify-center gap-4 mt-8 text-2xl! lg:my-10">


        <UButton class="button w-fit"
                 to="/consultation">Book a Consultation</UButton>

        <UButton class="button w-fit"
                 to="/resources">Explore Resources</UButton>
      </div>


      <!-- <img src="@/assets/images/mayur.png"
           alt="Peacock"
           :style="peacockStyle"
           class="bg_art w-80 lg:bottom-2/12 lg:right-0  not-md:-right-1/3  not-md:opacity-30 -bottom-1/2" /> -->

    </header>


    <hr class="separator">


    <section id="about"
             class="flex flex-col items-center justify-between gap-8 md:flex-row! relative">

      <img src="@/assets/images/flower.png"
           alt="Flowers"
           :style="flowerStyle"
           class="bg_art w-80 -bottom-40 -left-70 rotate-30 opacity-30" />


      <div class="textPart flex flex-col gap-4 w-fit px-10">

        <h2>Who Are We?</h2>
        <p>
          Galactic Gene is a Vedic astrology community and content space with a premium, calm, space-inspired visual
          identity. We provide resources, discussions, and insights for those interested in exploring their cosmic path.
        </p>
        <UButton class="button w-fit"
                 to="/about">Read More</UButton>

      </div>

      <!-- arrows -->

      <UModal v-model:open="mediaPreviewOpen"
              :title="selectedMedia?.alt || 'Media preview'"
              :description="selectedMedia?.type === 'video' ? 'Video preview' : 'Image preview'"
              :ui="{
                content: 'w-[calc(100vw-1rem)] max-w-5xl rounded-3xl overflow-hidden',
                body: 'p-0',
                header: 'flex items-center justify-between gap-4 p-4 sm:p-6 min-h-(--ui-header-height)'
              }">
        <template #content>
          <div class="bg-black/90">
            <video v-if="selectedMedia?.type === 'video'"
                   :src="selectedMedia.src"
                   class="max-h-[80dvh] w-full object-contain bg-black"
                   controls
                   autoplay
                   playsinline
                   preload="metadata" />

            <img v-else-if="selectedMedia"
                 :src="selectedMedia.src"
                 :alt="selectedMedia.alt"
                 class="max-h-[80dvh] w-full object-contain bg-black"
                 loading="eager">
          </div>
        </template>
      </UModal>


    </section>

    <hr class="separator">


    <section id="reviews"
             class="">
      <div class="upperText mb-4">

        <h2 class="text-left">Reviews</h2>
        <p class="my-1">
          Hear from our members about their experiences and the impact Galactic Gene has had on their cosmic journey.
        </p>
      </div>

      <div class="ReviewCards flex flex-col md:flex-row! items-center justify-center gap-8 w-full">

        <UCarousel class-names
                   :autoplay="{ delay: 5000 }"
                   dots
                   wheel-gestures
                   :items="reviews"
                   @select="onCarouselSelect"
                   :ui="{
                    viewport: 'overflow-hidden ps-4',
                    container: 'items-center pl-2',
                    item: 'basis-[88%] sm:basis-[80%] lg:basis-[60%] ps-2 p-4 sm:ps-0 transition-opacity duration-300 [&:not(.is-snapped)]:opacity-35 [&:not(.is-snapped)]:scale-90 [&:not(.is-snapped)]:grayscale [&.is-snapped]:opacity-100 [&.is-snapped]:scale-100 [&.is-snapped]:translate-y-0 [&.is-snapped]:grayscale-0 [&.is-snapped]:z-10 select-none',
                    prev: 'left-2 sm:left-4 top-1/2 -translate-y-1/2',
                    next: 'right-2 sm:right-4 top-1/2 -translate-y-1/2',
                    dots: 'pt-3',
                    dot: 'theme-carousel-dot size-2.5 rounded-full transition-all duration-200'
                  }"
                   class="home-reviews-carousel mx-auto w-full ctive:cursor-grab touch-pan-y py-1">
          <template #default="{ item }">
            <article class="overflow-hidden rounded-3xl  shadow-2xl shadow-black/20 hover:cursor-pointer active:cursor-grab"
                     @click="item.src ? openReviewMediaPreview(item) : null">
                <div class="reviewCard home-review-card flex flex-col items-start justify-center gap-4 rounded-3xl shadow-2xl shadow-black/20 backdrop-blur-sm hover:cursor-pointer active:cursor-grab"
                   :class="{
                  'home-review-text-card p-4 border border-white/10 bg-white/15': !item.src,
                  }">

                <h4 class="text-lg font-semibold">{{ item.name }}</h4>
                <p class="text-left text-base opacity-60"
                   v-if="!item.src">"{{ item.quote }}"</p>

                <img v-if="item.src"
                     :src="item.src"
                     :alt="item.alt || item.quote"
                     class="aspect-auto rounded-xl w-full object-cover">

                <UButton :to="item.link"
                         v-if="item.link"
                         class="w-fit hover:text-white! text-sm place-self-end self"
                         size="xs"
                         variant="ghost"
                         target="_blank">
                  Go to Review
                  <Icon name="mdi:arrow-right" />
                </UButton>

              </div>
            </article>
          </template>
        </UCarousel>



      </div>

    </section>



    <hr class="separator">


    <section id="community"
             class="flex relative">


      <img src="@/assets/images/birds.png"
           alt="Birds"
           :style="birdsStyle"
           class="bg_art -top-3/4 -right-1/4 not-md:opacity-30" />

      <div class="upperText mb-4">

        <h2 class="text-left">Our Community</h2>
        <p class="my-2">
          Join our vibrant community of Vedic astrology enthusiasts. Share your insights, ask questions, and connect
          with
          like-minded individuals on your cosmic journey.
        </p>
      </div>

      <div class="socialCards flex w-full flex-col items-center justify-center gap-8 md:flex-row!">

        <div
             class="discordCard relative m-4 flex w-full rounded-3xl border-2 border-[#7289da] transition-transform hover:scale-105 md:w-1/2">
          <img src="@/assets/images/discord_server.png"
               alt="Discord server image"
               class="w-full object-cover blur-[2px] rounded-3xl select-none pointer-events-none" />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 w-full text-white">
            <p class="">Connect, Talk & Learn! <br> We are waiting for you to join ♥️
            </p>
            <UButton icon="ic:baseline-discord"
                     class="button w-fit bg-[#7289da]! text-white!"
                     to="https://discord.gg/StDRRWxjd8">Join Discord</UButton>
          </div>
        </div>
        <div
             class="redditCard relative m-4 flex w-full rounded-3xl border-2 border-[#ff6314] transition-transform hover:scale-105 md:w-1/2">
          <img src="@/assets/images/reddit.png"
               alt="Reddit community image"
               class="w-full object-cover blur-[2px] rounded-3xl select-none pointer-events-none" />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 w-full text-white">
            <p class="">Feel free to ask any doubt or question 🌱
            </p>
            <UButton icon="ic:baseline-reddit"
                     class="button w-fit bg-[#ff6314]! text-white!"
                     to="https://reddit.com/r/AstrologyDiscovery">Join Reddit</UButton>
          </div>
        </div>
      </div>

    </section>

    <hr class="separator">

    <section id="faq"
             class="flex flex-col items-center justify-center gap-20 md:flex-row!">

      <div class="mediaPart flex w-full items-center justify-center md:w-1/2">
        <img src="@/assets/images/sunflower.webp"
             alt="Sunflower photo by Cena"
             class="rounded-2xl w-full not-md:w-3/4 object-cover shadow-md shadow-black" />
      </div>
      <div class="textPart flex w-full flex-col gap-4">

        <h2 class="text-left">FAQs</h2>
        <UAccordion :items="faqItems"
                    class="flex flex-col gap-4 w-full"
                    type="multiple"
                    :ui="{
                      item: 'theme-accordion-item border-b last:border-b-0',
                      label: 'text-left text-lg font-semibold',
                      content: 'text-left text-base opacity-60',
                    }"
                    :unmount-on-hide="false">
          <template #body="{ item }">
            <MDC :value="item.content || ''"
                 unwrap="p" />
          </template>
        </UAccordion>
      </div>


    </section>



  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { AccordionItem } from '@nuxt/ui'
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
import blank_chart from '@/assets/images/blank_chart.jpg'

import review1 from '@/assets/images/review1.png'
import review2 from '@/assets/images/review2.png'
import review3 from '@/assets/images/review3.png'
import review4 from '@/assets/images/review4.png'
import review5 from '@/assets/images/review5.png'
import review6 from '@/assets/images/review6.png'
import review7 from '@/assets/images/review7.png'
import review8 from '@/assets/images/review8.png'

import { button } from '#build/ui'

type MediaItem = {
  type: 'image' | 'video'
  src: string
  alt: string
}

type ReviewItem = {
  name: string
  src?: string
  link?: string
  quote?: string
  alt?: string
}

const mediaPreviewOpen = ref(false)
const selectedMedia = ref<MediaItem | null>(null)
const activeCarouselIndex = ref(0)
const carouselVideoRefs = new Map<number, HTMLVideoElement>()

const birdsStyle = ref({ transform: 'translateY(0px)' })
const flowerStyle = ref({ transform: 'translateY(0px)' })
const peacockStyle = ref({ transform: 'rotate(0deg)' })


watch(activeCarouselIndex, (index) => {
  carouselVideoRefs.forEach((videoElement, videoIndex) => {
    if (videoIndex !== index) {
      videoElement.pause()
      videoElement.currentTime = 0
    }
  })
})

watch(mediaPreviewOpen, async (isOpen) => {
  if (isOpen) {
    carouselVideoRefs.forEach((videoElement) => {
      videoElement.pause()
    })

    return
  }

  const activeVideo = carouselVideoRefs.get(activeCarouselIndex.value)

  if (activeVideo) {
    try {
      await activeVideo.play()
    } catch {
      // Ignore autoplay or visibility restrictions.
    }
  }
})

onMounted(() => {

  const animate = () => {
    const scrollOffset = window.scrollY


    birdsStyle.value = {
      transform: `translateY(${scrollOffset * 0.15}px)`
    }

    flowerStyle.value = {
      transform: `translateY(${scrollOffset * 0.08}px)`
    }
    peacockStyle.value = {
      transform: `rotate(${scrollOffset * 0.02}deg)`
    }

  }

})

function openMediaPreview(item: MediaItem) {
  selectedMedia.value = item
  mediaPreviewOpen.value = true
}

function openReviewMediaPreview(item: ReviewItem) {
  if (!item.src) {
    return
  }

  selectedMedia.value = {
    type: 'image',
    src: item.src,
    alt: item.alt || item.quote || item.name || 'Review image',
  }
  mediaPreviewOpen.value = true
}

function onCarouselSelect(selectedIndex: number) {
  activeCarouselIndex.value = selectedIndex
}

function getFaqContent(content: string | undefined) {
  return content ?? ''
}

function setCarouselVideoRef(element: unknown, item: MediaItem) {
  if (!(element instanceof HTMLVideoElement) || item.type !== 'video') {
    return
  }

  const videoElement = element
  const itemIndex = items.findIndex(mediaItem => mediaItem === item)

  if (itemIndex !== -1) {
    carouselVideoRefs.set(itemIndex, videoElement)

    if (itemIndex !== activeCarouselIndex.value) {
      videoElement.pause()
      videoElement.currentTime = 0
    }
  }
}


const items: MediaItem[] = [
  {
    type: 'image',
    src: sketch1,
    alt: 'Sketch 1'
  },
  {
    type: 'image',
    src: blank_chart,
    alt: 'Blank Chart Predictions'
  },
  {
    type: 'image',
    src: sketch2,
    alt: 'Sketch 2'
  },
  {
    type: 'video',
    src: video2,
    alt: 'Another community video'
  },
  {
    type: 'image',
    src: sketch3,
    alt: 'Sketch 3'
  },
  {
    type: 'image',
    src: sketch4,
    alt: 'Sketch 4'
  },
  {
    type: 'image',
    src: sketch5,
    alt: 'Sketch 5'
  },
]

const faqItems = ref<AccordionItem[]>([
  {
    label: 'Is this community paid?',
    content: 'No, this community is free for all to join and interact.'
  },
  {
    label: 'Can I get a reading of my chart?',
    content: 'For general and basic reading you can talk to the analysts present in the community, and for in-depth and accurate reading you can book a [consultation](/consultation).'
  },
  {
    label: 'What do I get from joining the community?',
    content: 'You get access to a community of like-minded individuals, discussions, resources, and insights related to astrology. You can ask questions, share your experiences, and learn from others.'
  }
])

const reviews = [
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstrologyCharts/comments/1u3d7hg/comment/or4wly1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "Thank you so much for your description! And you are spot on! I love astrology for this reason. I hope one day i can read a chart as well as you do🙏🏻",
  },
  {
    name: "",
    src: review1,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstroSynastry/comments/1u8kz6d/comment/os9ruxl/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "thank you SO MUCH! this all makes a lot of sense. we are still early days, but have had many talks about our intentions and the future. I feel that I can talk to him about anything and I'm met with such openness and a genuine commitment to understanding. it is wonderful.",
  },
  {
    name: "",
    src: review2,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstrologyDiscovery/comments/1ugm5oc/comment/oua80ad/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "wow thank you for the amazing and in depth analysis!! you described her perfectly! It’s so intriguing to me how much this impacts a persons character!",
  },
  {
    name: "",
    src: review3,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstrologyDiscovery/comments/1ttcvmn/comment/opbikwe/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "Wow! Honestly, you just read me like you’ve known me forever! Thank you. I have much to learn but I’m it’s fascinating how much my chart revealed to you 💖✨",
  },
  {
    name: "",
    src: review4,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstrologyCharts/comments/1u3d7hg/comment/or4wly1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "Thank you so much for your description! And you are spot on! I love astrology for this reason. I hope one day i can read a chart as well as you do🙏🏻",
  },
  {
    name: "",
    src: review5,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "",
    src: review6,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/palmistry/comments/1u9k15f/comment/oshsko0/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "This is an awesome read, incredibly spot on! I really appreciate you mentioned routine, I always feel like I want it so bad but it just doesn’t work for me, no matter what I try. I’m trying to find what works for me there for sure, I need a lot of emotional and intellectual stimulation and often find myself growing bored of things I do often...",
  },
  {
    name: "",
    src: review7,
    link: "",
    type: "image",
    alt: "",
  },
  {
    name: "Reddit user",
    link: "https://www.reddit.com/r/AstrologyCharts/comments/1ttymnr/comment/op6heh9/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
    quote:
      "Thank you so much for such a detailed reply! I can’t lie and say it’s given any closure but it’s still extremely interesting to read your work. I’m just stuck in this feeling because ive never dated and only experienced very traumatic situations involving romance. I’ve been afraid of romance because when I was young and naive I used to...",
  },
  {
    name: "",
    src: review8,
    link: "",
    type: "image",
    alt: "",
  },
];



</script>

<style>
.light .home-page {
  color: #11202f;
}

.light .home-page .home-media-card {
  background-color: rgba(255, 255, 255, 0.82);
  border-color: rgba(17, 32, 47, 0.16);
}

.light .home-page .home-review-card {
  box-shadow: 0 20px 35px -20px rgba(14, 30, 47, 0.4);
}

.light .home-page .home-review-text-card {
  background-color: rgba(255, 255, 255, 0.72);
  border-color: rgba(17, 32, 47, 0.2);
}

.light .home-page .reviewCard p {
  color: rgba(17, 32, 47, 0.78);
}

.light .home-page .discordCard,
.light .home-page .redditCard {
  box-shadow: 0 18px 30px -18px rgba(17, 32, 47, 0.45);
}

</style>