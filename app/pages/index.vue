<template>
  <div class=" flex min-h-screen flex-col items-center justify-center ">

    <header class="relative flex min-h-screen w-full flex-col items-center justify-start text-center">
      <h1 class="mt-8 text-5xl sm:text-7xl lg:text-[10rem]! fancy relative">Galactic Gene

        <!-- <span class="text-2xl absolute -bottom-1 -right-3 font-bold">By Sid</span> -->

      </h1>

      <p class="fancy2 m-4 text-4xl sm:text-3xl lg:text-5xl">Discover Authentic Astrology</p>


      <div class="mediaPart flex w-full flex-col items-center my-8 mt-10">
        <UCarousel class-names
                   dots
                   :autoplay="{ delay: 2000 }"
                   wheel-gestures
                   :items="items"
                   @select="onCarouselSelect"
                   :ui="{
                    viewport: 'overflow-hidden ps-4',
                    container: 'items-center pl-2',
                    item: 'basis-[88%] sm:basis-[80%] lg:basis-[40%] ps-2 p-4 sm:ps-0 transition-opacity duration-300 [&:not(.is-snapped)]:opacity-35 [&:not(.is-snapped)]:scale-90 [&:not(.is-snapped)]:grayscale [&.is-snapped]:opacity-100 [&.is-snapped]:scale-100 [&.is-snapped]:translate-y-0 [&.is-snapped]:grayscale-0 [&.is-snapped]:z-10 select-none',
                    prev: 'left-2 sm:left-4 top-1/2 -translate-y-1/2',
                    next: 'right-2 sm:right-4 top-1/2 -translate-y-1/2'
                  }"
                   class="mx-auto w-full ctive:cursor-grab touch-pan-y py-1">
          <template #default="{ item }">
            <article class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm hover:cursor-pointer active:cursor-grab"
                     @click="openMediaPreview(item)">
              <video v-if="item.type === 'video'"
                     :ref="(el) => setCarouselVideoRef(el, item)"
                     :src="item.src"
                     class="pointer-events-none aspect-video w-full object-cover"
                     muted
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


      <div class="buttons flex flex-row items-center justify-center gap-4 mt-8 text-2xl! my-10">


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


      <div class="textPart flex flex-col gap-4 w-fit px-20">

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


    <section id="reviews">
      <div class="upperText mb-4">

        <h2 class="text-left">Reviews</h2>
        <p class="my-5">
          Hear from our members about their experiences and the impact Galactic Gene has had on their cosmic journey.
        </p>

        <div class="ReviewCards flex flex-col md:flex-row! items-center justify-center gap-8 w-full mt-5">


          

          <div class="reviewCard flex flex-col items-center justify-center gap-4 p-4 rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-sm hover:cursor-pointer active:cursor-grab"
               v-for="(item, index) in reviews"
               :key="index">
            <!-- 
            <img :src="item.image"
                 :alt="item.name"
                 class="w-20 h-20 rounded-full object-cover" /> -->
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-sm opacity-70">{{ item.role }}</p>
            <p class="text-center text-base opacity-60">"{{ item.quote }}"</p>
            <UButton :to="item.link"
                     class="w-fit hover:text-white! text-sm place-self-end self"
                     size="xs"
                     variant="ghost">
              Go to Review
              <Icon name="mdi:arrow-right" />
            </UButton>

          </div>

        </div>
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
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 w-full">
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
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 w-full">
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
                      label: 'text-left text-lg font-semibold',
                      content: 'text-left text-base opacity-60',
                    }"
                    :unmount-on-hide="false">
          <template #body="{ item }">
            <MDC :value="item.content"
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



import { button } from '#build/ui'

type MediaItem = {
  type: 'image' | 'video'
  src: string
  alt: string
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

function onCarouselSelect(selectedIndex: number) {
  activeCarouselIndex.value = selectedIndex
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
    src: showcase5,
    alt: 'Showcase image 5'
  },
  {
    type: 'video',
    src: video1,
    alt: 'Featured community video'
  },
  {
    type: 'video',
    src: video2,
    alt: 'Another community video'
  },
  // {
  //   type: 'image',
  //   src: discordImage,
  //   alt: 'Discord server banner'
  // },
  {
    type: 'image',
    src: showcase1,
    alt: 'Showcase image 1'
  },
  {
    type: 'image',
    src: showcase2,
    alt: 'Showcase image 2'
  },
  {
    type: 'image',
    src: showcase3,
    alt: 'Showcase image 3'
  },
  {
    type: 'image',
    src: showcase4,
    alt: 'Showcase image 4'
  }
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
    content: 'You get access to a community of like-minded individuals, discussions, resources, and insights related to Vedic astrology. You can ask questions, share your experiences, and learn from others.'
  }
])

const reviews = [
  {
    name: "Aarav",
    role: "Community member",
    image: "https://picsum.photos/seed/review-1/160/160",
    link: "#",
    quote:
      "The predictions and insights provided by Galactic Gene have been incredibly accurate and helpful in my personal growth journey.",
  },
  {
    name: "Meera",
    role: "First-time visitor",
    image: "https://picsum.photos/seed/review-2/160/160",
    link: "#",
    quote:
      "I didn't believe in astrology but after joining Galactic Gene, I have understood that it works in magical ways!",
  },
  {
    name: "Kabir",
    role: "Returning learner",
    image: "https://picsum.photos/seed/review-3/160/160",
    link: "#",
    quote:
      "There aren't many places online for a young person to talk peacefully about astrology, but Galactic Gene is one of the best communities I have found.",
  },
];



</script>

<style>
.bg_art {
  position: absolute;
  /* top: 0;
  right: 0; */
  /* width: 100%; */
  /* height: auto; */
  z-index: -1;
  user-select: none;
}
</style>