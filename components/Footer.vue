<script lang="ts" setup>
const links = [
  { text: "Sobre nosotros", url: "/about" },
  { text: "Términos y condiciones", url: "/terms" },
  { text: "Ayuda", url: "/help" },
];
</script>

<template>
  <div class="bg-footer flex flex-col gap-3 w-full p-14 items-center">
    <div class="flex gap-6 justify-start w-full">
      <NuxtLink
        class="font-bold text-base text-[#99AABB] hover:opacity-80 transition"
        v-for="link in links"
        :key="link.url"
        :to="link.url"
        >{{ link.text }}</NuxtLink
      >
    </div>
    <p class="w-full text-[#9CB4CC] text-sm justify-start">
      © cineTrack - Todos los derechos reservados.
    </p>
  </div>
</template>