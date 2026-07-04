<template>
  <div class="flex flex-col min-h-80 bg-gray-800 w-full relative">
    <!-- Footer content -->

    <img src="@/assets/images/footer_art.png"
         alt="Background art"
         class="absolute select-none -bottom-18 -left-2 max-h-full rotate-2" />

    <div
         class="footerLinks w-full text-md flex flex-col justify-between items-end gap-4 p-4 text-white relative z-10 mt-5">

      <div class="siteLinks w-full flex flex-col items-end justify-end gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">

        <div class="flex flex-col items-end gap-4">
          <NuxtLink to="/consultation">Book Consultation</NuxtLink>
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        </div>


        <div class="flex flex-col items-end gap-4">
          <NuxtLink to="/terms-and-conditions">Terms & Conditions</NuxtLink>
          <NuxtLink to="/refund-policy">Refund Policy</NuxtLink>
        </div>
      </div>

      <div class="socialLinks w-full flex flex-row gap-4 justify-center items-center text-4xl mt-4">
        <a href="https://www.instagram.com/galacticgeneastro/"
           target="_blank"
           rel="noopener noreferrer">
          <Icon name="mdi:instagram" />

        </a>
        <a href="https://reddit.com/r/AstrologyDiscovery"
           target="_blank"
           rel="noopener noreferrer">
          <Icon name="mdi:reddit" />
        </a>
        <a href="https://discord.gg/StDRRWxjd8"
           target="_blank"
           rel="noopener noreferrer">
          <Icon name="mdi:discord" />
        </a>
        <a href="https://wa.me/7678698072?text=Hi%2C%20I%20am%20here%20from%20the%20Galactic%20Gene%20website%2C%20and%20I%20need%20to%20know%20about%20your%20services."
           target="_blank"
           rel="noopener noreferrer">
          <Icon name="mdi:whatsapp" />
        </a>
      </div>

      <div class="w-full flex flex-col items-center gap-4 mt-4">
        <span class="copyrightText text-xs opacity-50">+91 7678698072 | support@galacticgene.com</span>
        <span class="copyrightText text-sm opacity-80">© {{ new Date().getFullYear() }} Galactic Gene. All rights reserved.</span>
      </div>
    </div>



  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
a {
  padding: 0.5rem;
}

a span{
  opacity: 0.8;
}

a:hover span{
  opacity: 1;
}

a:hover {
  text-decoration: underline;
  color: white;
  transition: color 0.3s ease-in-out;

}
</style>