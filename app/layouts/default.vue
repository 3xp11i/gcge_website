<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
     <div ref="sunEl"
         class="bg_art sun fixed! left-60 md:-top-4 w-20 h-20 rounded-full not-md:left-1/2 not-md:-top-1/12"
         :style="sunStyle"></div>


    <img src="@/assets/images/moon.png"
         alt="The Moon (Chandra)"
         class="moon absolute z-50 w-6 pointer-events-none rounded-full select-none"
         :style="moonStyle"
         v-show="$colorMode.preference == 'dark'" />

    <Navbar />

    <slot />

     <Footer class="mt-8" />

  </div>
</template>

<script lang="ts" setup>
import { useMouse } from '@vueuse/core'




const colorMode = useColorMode()


const { x, y } = useMouse({ touch: false, type: 'page' })

const sunEl = ref<HTMLElement | null>(null)


const cursorX = ref(0)
const cursorY = ref(0)
const smoothCursorX = ref(0)
const smoothCursorY = ref(0)
const moonX = ref(0)
const moonY = ref(0)
const moonFade = ref(0)
const moonOrbitRadius = 72
const moonOrbitAngle = ref(-1.36)
const sunPulsePhase = ref(0)


const moonStyle = ref({
  left: '0px',
  top: '0px',
  filter: 'brightness(1) saturate(1)',
  boxShadow: '0 0 20px 5px rgb(255, 255, 255)'
})


const sunStyle = ref({
  boxShadow: '0 0 5rem 2rem rgb(255, 191, 0)'
})

let animationFrameId = 0

watch([x, y], ([currentX, currentY]) => {
  cursorX.value = currentX
  cursorY.value = currentY
})




onMounted(() => {
  const initialX = x.value || window.scrollX + window.innerWidth * 0.5
  const initialY = y.value || window.scrollY + window.innerHeight * 0.5

  cursorX.value = initialX
  cursorY.value = initialY
  smoothCursorX.value = initialX
  smoothCursorY.value = initialY
  moonX.value = initialX
  moonY.value = initialY

  const animate = () => {
    const scrollOffset = window.scrollY

    smoothCursorX.value += (cursorX.value - smoothCursorX.value) * 0.06
    smoothCursorY.value += (cursorY.value - smoothCursorY.value) * 0.06
    moonOrbitAngle.value += 0.0010

    moonX.value = smoothCursorX.value + Math.cos(moonOrbitAngle.value) * moonOrbitRadius
    moonY.value = smoothCursorY.value + Math.sin(moonOrbitAngle.value) * moonOrbitRadius

    const sunRect = sunEl.value?.getBoundingClientRect()

    if (sunRect) {
      const sunCenterX = window.scrollX + sunRect.left + sunRect.width / 2
      const sunCenterY = window.scrollY + sunRect.top + sunRect.height / 2
      const moonCenterX = moonX.value + 12
      const moonCenterY = moonY.value + 12
      const distance = Math.hypot(moonCenterX - sunCenterX, moonCenterY - sunCenterY)
      const fadeDistance = 260

      moonFade.value = Math.min(1, Math.max(0, 1 - distance / fadeDistance))
    }

    const glowWave = 1 + Math.sin(sunPulsePhase.value) * 0.5
    sunPulsePhase.value += 0.005

    moonStyle.value = {
      left: `${moonX.value}px`,
      top: `${moonY.value}px`,
      filter: `brightness(${1 - moonFade.value}) saturate(${1 - moonFade.value})`,
      boxShadow: `0 0 ${20 * (1 - moonFade.value)}px ${5 * (1 - moonFade.value)}px rgb(255, 255, 255)`
    }

    sunStyle.value = {
      boxShadow: `0 0 ${4.5 + glowWave * 1.5}rem ${1.8 + glowWave * 0.8}rem rgba(255, 191, 0, ${0.7 + glowWave * 0.2})`
    }

    animationFrameId = window.requestAnimationFrame(animate)
  }

  animationFrameId = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameId)
})

</script>

<style>
.sun {
  background: radial-gradient(circle at center, #fffacd, #f0e68c, #ffe343);
  /* filter: blur(0.1rem); */
}

.moon {
  will-change: transform, filter, box-shadow;
}
</style>