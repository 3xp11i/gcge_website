<template>
  <div>


    <h1 class="text-4xl">Galactic Gene</h1>
    
  </div>
</template>

<script lang="ts" setup>

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Community', href: '#community' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Links', href: '#links' },
]

const stats = [
  { label: 'Focus', value: 'Vedic astrology' },
  { label: 'Tone', value: 'Warm & grounded' },
  { label: 'Community', value: 'Subreddit • Insta • Discord' },
]

const aboutFeatures = [
  {
    icon: 'mdi:compass-rose',
    title: 'Guidance first',
    description: 'Use this space for practical astrology notes, not just visuals.',
  },
  {
    icon: 'mdi:account-star-outline',
    title: 'Founder-led',
    description: 'Highlight Sid and the personal voice behind the community.',
  },
]

const reviews = [
  {
    name: 'Aarav',
    role: 'Community member',
    image: 'https://picsum.photos/seed/review-1/160/160',
    quote: 'The energy feels calm, premium, and easy to trust. This is a solid home for future astrology content.',
  },
  {
    name: 'Meera',
    role: 'First-time visitor',
    image: 'https://picsum.photos/seed/review-2/160/160',
    quote: 'The gold-on-dark visual theme looks elegant, and the layout makes it easy to find the important links.',
  },
  {
    name: 'Kabir',
    role: 'Returning reader',
    image: 'https://picsum.photos/seed/review-3/160/160',
    quote: 'The sections feel organized and mobile friendly. It is a good base for adding real testimonials later.',
  },
]

const communityLinks = [
  {
    label: 'Subreddit',
    href: '#',
    icon: 'mdi:reddit',
    description: 'A place for discussions, questions, and shared community posts.',
  },
  {
    label: 'Instagram',
    href: '#',
    icon: 'mdi:instagram',
    description: 'Short-form updates, visuals, reels, and daily community touchpoints.',
  },
  {
    label: 'Discord',
    href: '#',
    icon: 'mdi:discord',
    description: 'A quieter space for live conversation, events, and deeper threads.',
  },
]

const faqs = [
  {
    question: 'What is Galactic Gene by Sid?',
    answer: 'A Vedic astrology community and content space with a premium, calm, space-inspired visual identity.',
  },
  {
    question: 'Can these sections be replaced later?',
    answer: 'Yes. The page is intentionally built with placeholder text and images so you can swap in final content quickly.',
  },
  {
    question: 'Is the page responsive and accessible?',
    answer: 'The layout uses semantic sections, keyboard-friendly links, details elements for FAQs, and mobile-first spacing.',
  },
]

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Refund Policy', href: '#' },
  { label: 'Terms and Conditions', href: '#' },
  { label: 'Contact', href: '#' },
]
</script>

<style>

</style>